import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'
import { Button, Eyebrow, Reveal, Stagger, StaggerItem } from './ui'
import tiktokFood from '../tiktok-food.json'
import AnimatedHeading from '@/components/AnimatedHeading'

const fmtViews = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}K` : String(n)

/** Instagram posts pulled from Ferdz's own accounts; each tile opens the original post. */
export function InstagramGrid({
  handle,
  title,
  codes,
  shape = 'portrait',
}: {
  handle: string
  title: string
  codes: string[]
  shape?: 'portrait' | 'reel'
}) {
  return (
    <section className="container-x py-24">
      <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Eyebrow>@{handle} on Instagram</Eyebrow>
          <AnimatedHeading text={title} className="mt-4 font-display text-[32px] leading-tight md:text-[48px]" />
        </div>
        <Button href={`https://www.instagram.com/${handle}/`} variant="ghost">
          Follow @{handle}
        </Button>
      </Reveal>
      <Stagger className={`mt-10 grid gap-3 ${shape === 'reel' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
        {codes.map((c) => (
          <StaggerItem key={c}>
            <a
              href={`https://www.instagram.com/p/${c}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="hl-card hl-tilt group block"
            >
              <img
                src={`/img/ig/${c}.jpg`}
                alt={`Post from @${handle}`}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  shape === 'reel' ? 'aspect-[9/16]' : 'aspect-[4/5]'
                }`}
              />
              <span className="hl-decor" aria-hidden>
                <span className="hl-sheen" />
              </span>
              <span className="hl-corner tl" aria-hidden />
              <span className="hl-corner br" aria-hidden />
              <span className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bg/70 text-ink opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                <ArrowUpRight size={16} />
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

/** Ferdz's most-watched TikTok food reviews. The TikTok player only loads when tapped. */
export function TikTokFoodGrid() {
  const [playing, setPlaying] = useState<string | null>(null)
  const total = tiktokFood.reduce((s, v) => s + v.views, 0)

  return (
    <section className="container-x py-24">
      <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Eyebrow>@fferrdz on TikTok</Eyebrow>
          <AnimatedHeading text="Recent features." accent={`${fmtViews(total)}+ views.`} className="mt-4 font-display text-[32px] leading-tight md:text-[48px]" />
          <p className="mt-4 max-w-xl text-[16px] text-muted">His top nine restaurant reviews. Tap any one to watch it here.</p>
        </div>
        <Button href="https://www.tiktok.com/@fferrdz" variant="ghost">
          Watch on TikTok
        </Button>
      </Reveal>
      <Stagger className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
        {tiktokFood.map((v) => (
          <StaggerItem key={v.id}>
            <div className={`hl-card group aspect-[9/16] ${playing === v.id ? '' : 'hl-tilt'}`}>
              {playing === v.id ? (
                <iframe
                  src={`https://www.tiktok.com/player/v1/${v.id}?autoplay=1&description=1&music_info=0&rel=0`}
                  title={v.title}
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <motion.button
                  type="button"
                  onClick={() => setPlaying(v.id)}
                  whileHover={{ scale: 1.01 }}
                  className="group absolute inset-0 h-full w-full text-left"
                  aria-label={`Play: ${v.title}`}
                >
                  <img src={`/img/tiktok/${v.id}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-bg transition-transform duration-300 group-hover:scale-110">
                    <Play size={22} fill="currentColor" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                    <span className="block text-[12px] font-semibold text-accent">{fmtViews(v.views)} views</span>
                    <span className="mt-1 line-clamp-3 block text-[13px] leading-snug text-ink md:text-[14px]">{v.title}</span>
                  </span>
                </motion.button>
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
