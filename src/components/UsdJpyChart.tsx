import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

// Live USD/JPY candle chart — adapted from "Candle Chart" by ssychui on 21st.dev.
// Changes: real Yahoo Finance data via /api/usdjpy (refreshes every 60s) instead of a seeded
// series, yen formatting, no volume pane (spot FX has no real volume), resize handles removed,
// site colour tokens.

type Candle = { t: number; o: number; h: number; l: number; c: number }
type Feed = { price: number; asOf: number; interval: string; candles: Candle[] }

const UP = '#34c28a'
const DOWN = '#d0625f'
const TIMEFRAMES = ['1D', '5D', '1M', '6M', '1Y'] as const
type TF = (typeof TIMEFRAMES)[number]

const VB_W = 560
const VB_H = 260
const AXIS_W = 52

const fmtPrice = (v: number) => `¥${v.toFixed(3)}`
const fmtAxis = (v: number) => v.toFixed(2)
const intraday = (i: string) => i.endsWith('m')
const fmtLabel = (t: number, i: string) =>
  intraday(i)
    ? new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
    : new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
const fmtTick = (t: number, i: string) =>
  intraday(i)
    ? new Date(t).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function UsdJpyChart({ compact = false, initial = '6M' as TF }: { compact?: boolean; initial?: TF }) {
  const reduced = useReducedMotion()
  const [tf, setTf] = useState<TF>(initial)
  const [feed, setFeed] = useState<Feed | null>(null)
  const [error, setError] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch(`/api/usdjpy?tf=${tf}`)
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as Feed
        if (!data.candles?.length) throw new Error('empty')
        if (alive) {
          setFeed(data)
          setError(false)
        }
      } catch {
        if (alive) setError(true)
      }
    }
    load()
    const id = setInterval(() => document.visibilityState === 'visible' && load(), 60_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [tf])

  const view = feed?.candles ?? []
  const vn = view.length
  const { lo, hi } = useMemo(() => {
    if (!vn) return { lo: 0, hi: 1 }
    const l = Math.min(...view.map((k) => k.l))
    const h = Math.max(...view.map((k) => k.h))
    const pad = (h - l) * 0.08 || 0.1
    return { lo: l - pad, hi: h + pad }
  }, [view, vn])

  const plotW = VB_W - AXIS_W
  const slot = vn ? plotW / vn : 1
  const bodyW = Math.max(1, slot * 0.6)
  const xMid = (i: number) => i * slot + slot / 2
  const y = (v: number) => (1 - (v - lo) / (hi - lo)) * VB_H
  const ticks = [0, 1, 2, 3].map((i) => hi - ((hi - lo) * (i + 0.5)) / 4)

  const last = vn ? view[vn - 1] : null
  const price = feed?.price ?? last?.c ?? 0
  const rangePct = vn ? ((price - view[0].o) / view[0].o) * 100 : 0
  const rangeUp = rangePct >= 0
  const active = hover !== null && vn ? view[hover] : null
  const activeUp = active ? active.c >= active.o : true

  const onMove = (e: React.PointerEvent) => {
    const r = svgRef.current?.getBoundingClientRect()
    if (!r || !vn) return
    const px = ((e.clientX - r.left) / r.width) * VB_W
    setHover(px > plotW ? null : Math.max(0, Math.min(vn - 1, Math.floor(px / slot))))
  }

  return (
    <div className={`w-full ${compact ? 'p-1' : 'hl-card p-5 md:p-6'}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-muted">
            <span className="text-ink">USD/JPY</span>
            <span>· Forex</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[10px] normal-case tracking-normal">
              <span className={`h-1.5 w-1.5 rounded-full ${error ? 'bg-muted' : 'animate-pulse bg-[#34c28a]'}`} />
              {error ? 'Feed paused' : 'Live'}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[32px] leading-none tabular-nums">{feed ? fmtPrice(price) : '—'}</span>
            {feed && (
              <span className="text-[14px] tabular-nums" style={{ color: rangeUp ? UP : DOWN }}>
                {rangeUp ? '+' : '−'}
                {Math.abs(rangePct).toFixed(2)}% <span className="text-muted">{tf}</span>
              </span>
            )}
          </div>
        </div>
        {!compact && (
          <div className="flex items-center gap-0.5 rounded-full border border-line p-0.5">
            {TIMEFRAMES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={t === tf}
                onClick={() => {
                  setTf(t)
                  setHover(null)
                }}
                className={`relative rounded-full px-3 py-1 text-[12px] transition-colors duration-200 ${
                  t === tf ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {t === tf && (
                  <motion.span
                    layoutId="usdjpy-tf"
                    className="absolute inset-0 rounded-full bg-ink/10"
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative mt-5">
        {!vn ? (
          <div className="flex aspect-[560/260] items-center justify-center text-[14px] text-muted">
            {error ? 'Live price feed is unavailable right now.' : 'Loading live USD/JPY…'}
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full touch-none"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label={`USD/JPY ${tf} candlestick chart, last ${fmtPrice(price)}`}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={0} x2={plotW} y1={y(t)} y2={y(t)} stroke="rgba(244,239,230,0.06)" />
                <text x={VB_W - 2} y={y(t) + 3} textAnchor="end" fill="rgba(244,239,230,0.4)" fontSize={9} className="tabular-nums">
                  {fmtAxis(t)}
                </text>
              </g>
            ))}
            <line x1={0} x2={plotW} y1={y(price)} y2={y(price)} stroke={rangeUp ? UP : DOWN} strokeOpacity={0.5} strokeDasharray="2 4" />
            <g transform={`translate(${plotW + 2}, ${Math.max(0, Math.min(VB_H - 16, y(price) - 8))})`}>
              <rect width={AXIS_W - 2} height={16} rx={3} fill={rangeUp ? UP : DOWN} />
              <text x={(AXIS_W - 2) / 2} y={11} textAnchor="middle" fontSize={9} fontWeight={600} fill="#0c0b0a" className="tabular-nums">
                {fmtAxis(price)}
              </text>
            </g>

            <motion.g key={tf} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {view.map((k, i) => {
                const color = k.c >= k.o ? UP : DOWN
                const top = y(Math.max(k.o, k.c))
                const bottom = y(Math.min(k.o, k.c))
                return (
                  <g key={k.t} style={{ opacity: hover !== null && hover !== i ? 0.45 : 1 }}>
                    <line x1={xMid(i)} x2={xMid(i)} y1={y(k.h)} y2={y(k.l)} stroke={color} vectorEffect="non-scaling-stroke" />
                    <rect x={xMid(i) - bodyW / 2} y={top} width={bodyW} height={Math.max(1, bottom - top)} fill={color} />
                  </g>
                )
              })}
            </motion.g>

            {active && hover !== null && (
              <g pointerEvents="none">
                <line x1={xMid(hover)} x2={xMid(hover)} y1={0} y2={VB_H} stroke="rgba(244,239,230,0.2)" />
                <circle cx={xMid(hover)} cy={y(active.c)} r={3} fill={activeUp ? UP : DOWN} />
              </g>
            )}
          </svg>
        )}

        {active && hover !== null && feed && (
          <div
            role="status"
            className="pointer-events-none absolute top-1 z-10 min-w-[150px] rounded-lg border border-line bg-bg/95 px-3 py-2.5 text-[12px] shadow-2xl"
            style={{
              left: `${(xMid(hover) / VB_W) * 100}%`,
              transform: hover > vn / 2 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
            }}
          >
            <div className="text-[11px] text-muted">{fmtLabel(active.t, feed.interval)}</div>
            {(['o', 'h', 'l', 'c'] as const).map((key, i) => (
              <div key={key} className="mt-1 flex justify-between gap-4">
                <span className="text-muted">{['Open', 'High', 'Low', 'Close'][i]}</span>
                <span className="tabular-nums">{active[key].toFixed(3)}</span>
              </div>
            ))}
            <div className="mt-1 flex justify-between gap-4">
              <span className="text-muted">Chg</span>
              <span className="tabular-nums" style={{ color: activeUp ? UP : DOWN }}>
                {activeUp ? '+' : '−'}
                {Math.abs(((active.c - active.o) / active.o) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {vn > 0 && feed && (
        <div className="mt-2 flex justify-between border-t border-line pr-[9%] pt-2 text-[11px] text-muted tabular-nums">
          {[0, 1, 2, 3, 4].map((i) => {
            const k = view[Math.min(vn - 1, Math.floor((i * vn) / 5))]
            return <span key={i}>{fmtTick(k.t, feed.interval)}</span>
          })}
        </div>
      )}
      {feed && (
        <p className="mt-3 text-[11px] text-muted">
          Updated {new Date(feed.asOf).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} ·
          Source: Yahoo Finance · For education, not a trade signal.
        </p>
      )}
    </div>
  )
}
