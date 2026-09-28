import { Link, Navigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { businesses, getBusiness } from '../data'
import { Button, Eyebrow, HighlightCard, HlFooter, Reveal, Stagger, StaggerItem } from '../components/ui'

import Foundation from '../components/Foundation'
import UsdJpyChart from '../components/UsdJpyChart'
import { MetallicCard } from '@/components/ui/metallic-card'
import { InstagramGrid, TikTokFoodGrid } from '../components/SocialGrids'
import AnimatedHeading from '@/components/AnimatedHeading'

export default function BusinessPage() {
  const { slug } = useParams()
  const b = getBusiness(slug)
  if (!b) return <Navigate to="/businesses" replace />

  const i = businesses.findIndex((x) => x.slug === b.slug)
  const next = businesses[(i + 1) % businesses.length]

  return (
    <>
      {/* Hero */}
      <section className={`container-x grid items-center gap-12 pb-16 pt-32 md:pt-40 ${b.image || b.visual ? 'md:grid-cols-[1fr_1.1fr]' : ''}`}>
        <Reveal>
          <Link to="/businesses" className="text-[14px] text-muted transition-colors duration-200 hover:text-ink">
            ← All businesses
          </Link>
          <div className="mt-8">
            <Eyebrow>
              {b.index} · {b.kicker}
            </Eyebrow>
          </div>
          <AnimatedHeading key={b.slug} as="h1" text={b.name} className="mt-6 font-display text-[48px] leading-[1.04] tracking-[-0.02em] md:text-[72px]" />
          <p className="mt-4 font-display text-[24px] text-accent">{b.tagline}</p>
          <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-muted">{b.summary}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={b.cta.url}>{b.cta.label}</Button>
            {b.secondaryCta && (
              <Button href={b.secondaryCta.url} variant="ghost">
                {b.secondaryCta.label}
              </Button>
            )}
          </div>
        </Reveal>
        {b.visual === 'card' && (
          <Reveal delay={0.15}>
            <MetallicCard
              brand="Trap N Credit"
              logoSrc="/img/trapncredit-logo.webp"
              name="Ferdinand Ramirez"
              number="2026 0317 1700 0025"
              validThru="12/30"
              metal="silver"
            />
          </Reveal>
        )}
        {b.visual === 'usdjpy' && (
          <Reveal delay={0.15}>
            <UsdJpyChart />
          </Reveal>
        )}
        {b.image && (
          <Reveal delay={0.15}>
            <img src={b.image} alt={b.imageAlt} className={`w-full rounded-[24px] object-cover ${b.imageTall ? 'aspect-[2/3] object-center' : 'aspect-[4/3] object-top'}`} />
          </Reveal>
        )}
      </section>

      {b.slug === 'credit' && <Foundation showCta={false} />}

      {/* Facts */}
      {b.facts && (
        <section className="border-y border-line">
          <Stagger className="container-x grid md:grid-cols-3">
            {b.facts.map((f, k) => (
              <StaggerItem key={f.label} className={`py-8 ${k > 0 ? 'border-t border-line md:border-l md:border-t-0 md:pl-8' : ''}`}>
                <p className="label">{f.label}</p>
                <p className="mt-2 text-[16px] leading-relaxed">{f.value}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {b.tiktok && <TikTokFoodGrid />}
      {b.instagram?.map((g) => <InstagramGrid key={g.title} {...g} />)}

      {/* Includes */}
      {b.includes && (
        <section className="container-x py-24">
          <Reveal>
            <Eyebrow>{b.includesTitle}</Eyebrow>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {b.includes.map((x) => (
              <StaggerItem key={x} className="h-full">
                <HighlightCard tilt="full" className="h-full" contentClass="flex items-start gap-4 p-6">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-black/80 to-black/60 text-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-[16px] leading-relaxed text-gray-200">{x}</span>
                </HighlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Offers */}
      {b.offers && (
        <section className="container-x py-24">
          <Reveal>
            <Eyebrow>{b.offersTitle}</Eyebrow>
          </Reveal>
          <Stagger className="mt-10 border-t border-line">
            {b.offers.map((o) => (
              <StaggerItem
                key={o.name}
                className={`grid gap-2 border-b border-line py-6 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-8 ${
                  o.featured ? 'bg-accent-soft px-4 md:px-6' : ''
                }`}
              >
                <h3 className="font-display text-[24px] leading-tight">
                  {o.name}
                  {o.featured && <span className="ml-3 align-middle text-[12px] font-sans uppercase tracking-[0.18em] text-accent">Signature</span>}
                </h3>
                <p className="text-[16px] leading-relaxed text-muted">{o.detail}</p>
                <p className="font-display text-[24px] tabular-nums md:text-right">{o.price}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <Button href={b.cta.url}>{b.cta.label}</Button>
          </Reveal>
        </section>
      )}

      {/* Steps */}
      {b.steps && (
        <section className="container-x py-24">
          <Reveal>
            <Eyebrow>{b.stepsTitle ?? 'How it works'}</Eyebrow>
          </Reveal>
          <Stagger className={`mt-10 grid gap-6 ${b.steps.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            {b.steps.map((s, k) => (
              <StaggerItem key={s.title} className="h-full">
                <HighlightCard
                  tilt="full"
                  className="h-full"
                  contentClass="flex h-full min-h-[20rem] flex-col justify-end p-8"
                >
                  <p className="font-display text-[48px] leading-none text-accent">{String(k + 1).padStart(2, '0')}</p>
                  <h3 className="hl-title mt-6 font-display text-[24px]">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-300 transition-colors duration-300 group-hover:text-gray-200">{s.body}</p>
                  <HlFooter />
                </HighlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Policies */}
      {b.policies && (
        <section className="container-x py-16">
          <Reveal>
            <HighlightCard tilt="none" contentClass="p-8 md:p-12">
            <p className="label !text-white/70">Good to know</p>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {b.policies.map((p) => (
                <li key={p} className="flex gap-3 text-[16px] leading-relaxed text-gray-300">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
            </HighlightCard>
          </Reveal>
        </section>
      )}

      {b.disclaimer && (
        <section className="container-x">
          <p className="max-w-3xl text-[12px] leading-relaxed text-muted">{b.disclaimer}</p>
        </section>
      )}

      {/* Next */}
      <section className="container-x pt-24">
        <Link to={`/businesses/${next.slug}`} className="group block border-t border-line pt-12">
          <p className="label">Next business</p>
          <p className="mt-4 font-display text-[40px] leading-tight transition-colors duration-300 group-hover:text-accent md:text-[64px]">
            {next.name} →
          </p>
        </Link>
      </section>
    </>
  )
}
