"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, HeartHandshake, MapPin, MoveRight, Search, Sparkles } from "lucide-react"
import Link from "next/link"

interface HeroProps {
  badge?: string;
  staticTitle?: string;
  rotatingTitles?: string[];
  subtitle?: string;
  primaryHref?: string;
  primaryText?: string;
  secondaryHref?: string;
  secondaryText?: string;
  stats?: Array<{value: string; label: string}>;
  backgroundImage?: string;
}

// ── Bubble physics ────────────────────────────────────────────────────────────
const BUBBLE_DATA = [
  { Icon: Search,          label: 'Food assistance', value: '12 nearby'  },
  { Icon: CalendarDays,    label: 'This weekend',    value: '4 events'   },
  { Icon: HeartHandshake,  label: 'Volunteer match', value: 'Open now'   },
  { Icon: MapPin,          label: 'Bothell hub',     value: 'Live guide' },
]

interface BubbleState {
  x: number; y: number;
  vx: number; vy: number;
  w: number;  h: number;
}

function FloatingBubbles() {
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([])
  const stateRef   = useRef<BubbleState[]>([])
  const rafRef     = useRef<number>(0)

  useEffect(() => {
    const W = () => window.innerWidth
    const H = () => window.innerHeight

    stateRef.current = BUBBLE_DATA.map((_, i) => {
      const angle = (i / BUBBLE_DATA.length) * Math.PI * 2 + Math.PI / 6
      const r     = Math.min(W(), H()) * 0.33
      const dir   = Math.random() * Math.PI * 2
      const speed = 0.28 + Math.random() * 0.18
      return {
        x:  W() / 2 + Math.cos(angle) * r,
        y:  H() / 2 + Math.sin(angle) * r,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        w: 0, h: 0,
      }
    })

    // Measure rendered sizes
    requestAnimationFrame(() => {
      bubbleRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        stateRef.current[i].w = rect.width
        stateRef.current[i].h = rect.height
      })
    })

    const CENTER_AVOID = 240

    const tick = () => {
      const w = W(), h = H()
      const cx = w / 2, cy = h / 2

      stateRef.current.forEach((b, i) => {
        b.x += b.vx
        b.y += b.vy

        // Wall bounce
        if (b.x < 0)       { b.x = 0;       b.vx *= -1 }
        if (b.x + b.w > w) { b.x = w - b.w; b.vx *= -1 }
        if (b.y < 0)       { b.y = 0;        b.vy *= -1 }
        if (b.y + b.h > h) { b.y = h - b.h; b.vy *= -1 }

        // Soft repulsion from center content
        const bCx  = b.x + b.w / 2
        const bCy  = b.y + b.h / 2
        const dx   = bCx - cx
        const dy   = bCy - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CENTER_AVOID && dist > 0) {
          const force = ((CENTER_AVOID - dist) / CENTER_AVOID) * 0.25
          b.vx += (dx / dist) * force
          b.vy += (dy / dist) * force
        }

        // Speed cap
        const spd    = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
        const maxSpd = 0.55
        if (spd > maxSpd) {
          b.vx = (b.vx / spd) * maxSpd
          b.vy = (b.vy / spd) * maxSpd
        }

        // Tiny random drift
        if (Math.random() < 0.004) {
          b.vx += (Math.random() - 0.5) * 0.06
          b.vy += (Math.random() - 0.5) * 0.06
        }

        const el = bubbleRefs.current[i]
        if (el) {
          el.style.left = `${b.x}px`
          el.style.top  = `${b.y}px`
        }
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {BUBBLE_DATA.map(({ Icon, label, value }, i) => (
        <div
          key={label}
          ref={el => { bubbleRefs.current[i] = el }}
          className="absolute pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full whitespace-nowrap cursor-default select-none"
          style={{
            background:     'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(18px)',
            border:         '1px solid rgba(255,255,255,0.14)',
            boxShadow:      '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
            transition:     'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement
            el.style.transform  = 'scale(1.1)'
            el.style.background = 'rgba(255,255,255,0.13)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement
            el.style.transform  = 'scale(1)'
            el.style.background = 'rgba(255,255,255,0.07)'
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Icon className="w-3.5 h-3.5 text-sky-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-[0.11em] text-sky-100/60 leading-none">
              {label}
            </span>
            <span className="font-space text-[13px] font-semibold text-white leading-snug">
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Bloom / flower rotating title ─────────────────────────────────────────────
function BloomTitle({ titles }: { titles: string[] }) {
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setExiting(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % titles.length)
        setExiting(false)
      }, 500)
    }, 2600)
    return () => clearInterval(id)
  }, [titles.length])

  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ height: '1.1em' }}
    >
      {titles.map((t, i) => {
        const isActive  = i === current && !exiting
        const isExiting = i === current &&  exiting
        return (
          <span
            key={t}
            className="absolute font-bold text-sky-200"
            style={{
              opacity:   isActive ? 1 : 0,
              transform: isActive  ? 'scale(1) rotate(0deg)'
                       : isExiting ? 'scale(1.35) rotate(6deg)'
                       :             'scale(0.6) rotate(-8deg)',
              filter:    isActive  ? 'blur(0px)'
                       : isExiting ? 'blur(12px)'
                       :             'blur(8px)',
              transition: isExiting
                ? 'opacity 0.5s ease, transform 0.5s ease, filter 0.4s ease'
                : 'opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1), filter 0.5s ease',
              pointerEvents: 'none',
            }}
          >
            {t}
          </span>
        )
      })}
    </div>
  )
}

// ── Page-press hook ───────────────────────────────────────────────────────────
function usePressEffect() {
  const [pressed, setPressed] = useState(false)
  useEffect(() => {
    const down = () => setPressed(true)
    const up   = () => setPressed(false)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup',   up)
    return () => {
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup',   up)
    }
  }, [])
  return pressed
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({
  badge          = 'Serving Our Community Since 2020',
  staticTitle,
  rotatingTitles = ["amazing", "wonderful", "strong", "united", "connected"],
  subtitle       = 'Find nonprofits, support services, events, and volunteers. All in one place, built for every resident.',
  primaryHref,
  primaryText,
  secondaryHref,
  secondaryText,
  stats = [
    { value: '30+',  label: 'Resources Listed' },
    { value: '150+', label: 'Volunteers'        },
    { value: '10',   label: 'Partner Orgs'      },
  ],
  backgroundImage,
}: HeroProps) {
  const isHomeHero = backgroundImage === undefined
  const pressed    = usePressEffect()

  return (
    <div
      style={{
        transform:       pressed ? 'scale(0.982)' : 'scale(1)',
        transition:      'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        transformOrigin: 'center center',
      }}
    >
      <div
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden kinetic-gradient"
        style={{
          backgroundColor: '#022747',
          backgroundImage: isHomeHero
            ? "linear-gradient(145deg, rgba(1,22,41,0.86) 0%, rgba(4,64,105,0.76) 45%, rgba(13,123,181,0.48) 78%, rgba(255,140,66,0.22) 140%), url('/img/avess-berge-ua2IF9HNaXs-unsplash.png')"
            : undefined,
          backgroundSize:     isHomeHero ? 'cover'      : undefined,
          backgroundPosition: isHomeHero ? 'center'     : undefined,
          backgroundRepeat:   isHomeHero ? 'no-repeat'  : undefined,
          ...(backgroundImage && backgroundImage !== '' ? {
            backgroundImage:    `url('${backgroundImage}')`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            backgroundRepeat:   'no-repeat',
          } : {}),
        }}
      >
        {/* Solid dark cover when backgroundImage is explicitly empty string */}
        {backgroundImage === '' && (
          <div className="absolute inset-0" style={{ backgroundColor: '#011629' }} />
        )}

        {/* Dark overlay for non-home pages that have a background image */}
        {backgroundImage && (
          <div className="absolute inset-0 bg-sky-950/60" />
        )}

        {/* Radial gradient effects */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(36,153,214,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(4,64,105,0.5)_0%,transparent_50%),radial-gradient(ellipse_at_60%_10%,rgba(198,235,255,0.2)_0%,transparent_40%)]" />
        </div>

        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-sky-400/15 blur-[60px] animate-pulse" />
          <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-sky-600/25 blur-[60px] animate-pulse" />
          <div className="absolute top-1/2 left-[20%] w-[200px] h-[200px] rounded-full bg-sky-200/10 blur-[60px] animate-pulse" />
        </div>

        {/* Swoosh shapes — home only */}
        {isHomeHero && (
          <>
            <motion.div
              aria-hidden="true"
              className="absolute left-[-8%] top-[18%] h-24 w-[46%] rounded-full border border-white/10 bg-white/5 blur-[0.2px]"
              animate={{ x: [0, 34, 0], rotate: [-8, -4, -8] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute right-[-10%] bottom-[22%] h-20 w-[42%] rounded-full border border-sky-100/10 bg-sky-100/5 blur-[0.2px]"
              animate={{ x: [0, -28, 0], rotate: [9, 5, 9] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}

        {/* Floating bubbles — home only */}
        {isHomeHero && <FloatingBubbles />}

        {/* Main content */}
        <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="min-h-screen flex flex-col items-center justify-center py-24 lg:py-28">
            <div className="flex gap-8 items-center justify-center flex-col w-full">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -2, scale: 1.03 }}
                className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2"
              >
                <span className="liquid-content flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                  <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">
                    {badge}
                  </span>
                </span>
              </motion.div>

              {/* Title */}
              <div className="flex gap-4 flex-col w-full items-center">
                {staticTitle ? (
                  <motion.h1
                    initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl lg:text-8xl max-w-4xl w-full tracking-tighter text-center font-bold font-space text-white mx-auto"
                    dangerouslySetInnerHTML={{ __html: staticTitle }}
                  />
                ) : (
                  <h1 className="text-5xl md:text-7xl lg:text-8xl max-w-4xl w-full tracking-tighter text-center font-bold font-space text-white mx-auto">
                    <span className="text-white">Your Community is</span>
                    <BloomTitle titles={rotatingTitles} />
                  </h1>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl leading-relaxed tracking-tight text-white/75 max-w-2xl w-full text-center font-outfit mx-auto"
                >
                  {subtitle}
                </motion.p>
              </div>

              {/* CTA buttons */}
              {(primaryText || secondaryText) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-row gap-4 mt-4"
                >
                  {primaryText && primaryHref && (
                    <Link href={primaryHref}>
                      <motion.button
                        whileHover={{ y: -4, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-syne font-bold text-base transition-all liquid-glass"
                        style={{ color: 'white' }}
                      >
                        <span className="liquid-content inline-flex items-center gap-3">
                          {primaryText} <MoveRight className="w-4 h-4" />
                        </span>
                      </motion.button>
                    </Link>
                  )}
                  {secondaryText && secondaryHref && (
                    <Link href={secondaryHref}>
                      <motion.button
                        whileHover={{ y: -4, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-syne font-bold text-base transition-all bg-white/10 border border-white/25 backdrop-blur-xl"
                        style={{ color: 'white' }}
                      >
                        {secondaryText} <MoveRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  )}
                </motion.div>
              )}

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center divide-x divide-white/15 mt-12"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="text-center px-8"
                    whileHover={{ y: -5, scale: 1.04 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <span className="font-space text-3xl font-bold text-white block">{stat.value}</span>
                    <span className="font-outfit text-xs font-medium text-white/85 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/50"
        >
          <div className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center">
            <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <span className="text-[11px] uppercase tracking-[1.5px]">Scroll</span>
        </motion.div>
      </div>
    </div>
  )
}

export { Hero }