import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} variants={list} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, margin: '-60px' }}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}

type BtnProps = {
  to?: string
  href?: string
  children: ReactNode
  /** kept for older call sites — every button is the same pearl button now */
  variant?: 'solid' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

/** The site-wide Pearl Button (styles in index.css). Renders as a router Link or an <a>. */
export function Button({ to, href, children, size = 'md' }: BtnProps) {
  const cls = `pearl-button ${size === 'sm' ? 'pearl-sm' : size === 'lg' ? 'pearl-lg' : ''}`
  const inner = (
    <span className="wrap">
      <span className="txt">
        <span aria-hidden>✧</span>
        <span aria-hidden>✦</span>
        {children}
      </span>
    </span>
  )
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    )
  const external = href?.startsWith('http')
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="label flex items-center gap-3">
      <span className="h-px w-8 bg-accent" />
      {children}
    </p>
  )
}

/** Highlight card shell (styles in index.css). `bg` = a real photo behind a dark scrim. */
export function HighlightCard({
  children,
  bg,
  bgPosition = 'center',
  scrim = 'strong',
  tilt = 'soft',
  className = '',
  contentClass = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  bg?: string
  bgPosition?: string
  scrim?: 'strong' | 'light'
  tilt?: 'full' | 'soft' | 'none'
  className?: string
  contentClass?: string
  as?: 'div' | 'figure' | 'article'
}) {
  const tiltCls = tilt === 'full' ? 'hl-tilt' : tilt === 'soft' ? 'hl-tilt-soft' : ''
  return (
    <Tag className={`hl-card group ${tiltCls} ${className}`}>
      {bg && (
        <>
          <img src={bg} alt="" aria-hidden loading="lazy" className="hl-bg" style={{ objectPosition: bgPosition }} />
          <div
            className={`hl-scrim ${
              scrim === 'strong'
                ? 'bg-gradient-to-t from-black via-black/80 to-black/45'
                : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
            }`}
          />
        </>
      )}
      <div className="hl-decor" aria-hidden>
        <div className="hl-wash" />
        <div className="hl-orb motion-safe:animate-[bounce_3s_infinite]" />
        <div className="hl-dot left-10 top-10 h-16 w-16 blur-xl motion-safe:animate-ping" />
        <div className="hl-dot bottom-16 right-16 h-12 w-12 blur-lg motion-safe:animate-ping" />
        <div className="hl-sheen" />
      </div>
      <div className="hl-corner tl" aria-hidden />
      <div className="hl-corner br" aria-hidden />
      <div className={`hl-content ${contentClass}`}>{children}</div>
    </Tag>
  )
}

/** The glowing icon medallion from the original card. */
export function HlMedallion({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full border-2 border-white/20 motion-safe:animate-ping" />
      <div className="absolute inset-0 rounded-full border border-white/10 motion-safe:animate-pulse" />
      <div className="rounded-full border border-white/20 bg-gradient-to-br from-black/80 to-black/60 p-5 shadow-2xl backdrop-blur-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
        <div className="transition-transform duration-700 group-hover:rotate-180">{children}</div>
      </div>
    </div>
  )
}

/** The glowing rule + three bouncing dots that close the original card. */
export function HlFooter({ center = false }: { center?: boolean }) {
  return (
    <div className={`mt-6 flex flex-col gap-4 ${center ? 'items-center' : 'items-start'}`} aria-hidden>
      <div className="hl-rule motion-safe:animate-pulse" />
      <div className="flex gap-2 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
        {[0, 0.1, 0.2].map((d) => (
          <span key={d} className="h-2 w-2 rounded-full bg-white motion-safe:animate-bounce" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  )
}
