'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const canvasEl = canvas
    const ctxEl = ctx

    interface Particle {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      alpha: number
      canvasWidth: number
      canvasHeight: number
      reset: () => void
      update: () => void
      draw: () => void
    }

    let particles: Particle[] = []
    let animationId: number

    const resize = () => {
      canvasEl.width = canvasEl.offsetWidth
      canvasEl.height = canvasEl.offsetHeight
    }

    function Particle(this: Particle, cw: number, ch: number) {
      this.canvasWidth = cw
      this.canvasHeight = ch
      this.reset = function() {
        this.canvasWidth = canvasEl.width!
        this.canvasHeight = canvasEl.height!
        this.x = Math.random() * this.canvasWidth
        this.y = Math.random() * this.canvasHeight
        this.r = Math.random() * 2 + 0.5
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.alpha = Math.random() * 0.4 + 0.1
      }
      this.reset()
      this.update = function() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > this.canvasWidth || this.y < 0 || this.y > this.canvasHeight) {
          this.reset()
        }
      }
      this.draw = function() {
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
        particles.push(new (Particle as any)(canvasEl.width, canvasEl.height))
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

  const noiseSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcy8+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9InVybCgjYSkiLz48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii4xIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PC9zdmc+`

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
        <motion.div 
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-6 py-3 mb-8 backdrop-blur-xl shadow-glass-inner saturate-[1.8] relative overflow-hidden drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
        >
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: `url(${noiseSvg})`, backgroundSize: '400px 400px' }}
          />
          <motion.span 
            className="w-2 h-2 rounded-full bg-sky-200" 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-semibold text-white tracking-widest uppercase drop-shadow-sm [text-shadow:0_1px_0_rgba(255,255,255,0.8)] relative z-10">
            Serving Our Community Since 2020
          </span>
        </motion.div>

        <motion.h1 
          className="font-syne text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl [text-shadow:0_2px_4px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.5)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ letterSpacing: '-2px' }}
        >
          Your Community,<br />Connected.
        </motion.h1>

        <motion.p 
          className="font-dm-sans text-lg sm:text-xl text-white/95 max-w-xl mx-auto mb-12 font-light drop-shadow-sm [text-shadow:0_1px_0_rgba(255,255,255,0.5)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Find nonprofits, support services, events, and volunteers. All in one place, built for every resident.
        </motion.p>

        <div className="flex gap-4 justify-center flex-wrap mb-20">
          <motion.div 
            whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              href="/resources" 
              className="block bg-white/10 border border-white/20 backdrop-blur-xl saturate-[1.8] shadow-glass-inner text-sky-900 font-dm-sans font-semibold text-lg px-10 py-5 rounded-3xl relative overflow-hidden drop-shadow-2xl hover:bg-white/20 hover:shadow-glass-lg hover:backdrop-blur-2xl hover:drop-shadow-2xl transition-all [text-shadow:0_1px_0_rgba(255,255,255,0.3)]"
            >
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url(${noiseSvg})`, backgroundSize: '400px 400px' }}
              />
              <span className="relative z-10">Explore Resources</span>
            </Link>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              href="/events" 
              className="block bg-white/10 border border-white/20 backdrop-blur-xl saturate-[1.8] shadow-glass-inner text-white font-dm-sans font-semibold text-lg px-10 py-5 rounded-3xl relative overflow-hidden hover:bg-white/20 hover:shadow-glass-lg hover:backdrop-blur-2xl hover:border-white/40 drop-shadow-2xl hover:drop-shadow-2xl transition-all [text-shadow:0_1px_0_rgba(255,255,255,0.8)]"
            >
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url(${noiseSvg})`, backgroundSize: '400px 400px' }}
              />
              <span className="relative z-10">Upcoming Events</span>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="flex justify-center divide-x divide-white/30 gap-1"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center px-10 py-4 backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-glass-inner saturate-[1.8] hover:backdrop-blur-xl hover:shadow-light-gradient hover:scale-105 hover:drop-shadow-xl"
            whileHover={{ scale: 1.05, transition: { type: 'spring' } }}
          >
            <span className="font-syne text-3xl font-bold text-white block drop-shadow-sm">500+</span>
            <span className="font-dm-sans text-xs font-medium text-white/90 uppercase tracking-wider drop-shadow-sm">Resources Listed</span>
          </motion.div>
          <motion.div 
            className="text-center px-10 py-4 backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-glass-inner saturate-[1.8] hover:backdrop-blur-xl hover:shadow-light-gradient hover:scale-105 hover:drop-shadow-xl"
            whileHover={{ scale: 1.05, transition: { type: 'spring' } }}
          >
            <span className="font-syne text-3xl font-bold text-white block drop-shadow-sm">1,200+</span>
            <span className="font-dm-sans text-xs font-medium text-white/90 uppercase tracking-wider drop-shadow-sm">Volunteers</span>
          </motion.div>
          <motion.div 
            className="text-center px-10 py-4 backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-glass-inner saturate-[1.8] hover:backdrop-blur-xl hover:shadow-light-gradient hover:scale-105 hover:drop-shadow-xl"
            whileHover={{ scale: 1.05, transition: { type: 'spring' } }}
          >
            <span className="font-syne text-3xl font-bold text-white block drop-shadow-sm">48</span>
            <span className="font-dm-sans text-xs font-medium text-white/90 uppercase tracking-wider drop-shadow-sm">Partner Orgs</span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/80 drop-shadow-md"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="w-10 h-10 rounded-full border-2 border-white/40 backdrop-blur-xl bg-white/10 shadow-glass-inner hover:bg-white/20 hover:shadow-light-gradient hover:scale-110 transition-all cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 animate-bounce mx-auto mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
        <span className="text-[11px] uppercase tracking-[1.5px] font-syne font-medium drop-shadow-sm">Scroll</span>
      </motion.div>
    </motion.section>
  )
}
