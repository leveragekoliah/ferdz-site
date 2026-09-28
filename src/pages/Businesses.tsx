import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { businesses } from '../data'
import { Eyebrow, HighlightCard, HlFooter, Reveal, Stagger, StaggerItem } from '../components/ui'
import Foundation from '../components/Foundation'
import UsdJpyChart from '../components/UsdJpyChart'
import AnimatedHeading from '@/components/AnimatedHeading'

export default function Businesses() {
  return (
    <>
      <section className="container-x pb-16 pt-32 md:pt-40">
        <Reveal>
          <Eyebrow>Businesses</Eyebrow>
          <AnimatedHeading as="h1" text="Everything Ferdz is" accent="building." className="mt-6 max-w-3xl font-display text-[48px] leading-[1.04] tracking-[-0.02em] md:text-[72px]" />
          <p className="mt-8 max-w-xl text-[18px] leading-relaxed text-muted">
            Cuts, content, credit and trading. Pick the one you came for.
          </p>
        </Reveal>
      </section>

      <Stagger className="container-x grid grid-cols-1 gap-6 lg:grid-cols-6">
        {businesses.map((b, i) => (
          <StaggerItem key={b.slug} className={`h-full ${i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            <Link to={`/businesses/${b.slug}`} className="block h-full">
              <HighlightCard
                tilt="soft"
                className="h-full"
                contentClass={`flex h-full flex-col justify-end p-8 md:p-10 ${i < 2 ? 'min-h-[34rem]' : 'min-h-[30rem]'}`}
              >
                {b.reel && (
                  <div className={`mb-8 flex items-center gap-4 ${b.visual === 'usdjpy' ? '' : 'justify-center'}`}>
                    <figure className={`relative shrink-0 overflow-hidden rounded-2xl border border-white/15 shadow-2xl ${b.visual === 'usdjpy' ? 'w-[38%] max-w-[180px]' : 'w-[52%] max-w-[230px]'}`}>
                      <img
                        src={b.reel.src}
                        alt={b.reel.alt}
                        loading="lazy"
                        className="aspect-[9/16] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2.5 pb-2 pt-6 text-[10px] font-medium tracking-wide text-white/85">
                        {b.reel.source}
                      </figcaption>
                    </figure>
                    {b.visual === 'usdjpy' && (
                      <div className="min-w-0 flex-1">
                        <UsdJpyChart compact initial="1M" />
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[12px] uppercase tracking-[0.18em] text-white/60">
                  {b.index} · {b.kicker}
                </p>
                <h2 className="hl-title mt-3 font-display text-[32px] leading-tight transition-transform duration-300 group-hover:scale-[1.02]">
                  {b.name}
                </h2>
                <p className="mt-2 font-display text-[18px] text-accent">{b.tagline}</p>
                <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-gray-300 transition-colors duration-300 group-hover:text-gray-200">
                  {b.summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-white">
                  Explore
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <HlFooter />

              </HighlightCard>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <Foundation />
    </>
  )
}
