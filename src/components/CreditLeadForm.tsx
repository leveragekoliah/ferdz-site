import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { HighlightCard } from './ui'
import { leadsConfigured, submitLead } from '../lib/leads'

// Free credit audit sign-up — same fields as the old Trap N Credit portal form
// (first name, last name, email, phone).
// Live (Lovable Cloud): saved to the shared `leads` table as business 'credit' via submitLead().
// Local dev (no database): posted to /api/credit-lead, which appends to a private gitignored file.

type Fields = { firstName: string; lastName: string; email: string; phone: string }
type Status = 'idle' | 'sending' | 'done' | 'error'

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

const validate = (f: Fields) => {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (!f.firstName.trim()) e.firstName = 'Enter your first name'
  if (!f.lastName.trim()) e.lastName = 'Enter your last name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email'
  if (f.phone.replace(/\D/g, '').length !== 10) e.phone = 'Enter a 10-digit phone number'
  return e
}

export default function CreditLeadForm() {
  const [f, setF] = useState<Fields>({ firstName: '', lastName: '', email: '', phone: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const errors = validate(f)
  const show = (k: keyof Fields) => (touched[k] || status === 'error') && errors[k]

  const set = (k: keyof Fields) => (v: string) => setF((p) => ({ ...p, [k]: k === 'phone' ? formatPhone(v) : v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ firstName: true, lastName: true, email: true, phone: true })
    if (Object.keys(errors).length) return
    setStatus('sending')
    try {
      if (honeypot) {
        // bot filled the hidden field: show success, store nothing
        setStatus('done')
        return
      }
      if (leadsConfigured) {
        await submitLead({
          business: 'credit',
          fullName: `${f.firstName.trim()} ${f.lastName.trim()}`,
          phone: f.phone.replace(/\D/g, ''),
          email: f.email.trim().toLowerCase(),
        })
      } else {
        const res = await fetch('/api/credit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...f, company: honeypot }),
        })
        if (!res.ok) throw new Error(String(res.status))
      }
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done')
    return (
      <HighlightCard tilt="none" contentClass="flex flex-col items-center p-10 text-center">
        <CheckCircle2 size={44} className="text-accent" />
        <p className="hl-title mt-6 font-display text-[28px] leading-tight">You’re in, {f.firstName.trim()}.</p>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-gray-300">
          Your free credit audit request is in. A Trap N Credit specialist will reach out by phone or email to get started.
        </p>
      </HighlightCard>
    )

  const input =
    'mt-1.5 w-full rounded-xl border bg-black/60 px-4 py-3 text-[16px] text-ink placeholder:text-white/30 outline-none transition-colors duration-200 focus:border-accent'

  return (
    <HighlightCard tilt="none" contentClass="p-6 md:p-8">
      <form id="audit-form" onSubmit={submit} noValidate className="scroll-mt-28">
        <p className="hl-title text-center font-display text-[26px]">Get started today</p>
        <p className="mt-1 text-center text-[14px] text-gray-300">Free credit audit &amp; consultation. $0 to start.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(
            [
              ['firstName', 'First name', 'text', 'given-name'],
              ['lastName', 'Last name', 'text', 'family-name'],
            ] as const
          ).map(([k, label, type, ac]) => (
            <label key={k} className="block text-[13px] font-medium text-gray-200">
              {label} <span className="text-accent">*</span>
              <input
                type={type}
                autoComplete={ac}
                maxLength={22}
                value={f[k]}
                onChange={(e) => set(k)(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, [k]: true }))}
                aria-invalid={!!show(k)}
                className={`${input} ${show(k) ? 'border-red-400/70' : 'border-white/15'}`}
              />
              {show(k) && <span className="mt-1 block text-[12px] text-red-300">{errors[k]}</span>}
            </label>
          ))}
        </div>

        {(
          [
            ['email', 'Email', 'email', 'email', 'you@example.com', 'email'],
            ['phone', 'Phone number', 'tel', 'tel', '(000) 000-0000', 'numeric'],
          ] as const
        ).map(([k, label, type, ac, ph, mode]) => (
          <label key={k} className="mt-4 block text-[13px] font-medium text-gray-200">
            {label} <span className="text-accent">*</span>
            <input
              type={type}
              autoComplete={ac}
              inputMode={mode}
              placeholder={ph}
              value={f[k]}
              onChange={(e) => set(k)(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, [k]: true }))}
              aria-invalid={!!show(k)}
              className={`${input} ${show(k) ? 'border-red-400/70' : 'border-white/15'}`}
            />
            {show(k) && <span className="mt-1 block text-[12px] text-red-300">{errors[k]}</span>}
          </label>
        ))}

        {/* spam trap: hidden from people, filled in by bots */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          aria-hidden
        />

        {status === 'error' && (
          <p role="alert" className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-200">
            Something went wrong sending your request. Please check your details and try again.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="pearl-button pearl-lg mt-6 w-full disabled:cursor-wait disabled:opacity-80"
        >
          <span className="wrap">
            <span className="txt justify-center">
              {status === 'sending' ? (
                <Loader2 size={18} className="animate-spin" aria-hidden />
              ) : (
                <>
                  <span aria-hidden>✧</span>
                  <span aria-hidden>✦</span>
                </>
              )}
              {status === 'sending' ? 'Sending…' : 'Get started for $0 today'}
            </span>
          </span>
        </button>

        <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-gray-400">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent" />
          We’ll only use these details to contact you about your free credit audit.
        </p>
      </form>
    </HighlightCard>
  )
}
