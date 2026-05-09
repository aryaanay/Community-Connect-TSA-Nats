'use client'

import {
  useState, useEffect, useRef, useCallback,
  Suspense, useTransition,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Shield, Clock, Users, Check, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { WelcomeAnimation } from '@/components/WelcomeAnimation'

const JUDGE_EMAIL = 'judges@tsa.com'
const JUDGE_PASSWORD = 'judges!'

// ─────────────────────────────────────────────
// Canvas hook: repulsion particles (left panel)
// ─────────────────────────────────────────────
type RP = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; size: number; op: number }

function useRepulseCanvas(mouseRef: React.MutableRefObject<{ x: number; y: number } | null>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    const ps: RP[] = []

    const setup = () => {
      const el = canvas.parentElement!
      const dpr = window.devicePixelRatio || 1
      const w = el.offsetWidth, h = el.offsetHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ps.length = 0
      const cols = Math.max(7, Math.floor(w / 82))
      const rows = Math.max(6, Math.floor(h / 82))
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = (w / cols) * (c + 0.5) + (Math.random() - 0.5) * 28
          const y = (h / rows) * (r + 0.5) + (Math.random() - 0.5) * 28
          ps.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, size: 1.1 + Math.random() * 2.4, op: 0.2 + Math.random() * 0.55 })
        }
      }
    }

    setup()
    window.addEventListener('resize', setup)

    const draw = () => {
      const el = canvas.parentElement!
      const w = el.offsetWidth, h = el.offsetHeight
      ctx.clearRect(0, 0, w, h)
      const m = mouseRef.current

      for (const p of ps) {
        if (m) {
          const dx = p.x - m.x, dy = p.y - m.y
          const d2 = dx * dx + dy * dy
          const R = 148
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = ((R - d) / R) ** 1.8 * 5.8
            p.vx += (dx / d) * f; p.vy += (dy / d) * f
          }
        }
        p.vx += (p.ox - p.x) * 0.042; p.vy += (p.oy - p.y) * 0.042
        p.vx *= 0.82; p.vy *= 0.82
        p.x += p.vx; p.y += p.vy
      }

      // Connections
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < 8100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(86,187,240,${(1 - Math.sqrt(d2) / 90) * 0.15})`
            ctx.lineWidth = 0.5
            ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y)
            ctx.stroke()
          }
        }
      }

      // Dots
      for (const p of ps) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(86,187,240,${p.op})`
        ctx.fill()
        if (p.size > 2.3) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.8)
          g.addColorStop(0, `rgba(144,212,247,${p.op * 0.38})`)
          g.addColorStop(1, 'rgba(144,212,247,0)')
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3.8, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', setup) }
  }, [mouseRef])

  return canvasRef
}

// ─────────────────────────────────────────────
// Canvas hook: swirl emitter (right panel)
// ─────────────────────────────────────────────
type SD = { ox: number; oy: number; angle: number; radius: number; vA: number; vR: number; life: number; max: number; r: number; g: number; b: number }

function useSwirlCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dots = useRef<SD[]>([])
  const prev = useRef<{ x: number; y: number } | null>(null)

  const emit = useCallback((x: number, y: number) => {
    if (prev.current) {
      const dx = x - prev.current.x, dy = y - prev.current.y
      if (dx * dx + dy * dy < 6) return
    }
    prev.current = { x, y }
    const palette: [number, number, number][] = [
      [86, 187, 240], [144, 212, 247], [255, 255, 255], [36, 153, 214], [198, 235, 255],
    ]
    for (let i = 0; i < 5; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      dots.current.push({
        ox: x, oy: y,
        angle: (Math.PI * 2 * i) / 5 + Math.random() * 0.8,
        radius: Math.random() * 3,
        vA: (0.048 + Math.random() * 0.042) * (Math.random() > 0.5 ? 1 : -1),
        vR: 0.75 + Math.random() * 1.2,
        life: 0, max: 46 + Math.random() * 38,
        r: c[0], g: c[1], b: c[2],
      })
    }
    if (dots.current.length > 380) dots.current = dots.current.slice(-380)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0

    const setup = () => {
      const el = canvas.parentElement!
      const dpr = window.devicePixelRatio || 1
      const w = el.offsetWidth, h = el.offsetHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    setup()
    window.addEventListener('resize', setup)

    const draw = () => {
      const el = canvas.parentElement!
      const w = el.offsetWidth, h = el.offsetHeight
      ctx.clearRect(0, 0, w, h)
      dots.current = dots.current.filter(d => d.life < d.max)
      for (const d of dots.current) {
        d.angle += d.vA; d.radius += d.vR; d.life++
        const t = d.life / d.max
        const px = d.ox + Math.cos(d.angle) * d.radius
        const py = d.oy + Math.sin(d.angle) * d.radius
        ctx.beginPath()
        ctx.arc(px, py, Math.max(0.4, (1 - t * 0.55) * 2.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${d.r},${d.g},${d.b},${(1 - t) * 0.72})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', setup) }
  }, [])

  return { canvasRef, emit }
}

// ─────────────────────────────────────────────
// UI pieces
// ─────────────────────────────────────────────
type Tab = 'signin' | 'signup'

function Req({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          background: met ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${met ? 'rgba(16,185,129,0.5)' : 'rgba(86,187,240,0.12)'}`,
        }}
      >
        {met
          ? <Check size={8} className="text-emerald-400" />
          : <X size={8} style={{ color: 'rgba(198,235,255,0.2)' }} />}
      </span>
      <span
        className="font-outfit text-xs transition-colors duration-200"
        style={{ color: met ? 'rgba(52,211,153,0.9)' : 'rgba(198,235,255,0.38)' }}
      >
        {text}
      </span>
    </div>
  )
}

const PILLS = [
  { Icon: Clock, label: 'Real-time Updates' },
  { Icon: Shield, label: 'Secure & Private' },
  { Icon: Users, label: 'Community Driven' },
]

const Logo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="14" cy="14" r="12.5" stroke="#56BBF0" strokeWidth="1.5" />
    <circle cx="14" cy="14" r="3" fill="#56BBF0" />
    <circle cx="14" cy="5.5" r="2" fill="#90D4F7" />
    <circle cx="21.5" cy="18.5" r="2" fill="#90D4F7" />
    <circle cx="6.5" cy="18.5" r="2" fill="#90D4F7" />
    <line x1="14" y1="11" x2="14" y2="7.5" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="16.5" y1="15.5" x2="19.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="11.5" y1="15.5" x2="8.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

// ─────────────────────────────────────────────
// Main form
// ─────────────────────────────────────────────
function SignInForm() {
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isPending, startTransition] = useTransition()

  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const leftCanvasRef = useRepulseCanvas(mouseRef)
  const { canvasRef: rightCanvasRef, emit } = useSwirlCanvas()

  const { signIn, signUp, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'

  const pwReqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  const allMet = Object.values(pwReqs).every(Boolean)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    if (tab === 'signup' && !allMet) return
    setLoading(true); setError(null)
    startTransition(async () => {
      try {
        tab === 'signup' ? await signUp(email, password) : await signIn(email, password)
        try { sessionStorage.setItem('cc-just-signed-in', '1') } catch { /* ignore */ }
        setShowWelcome(true)
      } catch (err: any) {
        setError(err.message || (tab === 'signup' ? 'Sign up failed' : 'Login failed'))
      } finally {
        setLoading(false)
      }
    })
  }

  const isDisabled = loading || isPending || authLoading
  const switchTab = (t: Tab) => { setTab(t); setError(null) }


  const inputStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: 'white',
    border: '1px solid rgba(86,187,240,0.18)',
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(2,39,71,0.58)',
    border: '1px solid rgba(86,187,240,0.16)',
    backdropFilter: 'blur(22px)',
  }

  return (
    <>
      <WelcomeAnimation show={showWelcome} email={email} onComplete={() => router.push(redirect)} />

      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-outfit text-sm transition-all"
        style={{
          color: 'rgba(198,235,255,0.65)',
          background: 'rgba(86,187,240,0.08)',
          border: '1px solid rgba(86,187,240,0.15)',
        }}
      >
        ← Back to Home
      </Link>

      <div
        className="min-h-screen flex overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #010f1f 0%, #022040 100%)' }}
      >
        {/* ═══ LEFT PANEL — repulsion field ═══ */}
        <div
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-14 xl:px-20 py-16 relative"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
          }}
          onMouseLeave={() => { mouseRef.current = null }}
        >
          <canvas ref={leftCanvasRef} className="absolute inset-0 pointer-events-none" />

          <motion.div
            className="relative z-10 max-w-md"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Heading */}
            <h1 className="font-syne text-5xl xl:text-[3.75rem] font-black text-white mb-4 leading-none">
              Community<br />
              <span className="text-sky-400">Connect</span>
            </h1>
            <p className="font-outfit text-sm leading-relaxed mb-8" style={{ color: 'rgba(198,235,255,0.55)' }}>
              Sign in to submit local resources, connect with volunteers, and make a difference in the Bothell community.
            </p>

            {/* Stats bar */}
            <div
              className="inline-flex gap-6 px-5 py-3 rounded-2xl mb-8"
              style={{ background: 'rgba(86,187,240,0.06)', border: '1px solid rgba(86,187,240,0.1)' }}
            >
              {[['150+', 'Volunteers'], ['30+', 'Resources'], ['6', 'Active causes']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="font-syne text-xl font-black text-sky-300">{val}</p>
                  <p className="font-outfit text-[10px] uppercase tracking-wider" style={{ color: 'rgba(198,235,255,0.38)' }}>{lbl}</p>
                </div>
              ))}
            </div>

            {/* Judge box */}
            <motion.div
              className="rounded-2xl p-5 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              style={cardStyle}
              onClick={() => { setEmail(JUDGE_EMAIL); setPassword(JUDGE_PASSWORD); setError(null); setTab('signin') }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="font-syne text-[10px] font-black uppercase tracking-[0.18em] mb-2.5" style={{ color: '#90D4F7' }}>
                For TSA Judges
              </p>
              <p className="font-outfit text-xs mb-3" style={{ color: 'rgba(198,235,255,0.55)' }}>
                Click to auto-fill test credentials:
              </p>
              <p className="font-outfit text-xs mb-0.5">
                <span style={{ color: 'rgba(198,235,255,0.4)' }}>Email: </span>
                <span style={{ color: '#56BBF0' }}>{JUDGE_EMAIL}</span>
              </p>
              <p className="font-outfit text-xs mb-3">
                <span style={{ color: 'rgba(198,235,255,0.4)' }}>Password: </span>
                <span style={{ color: '#56BBF0' }}>{JUDGE_PASSWORD}</span>
              </p>
              <p className="font-outfit text-[10px]" style={{ color: 'rgba(198,235,255,0.28)' }}>
                Or use Sign Up to create your own account.
              </p>
            </motion.div>

            {/* Feature pills */}
            <div className="flex flex-col gap-2.5 mt-5">
              {PILLS.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full w-fit"
                  style={{ background: 'rgba(86,187,240,0.07)', border: '1px solid rgba(86,187,240,0.16)' }}
                >
                  <Icon size={13} style={{ color: '#56BBF0' }} />
                  <span className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.8)' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ RIGHT PANEL — swirl emitter + form ═══ */}
        <div
          className="flex-1 lg:w-1/2 relative flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-12"
          style={{
            background: 'linear-gradient(155deg, rgba(3,52,96,0.45) 0%, rgba(1,15,31,0.75) 100%)',
            borderLeft: '1px solid rgba(86,187,240,0.08)',
          }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            emit(e.clientX - r.left, e.clientY - r.top)
          }}
        >
          <canvas ref={rightCanvasRef} className="absolute inset-0 pointer-events-none" />

          <motion.div
            className="relative z-10 w-full max-w-sm mx-auto"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Mobile header */}
            <div className="lg:hidden mb-8">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <Logo size={24} />
                <span className="font-syne text-sm font-light text-white">Community<strong className="font-black">Connect</strong></span>
              </Link>
              <h2 className="font-syne text-2xl font-bold text-white">Sign in to continue</h2>
            </div>

            {/* Form card */}
            <div className="rounded-3xl p-6 sm:p-7 space-y-5" style={cardStyle}>

              {/* Tabs */}
              <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {(['signin', 'signup'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => switchTab(t)}
                    className="relative flex-1 py-2 rounded-lg font-outfit text-sm font-semibold transition-colors"
                    style={{ color: tab === t ? 'white' : 'rgba(198,235,255,0.38)' }}
                  >
                    {tab === t && (
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(36,153,214,0.3)', border: '1px solid rgba(86,187,240,0.26)' }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <span className="relative z-10">{t === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                  </button>
                ))}
              </div>

              {/* Email */}
              <div>
                <label className="block font-outfit text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'rgba(198,235,255,0.45)' }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" disabled={isDisabled}
                  className="w-full px-4 py-3 rounded-xl font-outfit text-sm outline-none transition-all disabled:opacity-50 focus:ring-1 focus:ring-sky-400/35"
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-outfit text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'rgba(198,235,255,0.45)' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={tab === 'signup' ? 'Create a strong password' : 'Your password'}
                    disabled={isDisabled}
                    className="w-full px-4 py-3 pr-11 rounded-xl font-outfit text-sm outline-none transition-all disabled:opacity-50 focus:ring-1 focus:ring-sky-400/35"
                    style={inputStyle}
                  />
                  <button
                    type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-45 hover:opacity-75 transition-opacity"
                    style={{ color: 'rgba(198,235,255,0.6)' }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <AnimatePresence>
                  {tab === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-1.5 px-0.5">
                        <Req met={pwReqs.length} text="At least 8 characters" />
                        <Req met={pwReqs.upper} text="One uppercase letter" />
                        <Req met={pwReqs.number} text="One number" />
                        <Req met={pwReqs.special} text="One special character" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA */}
              <button
                onClick={handleAuth}
                disabled={isDisabled || (tab === 'signup' && !allMet)}
                className="w-full py-3 rounded-xl font-outfit font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #0857A0 0%, #2499D6 100%)' }}
              >
                {isPending || loading ? 'Please wait…' : authLoading ? 'Loading…' : tab === 'signup' ? 'Create Account' : 'Sign In'}
              </button>

              {/* Toggle hint */}
              <p className="text-center font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.35)' }}>
                {tab === 'signin' ? (
                  <>No account?{' '}<button onClick={() => switchTab('signup')} className="text-sky-400 hover:text-sky-300 transition-colors font-semibold">Sign up free</button></>
                ) : (
                  <>Have an account?{' '}<button onClick={() => switchTab('signin')} className="text-sky-400 hover:text-sky-300 transition-colors font-semibold">Sign in</button></>
                )}
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-4 p-4 rounded-xl flex items-start gap-2"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#FECACA' }}
                >
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span className="font-outfit text-xs leading-relaxed">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.2)' }}>
              <Link href="/" className="hover:text-white transition-colors">← Back to home</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
