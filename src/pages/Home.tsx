import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { businesses, reviews, socials, stats } from '../data'
import { Button, Eyebrow, HighlightCard, HlFooter, Reveal, Stagger, StaggerItem } from '../components/ui'
import Foundation from '../components/Foundation'
import VideoHero from '../components/VideoHero'
import { Marquee } from '@/components/ui/3d-testimonails'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import AnimatedHeading from '@/components/AnimatedHeading'

const ease = [0.22, 1, 0.36, 1] as const

export default function Home() {
  const reduce = useReducedMotion()
  const words = ['Barber.', 'Creator.', 'Entrepreneur.']

  return (
    <>
      <VideoHero
        title={
          <>
            Opening doors of <span className="text-accent">opportunity.</span>
          </>
        }
        tagline={
          <div>
            <p className="label !text-ink/80">Ferdinand “Ferdz” Ramirez</p>
            <p className="mt-4 font-display text-[28px] leading-tight text-ink [text-shadow:0_4px_24px_rgba(0,0,0,0.5)] md:text-[44px]">
              Barber. Creator. Entrepreneur.
            </p>
          </div>
        }
      />

      {/* Intro */}
      <section className="container-x grid items-center gap-12 py-24 md:grid-cols-[1.15fr_1fr] md:py-32">
        <div>
          <motion.p
            className="label"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Ferdinand “Ferdz” Ramirez · Phoenix, AZ
          </motion.p>
          <h2 className="mt-6 font-display text-[48px] leading-[1.02] tracking-[-0.02em] sm:text-[64px] lg:text-[88px]">
            {words.map((w, i) => (
              <motion.span
                key={w}
                className={`block ${i === 2 ? ' text-accent' : ''}`}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.12 }}
              >
                {w}
              </motion.span>
            ))}
          </h2>
          <motion.p
            className="mt-8 max-w-md text-[18px] leading-relaxed text-muted"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.6 }}
          >
            Hawaii-born, Phoenix-based. Seventeen years behind the chair, ten-plus years in the markets, and five businesses built on one idea:
            freedom through skills.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.75 }}
          >
            <Button href="https://celebritybarber1.booksy.com/a/">Book a cut</Button>
            <Button to="/businesses" variant="ghost">See the businesses</Button>
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
        >
          <div className="absolute -inset-4 -z-10 rounded-[28px] bg-accent-soft blur-2xl" />
          <img
            src="/img/ferdz-profile.jpg"
            alt="Ferdz in an orange tee in a hotel lobby"
            className="aspect-[2/3] w-full rounded-[24px] object-cover object-bottom"
          />
          <div className="absolute -bottom-6 left-6">
            <HighlightCard tilt="full" contentClass="px-5 py-4">
              <p className="hl-title font-display text-[24px] leading-none">5.0 ★</p>
              <p className="mt-1 text-[12px] text-gray-300">122 reviews on Booksy</p>
            </HighlightCard>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-line">
        <Stagger className="container-x grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <StaggerItem key={s.label} className={`py-10 ${i % 2 ? 'pl-6' : ''} ${i > 0 ? 'md:border-l md:border-line md:pl-8' : ''}`}>
              <p className="font-display text-[48px] leading-none tracking-tight tabular-nums">
                {s.value}
                <span className="ml-1 text-[24px] text-accent">{s.unit}</span>
              </p>
              <p className="mt-3 text-[14px] text-muted">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Foundation />

      {/* Businesses */}
      <section className="container-x py-24 md:py-32">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>What he’s building</Eyebrow>
            <AnimatedHeading text="One name. Five ways to work with him." className="mt-4 max-w-xl font-display text-[32px] leading-tight tracking-tight md:text-[48px]" />
          </div>
          <Link to="/businesses" className="text-[14px] text-muted transition-colors duration-200 hover:text-ink">
            All businesses →
          </Link>
        </Reveal>
        <Stagger className="mt-12 border-t border-line">
          {businesses.map((b) => (
            <StaggerItem key={b.slug}>
              <Link to={`/businesses/${b.slug}`} className="group grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-line py-8 md:grid-cols-[80px_1fr_1fr_auto] md:gap-8">
                <span className="text-[14px] text-muted tabular-nums">{b.index}</span>
                <span className="font-display text-[24px] leading-tight transition-transform duration-300 group-hover:translate-x-2 md:text-[32px]">
                  {b.name}
                </span>
                <span className="hidden text-[16px] text-muted md:block">{b.tagline}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Testimonials — 3D marquee (components/ui/3d-testimonails.tsx) */}
      <section className="py-24">
        <Reveal className="container-x">
          <Eyebrow>From the chair</Eyebrow>
          <AnimatedHeading text="5.0 stars." accent="122 reviews." className="mt-4 max-w-2xl font-display text-[32px] leading-tight md:text-[48px]" />
          <p className="mt-4 max-w-xl text-[16px] text-muted">Real reviews from confirmed HIBarbers clients on Booksy.</p>
        </Reveal>
        <Testimonials3D />
      </section>

      {/* About teaser */}
      <section className="container-x grid items-center gap-12 py-24 md:grid-cols-2 md:py-32">
        <Reveal>
          <img src="/img/ferdz-staircase.jpg" alt="Ferdz walking down a lit staircase" className="aspect-[4/5] w-full rounded-[24px] object-cover object-[center_55%]" />
        </Reveal>
        <Reveal delay={0.1}>
          <Eyebrow>The story</Eyebrow>
          <AnimatedHeading text="Documenting" accent="the process." className="mt-4 font-display text-[32px] leading-tight tracking-tight md:text-[48px]" />
          <p className="mt-6 text-[18px] leading-relaxed text-muted">
            From an island barber chair to central Phoenix, Ferdz turned one skill into a platform: cuts, food content, credit
            education and a trading community, all built in public.
          </p>
          <div className="mt-8">
            <Button to="/about" variant="ghost">Read his story</Button>
          </div>
        </Reveal>
      </section>

      {/* Socials CTA */}
      <section className="container-x">
        <Reveal>
          <HighlightCard tilt="none" contentClass="flex flex-col items-center px-8 py-16 text-center md:py-24">
          <p className="label !text-white/70">@fferrdz everywhere</p>
          <AnimatedHeading text="Follow the journey." className="mx-auto mt-4 max-w-2xl font-display text-[32px] leading-tight tracking-tight md:text-[48px]" />
          <Stagger className="mt-10 flex flex-wrap justify-center gap-4">
            {socials.map((s) => (
              <StaggerItem key={s.name}>
                <Button href={s.url} size="sm">
                  {s.name} · {s.handle}
                </Button>
              </StaggerItem>
            ))}
          </Stagger>
          <HlFooter center />
          </HighlightCard>
        </Reveal>
      </section>
    </>
  )
}

function TestimonialCard({ name, quote, service }: (typeof reviews)[number]) {
  return (
    <Card className="hl-card w-64 rounded-2xl border-white/10">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarFallback className="bg-accent-soft font-semibold text-accent">{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="flex items-center gap-1 text-sm font-medium text-foreground">
              {name} <span className="text-xs text-accent">★★★★★</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">Confirmed client · {service}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-gray-200">“{quote}”</blockquote>
      </CardContent>
    </Card>
  )
}

function Testimonials3D() {
  const columns = [false, true, false, true] // alternate direction per column
  return (
    <div className="relative mt-12 flex h-[36rem] w-full flex-row items-center justify-center overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{ transform: 'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)' }}
      >
        {columns.map((reverse, c) => (
          <Marquee key={c} vertical pauseOnHover reverse={reverse} repeat={3} className="[--duration:40s]" ariaLabel="HIBarbers client reviews">
            {reviews.map((r, i) => (
              <TestimonialCard key={`${r.name}-${i}`} {...r} />
            ))}
          </Marquee>
        ))}
      </div>
      {/* fade the edges into the page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
    </div>
  )
}
