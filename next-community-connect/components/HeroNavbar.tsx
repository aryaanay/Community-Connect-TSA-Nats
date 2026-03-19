'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const canvasEl = canvas
    const ctxEl = ctx

    let particles: Particle[] = []
    let animationId: number

    const resize = () => {
      canvasEl.width = canvasEl.offsetWidth
      canvasEl.height = canvasEl.offsetHeight
    }

    class Particle {
      x = 0
      y = 0
      r = 0
      vx = 0
      vy = 0
      alpha = 0
      canvasWidth = 0
      canvasHeight = 0

      constructor(cw: number, ch: number) {
        this.canvasWidth = cw
        this.canvasHeight = ch
        this.reset()
      }

      reset() {
        this.canvasWidth = canvasEl.width!
        this.canvasHeight = canvasEl.height!
        this.x = Math.random() * this.canvasWidth
        this.y = Math.random() * this.canvasHeight
        this.r = Math.random() * 2 + 0.5
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.alpha = Math.random() * 0.4 + 0.1
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > this.canvasWidth || this.y < 0 || this.y > this.canvasHeight) {
          this.reset()
        }
      }

      draw() {
        ctxEl.beginPath()
        ctxEl.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctxEl.fillStyle = `rgba(236,248,255,${this.alpha})`
        ctxEl.fill()
      }
    }

    const init = () => {
      resize()
      particles = []
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(canvasEl.width, canvasEl.height))
      }
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctxEl.beginPath()
            ctxEl.strokeStyle = `rgba(236,248,255,${0.08 * (1 - dist / 100)})`
            ctxEl.lineWidth = 0.5
            ctxEl.moveTo(particles[i].x, particles[i].y)
            ctxEl.lineTo(particles[j].x, particles[j].y)
            ctxEl.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctxEl.clearRect(0, 0, canvasEl.width, canvasEl.height)
      particles.forEach(p => { p.update(); p.draw() })
      drawConnections()
      animationId = requestAnimationFrame(animate)
    }

    init()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/img/avess-berge-ua2IF9HNaXs-unsplash.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/70 via-sky-800/60 to-sky-900/80" />
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(36,153,214,0.6)_0%,transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(4,64,105,0.8)_0%,transparent_50%),radial-gradient(ellipse_at_60%_10%,rgba(236,248,255,0.3)_0%,transparent_40%)]" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-sky-300/30 blur-[60px] animate-pulse" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-sky-600/50 blur-[60px] animate-pulse" />
        <div className="absolute top-1/2 left-[20%] w-[200px] h-[200px] rounded-full bg-sky-100/30 blur-[60px] animate-pulse" />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/30 border border-white/50 rounded-full px-4 py-2 mb-7 backdrop-blur-xl shadow-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-200 animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-widest uppercase">Serving Our Community Since 2020</span>
        </div>

        <h1 className="font-syne text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6" style={{ letterSpacing: '-2px' }}>
          Your Community,<br />Connected.
        </h1>

        <p className="font-dm-sans text-lg sm:text-xl text-white max-w-xl mx-auto mb-10 font-light">
          Find nonprofits, support services, events, and volunteers. All in one place, built for every resident.
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-16">
          <Link href="/resources" className="bg-white text-sky-900 px-8 py-4 rounded-2xl font-dm-sans font-semibold text-sm flex items-center gap-2 shadow-2xl hover:shadow-sky-500/60 hover:-translate-y-1 transition-all backdrop-blur-xl">
            Explore Resources
          </Link>
          <Link href="/events" className="bg-white/30 border border-white/50 text-white px-8 py-4 rounded-2xl font-dm-sans font-semibold text-sm flex items-center gap-2 backdrop-blur-xl hover:bg-white/50 hover:border-white/70 transition-all">
            Upcoming Events
          </Link>
        </div>

        <div className="flex justify-center divide-x divide-white/40">
          <div className="text-center px-8">
            <span className="font-syne text-3xl font-bold text-white block">500+</span>
            <span className="font-dm-sans text-xs font-medium text-white/90 uppercase tracking-wider">Resources Listed</span>
          </div>
          <div className="text-center px-8">
            <span className="font-syne text-3xl font-bold text-white block">1,200+</span>
            <span className="font-dm-sans text-xs font-medium text-white/90 uppercase tracking-wider">Volunteers</span>
          </div>
          <div className="text-center px-8">
            <span className="font-syne text-3xl font-bold text-white block">48</span>
            <span className="font-dm-sans text-xs font-medium text-white/90 uppercase tracking-wider">Partner Orgs</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/80">
        <div className="w-9 h-9 rounded-full border-2 border-white/60 flex items-center justify-center backdrop-blur-xl hover:bg-white/30 transition-all shadow-lg">
          <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <span className="text-[11px] uppercase tracking-[1.5px] font-syne font-medium">Scroll</span>
      </div>
    </section>
  )
}