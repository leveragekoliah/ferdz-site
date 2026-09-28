import { useEffect, useRef } from 'react'

// Site-wide silk backdrop — "Silk Background Animation" by waleedkibhen on 21st.dev.
// The drawing code is the original, unchanged: same base gradient, pattern math, purple-grey
// silk colour (123,116,129), 2px sampling grid, noise, speed, radial depth overlay and the
// black/30 → black/50 gradient scrim. Only additions (none change the look): it is fixed behind
// every page, it pauses while the tab is hidden, and reduced-motion visitors get one still frame.

export default function SilkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let time = 0
    const speed = 0.02
    const scale = 2
    const noiseIntensity = 0.8

    // Simple noise function (original)
    const noise = (x: number, y: number) => {
      const G = 2.71828
      const rx = G * Math.sin(G * x)
      const ry = G * Math.sin(G * y)
      return (rx * ry * (1 + x)) % 1
    }

    const drawFrame = () => {
      const { width, height } = canvas
      // A hidden or collapsed window can report 0×0; createImageData would throw and take the
      // whole page down, so skip the frame until there is something to draw on.
      if (!width || !height) return

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#1a1a1a')
      gradient.addColorStop(0.5, '#2a2a2a')
      gradient.addColorStop(1, '#1a1a1a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Create silk-like pattern
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y += 2) {
          const u = (x / width) * scale
          const v = (y / height) * scale

          const tOffset = speed * time
          const tex_x = u
          const tex_y = v + 0.03 * Math.sin(8.0 * tex_x - tOffset)

          const pattern =
            0.6 +
            0.4 *
              Math.sin(
                5.0 * (tex_x + tex_y + Math.cos(3.0 * tex_x + 5.0 * tex_y) + 0.02 * tOffset) +
                  Math.sin(20.0 * (tex_x + tex_y - 0.1 * tOffset)),
              )

          const rnd = noise(x, y)
          const intensity = Math.max(0, pattern - (rnd / 15.0) * noiseIntensity)

          // Purple-gray silk color
          const index = (y * width + x) * 4
          if (index < data.length) {
            data[index] = Math.floor(123 * intensity)
            data[index + 1] = Math.floor(116 * intensity)
            data[index + 2] = Math.floor(129 * intensity)
            data[index + 3] = 255
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Add subtle overlay for depth
      const overlayGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
      overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)')
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)')
      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, 0, width, height)
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (reduced) drawFrame()
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const animate = () => {
      if (document.visibilityState === 'visible') {
        drawFrame()
        time += 1
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    drawFrame() // first frame immediately, so the backdrop is never blank
    if (!reduced) {
      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute left-0 top-0 h-full w-full" />
      {/* Gradient Overlay (original) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
    </div>
  )
}
