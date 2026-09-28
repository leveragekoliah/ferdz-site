import { useReducedMotion } from 'motion/react'

/** Looping logo video (Higgsfield Seedance 2.5, seamless loop). Still poster for reduced motion. */
export default function LoopLogo({ name, className = '' }: { name: string; className?: string }) {
  const reduce = useReducedMotion()
  const poster = `/video/logos/${name}.jpg`
  if (reduce) return <img src={poster} alt="" aria-hidden className={className} />
  return <video src={`/video/logos/${name}.mp4`} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden className={className} />
}
