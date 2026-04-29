'use client'

import { useMemo, useState, Suspense, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Sparkles, ShieldCheck, HeartHandshake, CalendarDays } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const JUDGE_EMAIL = 'judges@tsa.com'
const JUDGE_PASSWORD = 'judges!'
const previewCards = [
  { icon: HeartHandshake, label: 'Submit local resources', value: 'Reviewed fast' },
  { icon: CalendarDays, label: 'Save community events', value: 'Always current' },
  { icon: ShieldCheck, label: 'Judge demo ready', value: 'One-click access' },
]

function RepellingDots({ mouse }: { mouse: { x: number; y: number } | null }) {
  const dots = useMemo(
    () => Array.from({ length: 86 }, (_, i) => ({
      id: i,
      x: 4 + ((i * 17) % 93),
      y: 6 + ((i * 29) % 88),
      size: 2 + (i % 3),
      opacity: 0.18 + (i % 5) * 0.035,
    })),
    []
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {dots.map(dot => {
        const dx = mouse ? dot.x - mouse.x : 0
        const dy = mouse ? dot.y - mouse.y : 0
        const distance = Math.sqrt(dx * dx + dy * dy)
        const force = mouse ? Math.max(0, 15 - distance) / 15 : 0
        const offsetX = force ? (dx / Math.max(distance, 1)) * force * 42 : 0
        const offsetY = force ? (dy / Math.max(distance, 1)) * force * 42 : 0

        return (
          <span
            key={dot.id}
            className="absolute rounded-full bg-sky-100 transition-transform duration-200 ease-out"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${1 + force * 1.8})`,
              boxShadow: force ? '0 0 18px rgba(198,235,255,0.75)' : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null)

  const { signIn, signUp, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setLoading(true)
    setError(null)
    
    startTransition(async () => {
      try {
        await signIn(email, password)
        router.push(redirect)
      } catch (err: any) {
        setError(err.message || 'Login failed')
        console.error('Login error:', err)
      } finally {
        setLoading(false)
      }
    })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setLoading(true)
    setError(null)
    
    startTransition(async () => {
      try {
        await signUp(email, password)
        router.push(redirect)
      } catch (err: any) {
        setError(err.message || 'Sign up failed')
        console.error('Sign up error:', err)
      } finally {
        setLoading(false)
      }
    })
  }

  const handleJudgeAutoFill = () => {
    setEmail(JUDGE_EMAIL)
    setPassword(JUDGE_PASSWORD)
    setError(null)
  }

  const inputClass = "w-full px-4 py-3.5 rounded-lg font-outfit text-sm outline-none transition-all"

  const isDisabled = loading || isPending || authLoading

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden kinetic-gradient"
      style={{ background: 'linear-gradient(145deg, #011629 0%, #044069 48%, #0D7BB5 110%)' }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setMouse({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        })
      }}
      onMouseLeave={() => setMouse(null)}
    >
      <RepellingDots mouse={mouse} />
      <motion.div
        aria-hidden="true"
        className="absolute left-[-10%] top-[12%] h-24 w-[55%] rounded-full border border-white/10 bg-white/5"
        animate={{ x: [0, 32, 0], rotate: [-8, -4, -8] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[-16%] bottom-[18%] h-24 w-[50%] rounded-full border border-sky-100/10 bg-sky-100/5"
        animate={{ x: [0, -28, 0], rotate: [8, 4, 8] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Left column */}
      <motion.div
        className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 relative z-10"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-16 w-fit">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="14" cy="14" r="12.5" stroke="#56BBF0" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#56BBF0"/>
            <circle cx="14" cy="5.5" r="2" fill="#90D4F7"/>
            <circle cx="21.5" cy="18.5" r="2" fill="#90D4F7"/>
            <circle cx="6.5" cy="18.5" r="2" fill="#90D4F7"/>
            <line x1="14" y1="11" x2="14" y2="7.5" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="16.5" y1="15.5" x2="19.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="11.5" y1="15.5" x2="8.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className="font-syne text-base font-light text-white">
            Community<strong className="font-bold">Connect</strong>
          </span>
        </Link>

        <motion.div
          className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2 mb-6 w-fit"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <span className="liquid-content inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span className="font-space text-xs uppercase tracking-[0.14em] text-white/85">Access hub</span>
          </span>
        </motion.div>

        <motion.h1
          className="font-syne text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.72, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          Community Connect
        </motion.h1>
        <motion.p
          className="font-outfit text-base leading-relaxed mb-10 max-w-md"
          style={{ color: 'rgba(198,235,255,0.76)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          Sign in to submit resources, make donations to local causes, and fully explore the platform built for Bothell residents.
        </motion.p>

        <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mb-8">
          {previewCards.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              className="liquid-glass rounded-2xl p-4 glass-float"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.36 + i * 0.08, duration: 0.5 }}
              style={{ animationDelay: `${i * 0.45}s` }}
            >
              <div className="liquid-content">
                <div className="w-9 h-9 rounded-xl bg-white/14 border border-white/15 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-sky-100" />
                </div>
                <p className="font-outfit text-xs text-sky-100/60">{label}</p>
                <p className="font-space text-sm font-bold text-white">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Judge credentials box */}
        <motion.div
          className="liquid-glass rounded-2xl p-6 max-w-md cursor-pointer"
          onClick={handleJudgeAutoFill}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58 }}
        >
          <div className="liquid-content">
          <p className="font-syne text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#90D4F7' }}>
            For TSA Judges
          </p>
          <p className="font-outfit text-sm mb-4" style={{ color: 'rgba(198,235,255,0.7)' }}>
            Please use the following test account (click box to auto-fill):
          </p>
          <p className="font-outfit text-sm mb-1">
            <span style={{ color: 'rgba(198,235,255,0.55)' }}>Email: </span>
            <span style={{ color: '#56BBF0' }}>{JUDGE_EMAIL}</span>
          </p>
          <p className="font-outfit text-sm mb-4">
            <span style={{ color: 'rgba(198,235,255,0.55)' }}>Password: </span>
            <span style={{ color: '#56BBF0' }}>{JUDGE_PASSWORD}</span>
          </p>
          <div className="border-t pt-4" style={{ borderColor: 'rgba(86,187,240,0.25)' }}>
            <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.4)' }}>
              Judges are also welcome to create their own accounts using the Sign Up button to experience the full workflow.
            </p>
          </div>
          </div>
        </motion.div>

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 rounded-xl border" style={{ 
            borderColor: 'rgba(239,68,68,0.3)', 
            backgroundColor: 'rgba(239,68,68,0.1)',
            color: '#FECACA'
          }}>
            <div className="flex items-start gap-2">
              <AlertCircle size={16} />
              <span className="font-outfit text-sm leading-relaxed">{error}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Right column */}
      <motion.div
        className="w-full lg:max-w-md flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16 relative z-10"
        style={{ borderLeft: '1px solid rgba(86,187,240,0.2)' }}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="liquid-glass rounded-[28px] p-6 sm:p-7">
        <div className="liquid-content space-y-5">
          <div>
            <label className="block font-outfit text-sm mb-2" style={{ color: 'rgba(198,235,255,0.7)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isDisabled}
              className={inputClass}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.12)', 
                color: 'white', 
                border: '1px solid rgba(86,187,240,0.3)',
                opacity: isDisabled ? 0.6 : 1
              }}
            />
          </div>

          <div>
            <label className="block font-outfit text-sm mb-2" style={{ color: 'rgba(198,235,255,0.7)' }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isDisabled}
                className={`${inputClass} pr-11`}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.12)', 
                  color: 'white', 
                  border: '1px solid rgba(86,187,240,0.3)',
                  opacity: isDisabled ? 0.6 : 1
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                disabled={isDisabled}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors opacity-50 disabled:opacity-30"
                style={{ color: 'rgba(198,235,255,0.6)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSignUp}
              disabled={isDisabled}
              className="flex-1 py-3.5 rounded-xl font-outfit font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)', color: 'white' }}
            >
              {isPending ? '...' : authLoading ? 'Loading...' : 'Sign Up'}
            </button>
            <button
              onClick={handleLogin}
              disabled={isDisabled}
              className="flex-1 py-3.5 rounded-xl font-outfit font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(86,187,240,0.35)' }}
            >
              {isPending ? '...' : authLoading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </div>
        </div>

        <p className="mt-10 font-outfit text-xs text-center" style={{ color: 'rgba(198,235,255,0.3)' }}>
          <Link href="/" className="hover:text-white transition-colors">Back to home</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

