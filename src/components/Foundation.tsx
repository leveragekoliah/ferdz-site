import { KeyRound, Scissors, TrendingUp } from 'lucide-react'
import { Button, Eyebrow, HighlightCard, HlFooter, HlMedallion, Reveal, Stagger, StaggerItem } from './ui'
import AnimatedHeading from '@/components/AnimatedHeading'

const pillars = [
  {
    icon: Scissors,
    years: '17',
    unit: 'yrs',
    field: 'Barbering',
    title: 'The skill that earns.',
    body: 'Seventeen years of showing up, one client at a time. Barbering built the income, the reputation and the habit of doing the work right every single day.',
  },
  {
    icon: TrendingUp,
    years: '10+',
    unit: 'yrs',
    field: 'Trading',
    title: 'The discipline that protects.',
    body: 'A decade in the markets taught the rest: manage risk, stay patient, follow a plan. Money is a system to run, not a gamble to chase.',
  },
  {
    icon: KeyRound,
    years: '1',
    unit: 'key',
    field: 'Credit',
    title: 'The access that multiplies.',
    body: 'Lenders don’t fund hustle. They fund profiles. Strong credit is what turns earned income into access: business funding, a home, a vehicle, and better terms on all of it.',
    key: true,
  },
]

export default function Foundation({ showCta = true }: { showCta?: boolean }) {
  return (
    <section className="container-x py-24 md:py-32">
      <Reveal className="max-w-3xl">
        <Eyebrow>The foundation</Eyebrow>
        <AnimatedHeading text="Skill earns it. Discipline protects it." accent="Credit unlocks it." className="mt-4 font-display text-[32px] leading-[1.08] md:text-[56px]" />
        <p className="mt-6 text-[18px] leading-relaxed text-muted">
          Twenty-seven years across two crafts led Ferdz to one conclusion: earning money and getting access to money are two
          different skills. Credit is the bridge between them.
        </p>
      </Reveal>

      <Stagger className="relative mt-16 grid gap-6 md:grid-cols-3">
        {pillars.map((p, i) => (
          <StaggerItem key={p.field} className="h-full">
            <HighlightCard tilt="full" className="h-full" contentClass="flex h-full flex-col items-center p-8 text-center">
              <span className="text-[12px] uppercase tracking-[0.18em] text-white/60">Step {String(i + 1).padStart(2, '0')}</span>
              <div className="mt-6">
                <HlMedallion>
                  <p.icon size={28} strokeWidth={1.75} className={p.key ? 'text-accent' : 'text-white'} />
                </HlMedallion>
              </div>
              <p className="mt-8 font-display text-[64px] leading-none tabular-nums">
                {p.years}
                <span className={`ml-2 text-[20px] ${p.key ? 'text-accent' : 'text-white/60'}`}>{p.unit}</span>
              </p>
              <p className="label mt-4 !text-white/70">{p.field}</p>
              <h3 className={`mt-2 font-display text-[26px] ${p.key ? 'text-accent' : 'hl-title'}`}>{p.title}</h3>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-gray-300 transition-colors duration-300 group-hover:text-gray-200">{p.body}</p>
              <HlFooter center />
            </HighlightCard>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-16 grid items-center gap-8 border-t border-line pt-12 md:grid-cols-[1.4fr_1fr]">
        <p className="font-display text-[24px] leading-snug md:text-[32px]">
          Income without credit has a ceiling. <span className="text-muted">Build the key before you need the door.</span>
        </p>
        {showCta && (
          <div className="flex flex-wrap gap-4 md:justify-end">
            <Button href="https://trapncredit.getcredithelpnow.com/start">Get a free credit audit</Button>
            <Button to="/businesses/credit" variant="ghost">How Trap N Credit works</Button>
          </div>
        )}
      </Reveal>
      <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-muted">
        Ferdz’s experience is shared for education only. Results vary, nothing here is financial advice, and trading involves risk
        of loss.
      </p>
    </section>
  )
}
