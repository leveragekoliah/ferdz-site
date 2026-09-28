import { BadgeCheck, CircleDollarSign, GraduationCap, KeyRound, ShieldCheck, Sparkles, TrendingUp, UserPlus, FileSearch, BellRing } from 'lucide-react'
import { Button, Eyebrow, HighlightCard, HlFooter, HlMedallion, Reveal, Stagger, StaggerItem } from '../components/ui'
import { MetallicCard } from '@/components/ui/metallic-card'

import CreditLeadForm from '../components/CreditLeadForm'

// Funnel page for "Get a free credit audit" — rebuilt from Trap N Credit's portal page
// (trapncredit.getcredithelpnow.com/start) in the site theme. Sign-up happens on THIS page via
// CreditLeadForm (same fields as the portal); every CTA scrolls to the form.

const steps = [
  { icon: UserPlus, title: 'Sign up', body: 'Enter your name, email and phone below. A Trap N Credit specialist reaches out to get your credit report pulled.' },
  { icon: FileSearch, title: 'Review', body: 'A credit specialist goes through your report with you, flags the negative items hurting your score, and builds a plan.' },
  { icon: BellRing, title: 'Stay updated', body: 'We work the plan and keep you posted on your progress along the way.' },
]

const benefits = [
  {
    icon: CircleDollarSign,
    title: 'Lower costs, better terms',
    points: ['Save money on loans and credit cards', 'Access higher credit limits', 'Longer repayment periods and lower fees'],
  },
  {
    icon: KeyRound,
    title: 'More financial opportunities',
    points: ['Better odds of loan and card approvals', 'Secure rental agreements more easily', 'Stronger position for job opportunities'],
  },
  {
    icon: Sparkles,
    title: 'Greater financial perks',
    points: ['Qualify for premium cards with better rewards', 'Lower insurance premiums', 'Smaller deposits for utilities and contracts'],
  },
]

const possible = [
  { icon: TrendingUp, title: 'Unlock savings', points: ['Lower interest rates', 'Cheaper insurance premiums', 'Better rent or mortgage rates'] },
  { icon: BadgeCheck, title: 'Get approved', points: ['More financing options', 'Better job opportunities', 'Improved housing options'] },
  { icon: GraduationCap, title: 'Get credit education', points: ['Learn the habits that keep a score high', 'No guesswork: we guide you through the process'] },
]

function Cta({ children = 'Start my free audit' }: { children?: string }) {
  return (
    <Button href="#audit-form" size="lg">
      {children}
    </Button>
  )
}

export default function CreditAudit() {
  return (
    <>
      {/* Hero */}
      <section className="container-x grid items-center gap-12 pb-16 pt-32 md:grid-cols-[1.1fr_1fr] md:pt-40">
        <Reveal>
          <Eyebrow>Trap N Credit · Free credit audit</Eyebrow>
          <h1 className="mt-6 font-display text-[44px] leading-[1.04] tracking-[-0.02em] md:text-[64px]">
            Your credit report could be <span className="text-accent">costing you.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-muted">
            In a U.S. PIRG study, <span className="text-ink">79% of credit reports</span> reviewed contained errors. Get a free credit audit
            and consultation, and see how a stronger score can put you back in control of your money.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Cta />
            <span className="flex items-center gap-2 text-[14px] text-muted">
              <ShieldCheck size={18} className="text-accent" /> $0 to get started · 90-day money-back guarantee
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <CreditLeadForm />
        </Reveal>
      </section>

      {/* Steps */}
      <section className="container-x py-24">
        <Reveal>
          <Eyebrow>Get started in 3 simple steps</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-[32px] leading-tight md:text-[48px]">
            Five minutes to start. <span className="text-accent">We handle the rest.</span>
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <StaggerItem key={s.title} className="h-full">
              <HighlightCard tilt="full" className="h-full" contentClass="flex h-full flex-col items-center p-8 text-center">
                <span className="text-[12px] uppercase tracking-[0.18em] text-white/60">Step {String(i + 1).padStart(2, '0')}</span>
                <div className="mt-6">
                  <HlMedallion>
                    <s.icon size={26} strokeWidth={1.75} className="text-white" />
                  </HlMedallion>
                </div>
                <h3 className="hl-title mt-8 font-display text-[26px]">{s.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-300">{s.body}</p>
                <HlFooter center />
              </HighlightCard>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-12 flex justify-center">
          <Cta>Get started for $0 today</Cta>
        </Reveal>
      </section>

      {/* Benefits */}
      <section className="container-x py-24">
        <Reveal>
          <Eyebrow>Why a good score matters</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-[32px] leading-tight md:text-[48px]">
            Good credit is the <span className="text-accent">key to accessing money.</span>
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <StaggerItem key={b.title} className="h-full">
              <HighlightCard tilt="full" className="h-full" contentClass="flex h-full flex-col p-8">
                <b.icon size={28} strokeWidth={1.75} className="text-accent" />
                <h3 className="hl-title mt-6 font-display text-[24px]">{b.title}</h3>
                <ul className="mt-4 flex-1 space-y-3">
                  {b.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-gray-300">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
                <HlFooter />
              </HighlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* With our help */}
      <section className="container-x py-24">
        <Reveal>
          <Eyebrow>With our help it’s possible to</Eyebrow>
        </Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {possible.map((p, i) => (
            <StaggerItem key={p.title} className="h-full">
              <HighlightCard tilt="full" className="h-full" contentClass="flex h-full flex-col p-8">
                <div className="flex items-center justify-between">
                  <p.icon size={26} strokeWidth={1.75} className="text-accent" />
                  <span className="font-display text-[40px] leading-none text-white/15">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="hl-title mt-6 font-display text-[24px]">{p.title}</h3>
                <ul className="mt-4 flex-1 space-y-3">
                  {p.points.map((x) => (
                    <li key={x} className="flex gap-3 text-[15px] leading-relaxed text-gray-300">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {x}
                    </li>
                  ))}
                </ul>
              </HighlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* About + guarantee */}
      <section className="container-x grid items-center gap-8 py-24 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <Eyebrow>About Trap N Credit</Eyebrow>
          <h2 className="mt-4 font-display text-[32px] leading-tight md:text-[44px]">
            No quick fixes. <span className="text-accent">No empty promises.</span>
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-muted">
            Trap N Credit helps people understand, improve and rebuild their credit through personalized credit education and strategic
            support. Every profile is different, so we review your situation, identify inaccurate or questionable information, and build a
            clear plan around your goals, whether that’s a credit card, a car, a home or business funding.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Your credit doesn’t have to define where you’re going. Let’s build a stronger financial future together.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-6">
          <MetallicCard brand="Trap N Credit" logoSrc="/img/trapncredit-logo.webp" name="Ferdinand Ramirez" number="2026 0317 1700 0025" validThru="12/30" metal="silver" />
          <HighlightCard tilt="full" contentClass="flex flex-col items-center p-10 text-center">
            <HlMedallion>
              <ShieldCheck size={30} strokeWidth={1.75} className="text-accent" />
            </HlMedallion>
            <p className="hl-title mt-8 font-display text-[28px] leading-tight">90-day money-back guarantee</p>
            <p className="mt-3 text-[15px] text-gray-300">Committed to your financial stability, with peace of mind built in.</p>
            <HlFooter center />
          </HighlightCard>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="container-x">
        <Reveal>
          <HighlightCard tilt="none" contentClass="flex flex-col items-center px-8 py-16 text-center md:py-24">
            <p className="label !text-white/70">Free credit audit &amp; consultation</p>
            <h2 className="hl-title mx-auto mt-4 max-w-2xl font-display text-[32px] leading-tight md:text-[48px]">Start your credit journey today.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] text-gray-300">
              It takes a minute and costs $0 to start. A Trap N Credit specialist will take it from there.
            </p>
            <div className="mt-10">
              <Cta />
            </div>
            <HlFooter center />
          </HighlightCard>
        </Reveal>
        <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-muted">
          Results vary and are not guaranteed. You have the right to dispute inaccurate information on your credit report yourself, for
          free, directly with the credit bureaus. Credit education only; not legal or financial advice. The 79% figure is from a U.S. PIRG
          study of consumer credit reports.
        </p>
      </section>
    </>
  )
}
