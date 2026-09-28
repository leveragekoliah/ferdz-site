import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// /api/usdjpy — live USD/JPY candles from Yahoo Finance (JPY=X). Yahoo doesn't allow
// browser (CORS) requests, so the dev/preview server fetches it and hands the page clean
// JSON. When this moves to Lovable, port `fetchUsdJpy` into a Supabase edge function.
const RANGES: Record<string, { range: string; interval: string }> = {
  '1D': { range: '1d', interval: '15m' },
  '5D': { range: '5d', interval: '60m' },
  '1M': { range: '1mo', interval: '1d' },
  '6M': { range: '6mo', interval: '1d' },
  '1Y': { range: '1y', interval: '1wk' },
}

type YahooChart = {
  chart: {
    result?: {
      meta: { regularMarketPrice: number; regularMarketTime: number; previousClose?: number; chartPreviousClose?: number }
      timestamp?: number[]
      indicators: { quote: { open: (number | null)[]; high: (number | null)[]; low: (number | null)[]; close: (number | null)[] }[] }
    }[]
    error?: { description: string } | null
  }
}

const cache = new Map<string, { at: number; body: string }>()

async function fetchUsdJpy(tf: string) {
  const { range, interval } = RANGES[tf] ?? RANGES['6M']
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/JPY=X?range=${range}&interval=${interval}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`Yahoo ${res.status}`)
  const json = (await res.json()) as YahooChart
  const r = json.chart.result?.[0]
  if (!r || !r.timestamp) throw new Error(json.chart.error?.description ?? 'No data')
  const q = r.indicators.quote[0]
  const candles = r.timestamp
    .map((t, i) => ({ t: t * 1000, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i] }))
    .filter((k): k is { t: number; o: number; h: number; l: number; c: number } =>
      [k.o, k.h, k.l, k.c].every((v) => typeof v === 'number' && Number.isFinite(v)),
    )
  return {
    symbol: 'USD/JPY',
    timeframe: tf,
    interval,
    price: r.meta.regularMarketPrice,
    asOf: r.meta.regularMarketTime * 1000,
    candles,
  }
}

function usdJpyApi(): Plugin {
  const handler = async (req: { url?: string }, res: import('node:http').ServerResponse, next: () => void) => {
    if (!req.url?.startsWith('/api/usdjpy')) return next()
    const tf = new URL(req.url, 'http://x').searchParams.get('tf') ?? '6M'
    const key = RANGES[tf] ? tf : '6M'
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    const hit = cache.get(key)
    if (hit && Date.now() - hit.at < 60_000) return res.end(hit.body)
    try {
      const body = JSON.stringify(await fetchUsdJpy(key))
      cache.set(key, { at: Date.now(), body })
      res.end(body)
    } catch (err) {
      if (hit) return res.end(hit.body) // serve the last good copy rather than nothing
      res.statusCode = 502
      res.end(JSON.stringify({ error: (err as Error).message }))
    }
  }
  return {
    name: 'usdjpy-api',
    configureServer: (server) => void server.middlewares.use(handler),
    configurePreviewServer: (server) => void server.middlewares.use(handler),
  }
}

// /api/credit-lead — the free-credit-audit form (src/components/CreditLeadForm.tsx).
// DEV/LOCAL SINK ONLY: validated leads are appended to ../leads/credit-leads.jsonl (gitignored).
// On Lovable this must become a Supabase table + edge function, with its own notification.
function creditLeadApi(): Plugin {
  const LEADS = fileURLToPath(new URL('../leads/credit-leads.jsonl', import.meta.url))
  const handler = async (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, next: () => void) => {
    if (!req.url?.startsWith('/api/credit-lead')) return next()
    res.setHeader('Content-Type', 'application/json')
    if (req.method !== 'POST') {
      res.statusCode = 405
      return res.end(JSON.stringify({ error: 'POST only' }))
    }
    let raw = ''
    for await (const chunk of req) {
      raw += chunk
      if (raw.length > 10_000) break
    }
    let body: Record<string, unknown> = {}
    try {
      body = JSON.parse(raw)
    } catch {
      /* invalid JSON falls through to validation */
    }
    const str = (k: string, max: number) => String(body[k] ?? '').trim().slice(0, max)
    const lead = {
      firstName: str('firstName', 22),
      lastName: str('lastName', 22),
      email: str('email', 120).toLowerCase(),
      phone: str('phone', 20).replace(/\D/g, ''),
    }
    const errors: string[] = []
    if (!lead.firstName) errors.push('firstName')
    if (!lead.lastName) errors.push('lastName')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.push('email')
    if (lead.phone.length !== 10) errors.push('phone')
    if (str('company', 200)) {
      // honeypot filled in: pretend success, store nothing
      return res.end(JSON.stringify({ ok: true }))
    }
    if (errors.length) {
      res.statusCode = 400
      return res.end(JSON.stringify({ error: 'invalid', fields: errors }))
    }
    const { appendFile, mkdir } = await import('node:fs/promises')
    const { dirname } = await import('node:path')
    await mkdir(dirname(LEADS), { recursive: true })
    await appendFile(LEADS, JSON.stringify({ ...lead, source: 'ferdz.io/free-credit-audit', at: new Date().toISOString() }) + '\n')
    res.end(JSON.stringify({ ok: true }))
  }
  return {
    name: 'credit-lead-api',
    configureServer: (server) => void server.middlewares.use(handler),
    configurePreviewServer: (server) => void server.middlewares.use(handler),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), usdJpyApi(), creditLeadApi()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: Number(process.env.PORT) || 4808 },
})
