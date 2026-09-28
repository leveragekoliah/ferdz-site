import { Button, Eyebrow, HighlightCard, HlFooter, Reveal, Stagger, StaggerItem } from '../components/ui'
import AnimatedHeading from '@/components/AnimatedHeading'

const chapters = [
  {
    place: 'Hawaii',
    title: 'Where it started',
    body: 'Ferdz picked up the clippers on the islands and spent years sharpening the craft: fades, lineups, beard work and traditional shaves. That’s where the Hawaii Celebrity Barber name comes from.',
  },
  {
    place: 'Phoenix',
    title: 'Bringing it to the desert',
    body: 'Now in central Phoenix, he runs HIBarbers out of Blended Barber Co. on 7th Ave, with 17 years of experience, a 5.0 rating and a simple rule: no rushed work.',
  },
  {
    place: 'Online',
    title: 'Documenting the process',
    body: 'Food, lifestyle, business and barbering, filmed and posted across TikTok, Instagram, YouTube and Facebook. Restaurants book him for honest reviews that reach real people.',
  },
  {
    place: 'Beyond the chair',
    title: 'Teaching what worked',
    body: 'He fixed his own credit and now teaches the system through Trap N Credit. After 10+ years in the markets, he built Locked-In Traders for people who want discipline over hype. Put together, it all points to one lesson: credit is the key to accessing money.',
  },
]

const values = [
  { title: 'Detail is the whole job', body: 'Every cut, video and plan gets finished properly, not rushed.' },
  { title: 'Honest, always', body: 'Real reviews, real numbers, no get-rich-quick promises.' },
  { title: 'Skills compound', body: 'Freedom comes from getting better at something every day.' },
]

export default function About() {
  return (
    <>
      <section className="container-x grid items-end gap-12 pb-16 pt-32 md:grid-cols-[1.2fr_1fr] md:pt-40">
        <Reveal>
          <Eyebrow>About Ferdz</Eyebrow>
          <AnimatedHeading as="h1" text="Building freedom" accent="through skills." className="mt-6 font-display text-[48px] leading-[1.04] tracking-[-0.02em] md:text-[72px]" />
          <p className="mt-8 max-w-lg text-[18px] leading-relaxed text-muted">
            Ferdinand “Ferdz” Ramirez is a barber, creator and entrepreneur, born in Hawaii and based in Phoenix. He built
            everything around one belief: learn a real skill, do it with detail, and it will open the next door.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <img src="/img/ferdz-profile.jpg" alt="Portrait of Ferdz" className="aspect-[2/3] w-full rounded-[24px] object-cover object-bottom" />
        </Reveal>
      </section>

      <section className="container-x py-24">
        <Reveal>
          <Eyebrow>The journey</Eyebrow>
        </Reveal>
        <Stagger className="mt-12 grid gap-4 md:grid-cols-2">
          {chapters.map((c, i) => (
            <StaggerItem key={c.place} className="h-full">
              <HighlightCard className="h-full min-h-[22rem]" contentClass="flex h-full min-h-[22rem] flex-col justify-end p-8 md:p-12">
                <p className="text-[12px] uppercase tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, '0')} · {c.place}
                </p>
                <h3 className="hl-title mt-4 font-display text-[32px] leading-tight">{c.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-gray-300 transition-colors duration-300 group-hover:text-gray-200">{c.body}</p>
                <HlFooter />
              </HighlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x grid items-center gap-12 py-24 md:grid-cols-2">
        <Reveal>
          <img src="/img/ferdz-staircase.jpg" alt="Ferdz walking down a lit staircase" className="aspect-[4/5] w-full rounded-[24px] object-cover object-[center_55%]" />
        </Reveal>
        <div>
          <Reveal>
            <Eyebrow>What he stands for</Eyebrow>
          </Reveal>
          <Stagger className="mt-8 space-y-8">
            {values.map((v) => (
              <StaggerItem key={v.title} className="border-l-2 border-accent pl-6">
                <h3 className="font-display text-[24px]">{v.title}</h3>
                <p className="mt-2 text-[16px] text-muted">{v.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container-x">
        <Reveal>
          <HighlightCard
            tilt="none"
            contentClass="flex flex-col items-start justify-between gap-8 p-8 md:flex-row md:items-center md:p-16"
          >
            <AnimatedHeading text="Ready to work together?" className="font-display text-[32px] leading-tight md:text-[40px]" />
            <div className="flex flex-wrap gap-4">
              <Button to="/businesses">See the businesses</Button>
              <Button href="mailto:ferdzsocialbuzz@gmail.com">Email Ferdz</Button>
            </div>
          </HighlightCard>
        </Reveal>
      </section>
    </>
  )
}
