import { useState, type FormEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { submitLead } from '@/lib/leads'
import { HighlightCard } from './ui'

// Entry form for a gated business portal. The visitor enters Full name, phone and email; the lead is
// saved (lib/leads.ts), then the page opens. Remembered per business on this device so returning
// visitors go straight in. Storage access is wrapped: if it is blocked, the form simply shows again.

const key = (business: string) => `ferdz-portal:${business}`
const hasEntered = (business: string) => {
  try {
    return localStorage.getItem(key(business)) === '1'
  } catch {
    return false
  }
}

export default function LeadGate({
  business,
  businessName,
  tagline,
  children,
}: {
  business: string
  businessName: string
  tagline?: string
  children: ReactNode
}) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(() => hasEntered(business))
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot: real people never fill this
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (open) return <>{children}</>

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const name = fullName.trim()
    const digits = phone.replace(/\D/g, '')
    const mail = email.trim()
    if (name.split(/\s+/).length < 2) return setError('Please enter your full name (first and last).')
    if (digits.length < 10 || digits.length > 15) return setError('Please enter a valid phone number.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return setError('Please enter a valid email address.')
    if (website) return setOpen(true) // bot: let it through without saving anything
    setBusy(true)
    try {
      await submitLead({ business, fullName: name, phone: phone.trim(), email: mail })
      try {
        localStorage.setItem(key(business), '1')
      } catch {
        /* storage blocked — they will just see the form again next visit */
      }
      setOpen(true)
      window.scrollTo(0, 0)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const field =
    'w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-[16px] text-ink placeholder:text-white/35 outline-none transition-colors duration-200 focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40'

  return (
    <section className="container-x flex min-h-[100svh] items-center justify-center pb-16 pt-28">
      <motion.div
        className="w-full max-w-md"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <HighlightCard tilt="none" contentClass="p-8 md:p-10">
          <p className="label !text-white/60">Private portal</p>
          <h1 className="hl-title mt-3 font-display text-[32px] leading-tight md:text-[40px]">{businessName}</h1>
          {tagline && <p className="mt-2 font-display text-[18px] text-accent">{tagline}</p>}
          <p className="mt-4 text-[15px] leading-relaxed text-gray-300">Enter your details to open the page.</p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
            <div>
              <label htmlFor="lg-name" className="mb-1.5 block text-[13px] font-medium text-white/80">
                Full name
              </label>
              <input id="lg-name" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} placeholder="First and last name" />
            </div>
            <div>
              <label htmlFor="lg-phone" className="mb-1.5 block text-[13px] font-medium text-white/80">
                Phone number
              </label>
              <input id="lg-phone" type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={field} placeholder="(555) 555-5555" />
            </div>
            <div>
              <label htmlFor="lg-email" className="mb-1.5 block text-[13px] font-medium text-white/80">
                Email
              </label>
              <input id="lg-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@example.com" />
            </div>
            {/* honeypot — hidden from people and screen readers */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="lg-website">Website</label>
              <input id="lg-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-[14px] text-red-200">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="pearl-button w-full disabled:cursor-wait disabled:opacity-70">
              <span className="wrap">
                <span className="txt justify-center">
                  <span aria-hidden>✧</span>
                  <span aria-hidden>✦</span>
                  {busy ? 'Opening…' : 'Enter'}
                </span>
              </span>
            </button>

            <p className="text-[12px] leading-relaxed text-white/50">
              By entering, you agree that Ferdz and {businessName} may contact you by phone, text or email about this service.
              Message and data rates may apply. Reply STOP to opt out of texts. We don’t sell your information. To have your details
              removed, email{' '}
              <a href="mailto:ferdzsocialbuzz@gmail.com" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                ferdzsocialbuzz@gmail.com
              </a>
              .
            </p>
          </form>
        </HighlightCard>
      </motion.div>
    </section>
  )
}
