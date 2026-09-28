import React, { useEffect, useMemo, useRef } from 'react'

// Metallic card — adapted from the "MetallicBusinessCard" component supplied by Koliah.
// Kept from the original: metal finishes, 3D tilt toward the pointer, the light that follows the
// pointer, the conic sheen, the SVG turbulence grain and the eased animation loop.
// Changed: styled-jsx (Next.js only) moved to index.css (.metal-wrap / .metal-card), width is
// responsive with the ISO card ratio (1.586), and the content is a payment-card layout.
// The card number is decorative: it fails the Luhn check and matches no card network.

type Metal = 'gold' | 'silver' | 'bronze' | 'platinum'

const METAL_BG: Record<Metal, string> = { gold: '#ffcc70', silver: '#dddde0', bronze: '#df9070', platinum: '#ffffff' }
const METAL_TOKENS: Record<Metal, { ink: string; sub: string; glow1: string; glow2: string }> = {
  gold: { ink: 'oklch(0.22 0.06 70)', sub: 'oklch(0.38 0.03 70)', glow1: 'rgba(255, 215, 170, .55)', glow2: 'rgba(255, 235, 200, .28)' },
  bronze: { ink: 'oklch(0.20 0.06 45)', sub: 'oklch(0.36 0.03 45)', glow1: 'rgba(255, 200, 165, .52)', glow2: 'rgba(255, 215, 185, .26)' },
  silver: { ink: 'oklch(0.16 0 240)', sub: 'oklch(0.40 0 240)', glow1: 'rgba(255, 255, 255, .46)', glow2: 'rgba(245, 245, 255, .22)' },
  platinum: { ink: 'oklch(0.15 0 250)', sub: 'oklch(0.38 0 250)', glow1: 'rgba(255, 255, 255, .42)', glow2: 'rgba(235, 240, 255, .2)' },
}

export type MetallicCardProps = {
  name: string
  number: string
  validThru: string
  brand: string
  logoSrc?: string
  metal?: Metal
  maxWidth?: number
  radius?: number
  maxRotation?: number
  influenceRadius?: number
  ease?: number
  lightFollow?: number
  className?: string
}

export function MetallicCard({
  name,
  number,
  validThru,
  brand,
  logoSrc,
  metal = 'silver',
  maxWidth = 460,
  radius = 16,
  maxRotation = 40,
  influenceRadius = 500,
  ease = 0.08,
  lightFollow = 0.4,
  className = '',
}: MetallicCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const noiseId = useMemo(() => `noiseFilter-${Math.random().toString(36).slice(2, 8)}`, [])

  const current = useRef({ angle: 0, x: 0, y: 0 })
  const target = useRef({ angle: 0, x: 0, y: 0 })
  const currentG = useRef({ x: 50, y: 50 })
  const targetG = useRef({ x: 50, y: 50 })

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    let raf = 0
    const tick = () => {
      current.current.angle = lerp(current.current.angle, target.current.angle, ease)
      current.current.x = lerp(current.current.x, target.current.x, ease)
      current.current.y = lerp(current.current.y, target.current.y, ease)
      currentG.current.x = lerp(currentG.current.x, targetG.current.x, ease)
      currentG.current.y = lerp(currentG.current.y, targetG.current.y, ease)
      const host = wrapRef.current
      if (host) {
        host.style.setProperty('--gradient-rotation', `${current.current.angle}deg`)
        host.style.setProperty('--rotate-x', `${current.current.x}deg`)
        host.style.setProperty('--rotate-y', `${current.current.y}deg`)
        host.style.setProperty('--gradient-position-x', `${currentG.current.x}%`)
        host.style.setProperty('--gradient-position-y', `${currentG.current.y}%`)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ease])

  const reset = () => {
    target.current = { angle: 0, x: 0, y: 0 }
    targetG.current = { x: 50, y: 50 }
  }

  const onPointer = (e: React.PointerEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2))
    const mult = Math.max(0.1, 1 - Math.min(1, dist / influenceRadius))
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    if (dist < influenceRadius) {
      targetG.current.x = 50 - (nx - 0.5) * 100 * lightFollow
      targetG.current.y = 50 - (ny - 0.5) * 100 * lightFollow
      target.current.y = (nx - 0.5) * maxRotation * 2 * mult
      target.current.x = (0.5 - ny) * maxRotation * 2 * mult
      target.current.angle = (120 * (1 - nx) * (1 - ny) + 120 * nx * ny) * mult
    } else {
      target.current.angle = 0
    }
  }

  const ink = METAL_TOKENS[metal]
  const groups = number.replace(/\D/g, '').match(/.{1,4}/g) ?? []

  return (
    <div
      ref={wrapRef}
      className={`metal-wrap ${className}`}
      style={
        {
          '--bg-card': METAL_BG[metal],
          '--border-radius': `${radius}px`,
          '--noise-filter': `url(#${noiseId})`,
          '--ink': ink.ink,
          '--ink-sub': ink.sub,
          '--glow-1': ink.glow1,
          '--glow-2': ink.glow2,
        } as React.CSSProperties
      }
      role="img"
      aria-label={`${brand} metal card for ${name}`}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <filter id={noiseId} filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="linearRGB">
          <feTurbulence type="turbulence" baseFrequency="0.3" numOctaves={4} seed={15} stitchTiles="stitch" result="turbulence" />
          <feSpecularLighting surfaceScale={1} specularConstant={1.8} specularExponent={10} lightingColor="#7957A8" in="turbulence" result="specularLighting">
            <feDistantLight azimuth={3} elevation={50} />
          </feSpecularLighting>
          <feColorMatrix type="saturate" values="0" in="specularLighting" result="colormatrix" />
        </filter>
      </svg>

      <div ref={cardRef} className="metal-card" style={{ maxWidth }} onPointerMove={onPointer} onPointerLeave={reset} onBlur={reset}>
        <div className="metal-content">
          <div className="metal-top">
            <div className="metal-brand">
              {logoSrc && <img src={logoSrc} alt="" className="metal-logo" />}
              <span className="metal-wordmark">{brand}</span>
            </div>
            {/* contactless symbol */}
            <svg className="metal-nfc" viewBox="0 0 24 24" aria-hidden>
              <path d="M8.5 7.5a6 6 0 0 1 0 9M12 5a9.5 9.5 0 0 1 0 14M15.5 2.5a13 13 0 0 1 0 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          {/* EMV chip */}
          <div className="metal-chip" aria-hidden>
            <span />
          </div>

          <p className="metal-number">
            {groups.map((g, i) => (
              <span key={i}>{g}</span>
            ))}
          </p>

          <div className="metal-bottom">
            <p className="metal-name">{name}</p>
            <div className="metal-valid">
              <span className="metal-valid-label">
                VALID
                <br />
                THRU
              </span>
              <span className="metal-valid-date">{validThru}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetallicCard
