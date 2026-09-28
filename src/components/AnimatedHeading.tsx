import { useRef, type JSX } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { TextEffect } from '@/components/ui/text-effect'

type Props = {
  /** main heading text */
  text: string
  /** optional words appended in the accent colour, animated as part of the same sentence */
  accent?: string
  as?: keyof JSX.IntrinsicElements
  className?: string
  accentClassName?: string
  preset?: 'blur' | 'fade' | 'slide' | 'scale'
}

/** Section / page heading using the site-wide Text Effect. Plays once, when it scrolls into view. */
export default function AnimatedHeading({ text, accent, as = 'h2', className = '', accentClassName = 'text-accent', preset = 'blur' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const Tag = as as 'h2'
  const full = accent ? `${text}${text.endsWith(' ') ? '' : ' '}${accent}` : text
  const lead = accent && !text.endsWith(' ') ? `${text} ` : text
  const leadWords = lead.trim().split(/\s+/).length

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} aria-label={full} className={className}>
      {reduce ? (
        <span aria-hidden>
          {lead}
          {accent && <span className={accentClassName}>{accent}</span>}
        </span>
      ) : !inView ? (
        // hold the heading's space until it scrolls into view, so nothing jumps
        <span aria-hidden className="opacity-0">
          {full}
        </span>
      ) : (
        <>
          <TextEffect as="span" per="word" preset={preset}>
            {lead}
          </TextEffect>
          {accent && (
            <TextEffect as="span" per="word" preset={preset} delay={leadWords * 0.05} className={accentClassName}>
              {accent}
            </TextEffect>
          )}
        </>
      )}
    </Tag>
  )
}
