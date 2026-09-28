import { useEffect, useRef, useState, type ReactNode } from 'react'

// Scroll-locked video hero — adapted from "Scroll-Locked Video Hero" by gughigug on 21st.dev.
// While the hero is active the page is pinned and wheel/touch/keys scrub the video.
// Changes from the original: the page releases once the video reaches the end (so the rest
// of the site is reachable), re-locks when the visitor scrolls back up to the top, keyboard
// scrolling works, reduced-motion visitors get a static end frame with no lock, and phones
// load a smaller file.

type Props = {
  title: ReactNode
  tagline?: ReactNode
  scrollHint?: string
  scrubDistance?: number
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const DOWN_KEYS = ['ArrowDown', 'PageDown', ' ', 'Spacebar']
const UP_KEYS = ['ArrowUp', 'PageUp']

export default function VideoHero({ title, tagline, scrollHint = 'Scroll', scrubDistance = 1600 }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [reduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  // Touchscreens (phones, tablets without a mouse) use native scrolling through a tall pinned section
  // instead of the scroll lock: iOS/Android fight a locked body (address bar, momentum, rubber-band).
  const [touchMode] = useState(
    () => (window.matchMedia?.('(pointer: coarse)').matches ?? false) && !(window.matchMedia?.('(pointer: fine)').matches ?? false),
  )
  const [src] = useState(() =>
    window.matchMedia?.('(max-aspect-ratio: 3/4)').matches
      ? '/video/hero-scrub-9x16.mp4' // portrait phones: the dedicated 9:16 cut
      : window.matchMedia?.('(max-width: 768px)').matches
        ? '/video/hero-scrub-sm.mp4'
        : '/video/hero-scrub.mp4',
  )

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    let duration = 0
    let rafId = 0
    let target = 0
    let current = 0
    let started = false
    let seeking = false
    let pending: number | null = null
    let lastSeek = -1
    let locked = false
    let lockedY = 0
    let touchY = 0

    const onLoaded = () => {
      duration = video.duration || 0
      setReady(true)
      if (reduced) video.currentTime = duration * 0.95
    }
    video.addEventListener('loadeddata', onLoaded)
    if (video.readyState >= 2) onLoaded()

    // iOS won't buffer until playback starts — play/pause once to kick off loading.
    const p = video.play()
    if (p && typeof p.then === 'function') p.then(() => video.pause()).catch(() => {})
    else video.pause()

    const onSeeked = () => {
      seeking = false
      if (pending !== null) {
        const t = pending
        pending = null
        seeking = true
        video.currentTime = t
      }
    }
    video.addEventListener('seeked', onSeeked)

    const seekTo = (t: number) => {
      if (Math.abs(t - lastSeek) < 0.01) return
      lastSeek = t
      if (seeking) {
        pending = t
        return
      }
      seeking = true
      video.currentTime = t
    }

    const lock = () => {
      if (locked) return
      locked = true
      lockedY = window.scrollY
      const b = document.body.style
      b.position = 'fixed'
      b.top = `-${lockedY}px`
      b.left = '0'
      b.right = '0'
      b.width = '100%'
      b.overscrollBehavior = 'none'
    }
    const unlock = () => {
      if (!locked) return
      locked = false
      const b = document.body.style
      b.position = ''
      b.top = ''
      b.left = ''
      b.right = ''
      b.width = ''
      b.overscrollBehavior = ''
      window.scrollTo(0, lockedY)
    }

    if (reduced) {
      return () => {
        video.removeEventListener('loadeddata', onLoaded)
        video.removeEventListener('seeked', onSeeked)
      }
    }

    if (touchMode) {
      const onScroll = () => {
        const r = section.getBoundingClientRect()
        const travel = r.height - window.innerHeight
        target = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0
        if (target > 0.001) started = true
      }
      // iOS may not buffer until a user gesture: nudge loading on the first touch
      const kick = () => {
        const q = video.play()
        if (q && typeof q.then === 'function') q.then(() => video.pause()).catch(() => {})
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('touchstart', kick, { passive: true, once: true })
      onScroll()
      const frameT = () => {
        current += (target - current) * 0.2
        if (Math.abs(target - current) < 0.0005) current = target
        if (duration > 0) seekTo(current * duration)
        paint()
        rafId = requestAnimationFrame(frameT)
      }
      rafId = requestAnimationFrame(frameT)
      return () => {
        video.removeEventListener('loadeddata', onLoaded)
        video.removeEventListener('seeked', onSeeked)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('touchstart', kick)
        cancelAnimationFrame(rafId)
      }
    }

    if (window.scrollY <= 0) lock()
    else {
      target = current = 1
    }

    // Returns true when the hero consumed the input (page should not move).
    const handle = (dy: number) => {
      if (!locked) {
        // Re-enter the hero when pushing up while already at the very top.
        if (window.scrollY <= 0 && dy < 0) lock()
        else return false
      }
      if (target >= 1 && current > 0.985 && dy > 0) {
        unlock()
        return false
      }
      target = clamp(target + dy / scrubDistance, 0, 1)
      if (target > 0.001) started = true
      return true
    }

    const onWheel = (e: WheelEvent) => {
      if (handle(e.deltaY)) e.preventDefault()
    }
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY
      const dy = (touchY - y) * 1.6
      touchY = y
      if (handle(dy) && e.cancelable) e.preventDefault()
    }
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return
      const dy = DOWN_KEYS.includes(e.key) ? 450 : UP_KEYS.includes(e.key) ? -450 : e.key === 'Home' ? -scrubDistance : 0
      if (dy && handle(dy)) e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)

    const frame = () => {
      current += (target - current) * 0.22
      if (Math.abs(target - current) < 0.0005) current = target
      if (duration > 0) seekTo(current * duration)
      paint()
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    return () => {
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(rafId)
      unlock()
    }

    function paint() {
      if (videoRef.current) videoRef.current.style.transform = `scale(${1 + current * 0.06})`
      if (titleRef.current) {
        const t = 1 - clamp(current / 0.35, 0, 1)
        titleRef.current.style.opacity = String(t)
        titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`
        titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`
      }
      if (hintRef.current) hintRef.current.style.opacity = started ? '0' : '1'
      if (taglineRef.current) {
        const t = clamp((current - 0.8) / 0.2, 0, 1)
        taglineRef.current.style.opacity = String(t)
        taglineRef.current.style.transform = `translateY(${(1 - t) * 20}px) scale(${0.97 + t * 0.03})`
        taglineRef.current.style.filter = `blur(${(1 - t) * 8}px)`
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${current})`
    }
  }, [scrubDistance, reduced, touchMode])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-bg"
      style={{ height: touchMode && !reduced ? '200svh' : '100dvh' }}
      aria-label="Intro"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
      <picture>
        <source media="(max-aspect-ratio: 3/4)" srcSet="/img/hero-poster-9x16.jpg" />
        <img src="/img/hero-poster.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full origin-center object-cover transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0, willChange: 'transform' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg/80" />

      <div
        ref={titleRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
        style={reduced ? { opacity: 0 } : undefined}
      >
        <h1 className="font-display uppercase text-[40px] leading-[1.02] text-ink [text-shadow:0_4px_30px_rgba(0,0,0,0.5)] sm:text-[72px] lg:text-[104px]">
          {title}
        </h1>
      </div>

      {tagline && (
        <div
          ref={taglineRef}
          className="absolute inset-x-0 top-[20%] flex justify-center px-6 text-center md:top-[22%]"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          {tagline}
        </div>
      )}

      {!reduced && (
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-[clamp(20px,6vh,48px)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[12px] font-medium uppercase tracking-[0.3em] text-ink/75 transition-opacity duration-500"
        >
          <span>{scrollHint}</span>
          <svg width="14" height="18" viewBox="0 0 14 18" className="animate-bounce">
            <path d="M7 1 L7 17 M2 12 L7 17 L12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-ink/10">
        <div ref={barRef} className="h-full w-full origin-left bg-accent" style={{ transform: `scaleX(${reduced ? 1 : 0})` }} />
      </div>
      </div>
    </section>
  )
}
