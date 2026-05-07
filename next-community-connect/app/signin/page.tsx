'use client'

import { useState, Suspense, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Sparkles, ShieldCheck, HeartHandshake, CalendarDays, Check, X } from 'lucide-react'
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

const STATIC_DOTS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: 4 + ((i * 17) % 93),
  y: 6 + ((i * 29) % 88),
  size: 2 + (i % 3),
  opacity: 0.1 + (i % 4) * 0.04,
}))

function StaticDots() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {STATIC_DOTS.map((dot) => (
        <span
          key={dot.id}
          className="absolute rounded-full bg-sky-100"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  )
}

type Tab = 'signin' | 'signup'

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          background: met ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${met ? 'rgba(16,185,129,0.5)' : 'rgba(86,187,240,0.15)'}`,
        }}
      >
        {met ? (
          <Check size={9} className="text-emerald-400" />
        ) : (
          <X size={9} style={{ color: 'rgba(198,235,255,0.25)' }} />
        )}
      </div>
      <span
        className="font-outfit text-xs transition-colors duration-200"
        style={{ color: met ? 'rgba(52,211,153,0.9)' : 'rgba(198,235,255,0.4)' }}
      >
        {text}
      </span>
    </div>
  )
}

function SignInForm() {
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const { signIn, signUp, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'

  // Password requirements
  const pwReqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  const allReqsMet = Object.values(pwReqs).every(Boolean)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    if (tab === 'signup' && !allReqsMet) return

    setLoading(true)
    setError(null)

    startTransition(async () => {
      try {
        if (tab === 'signup') {
          await signUp(email, password)
        } else {
          await signIn(email, password)
        }
        router.push(redirect)
      } catch (err: any) {
        setError(err.message || (tab === 'signup' ? 'Sign up failed' : 'Login failed'))
      } finally {
        setLoading(false)
      }
    })
  }

  const handleJudgeAutoFill = () => {
    setEmail(JUDGE_EMAIL)
    setPassword(JUDGE_PASSWORD)
    setError(null)
    setTab('signin')
  }

  const inputClass =
    'w-full px-4 py-3.5 rounded-lg font-outfit text-sm outline-none transition-all'
  const isDisabled = loading || isPending || authLoading

  const switchTab = (t: Tab) => {
    setTab(t)
    setError(null)
  }

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden kinetic-gradient"
      style={{ background: 'linear-gradient(145deg, #011629 0%, #044069 48%, #0D7BB5 110%)' }}
    >
      <StaticDots />

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
            <circle cx="14" cy="14" r="12.5" stroke="#56BBF0" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="3" fill="#56BBF0" />
            <circle cx="14" cy="5.5" r="2" fill="#90D4F7" />
            <circle cx="21.5" cy="18.5" r="2" fill="#90D4F7" />
            <circle cx="6.5" cy="18.5" r="2" fill="#90D4F7" />
            <line x1="14" y1="11" x2="14" y2="7.5" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="16.5" y1="15.5" x2="19.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="11.5" y1="15.5" x2="8.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
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
            <span className="font-space text-xs uppercase tracking-[0.14em] text-white/85">
              Access hub
            </span>
          </span>
        </motion.div>

        <motion.h1
          className="font-syne text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.72, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          Community<br />Connect
        </motion.h1>

        <motion.p
          className="font-outfit text-sm leading-relaxed mb-6 max-w-md"
          style={{ color: 'rgba(198,235,255,0.72)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          Sign in to submit resources, make donations to local causes, and fully explore the platform built for Bothell residents.
        </motion.p>

        {/* Community stats */}
        <motion.div
          className="flex flex-wrap gap-4 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
        >
          {[
            { val: '150+', label: 'Volunteers' },
            { val: '30+', label: 'Resources' },
            { val: '6', label: 'Active causes' },
          ].map(({ val, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="font-syne text-lg font-black text-sky-300">{val}</span>
              <span className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.45)' }}>{label}</span>
            </div>
          ))}
        </motion.div>

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
            <p
              className="font-syne text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: '#90D4F7' }}
            >
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
                Judges are also welcome to create their own accounts using Sign Up to experience the full workflow.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right column — form */}
      <motion.div
        className="w-full lg:max-w-[420px] flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16 relative z-10"
        style={{ borderLeft: '1px solid rgba(86,187,240,0.15)' }}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="liquid-glass rounded-[28px] p-6 sm:p-7">
          <div className="liquid-content space-y-5">

            {/* Tab switcher */}
            <div
              className="flex rounded-xl p-1 gap-1"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              {(['signin', 'signup'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className="relative flex-1 py-2 rounded-lg font-outfit text-sm font-semibold transition-colors duration-150"
                  style={{ color: tab === t ? 'white' : 'rgba(198,235,255,0.45)' }}
                >
                  {tab === t && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(36,153,214,0.35)', border: '1px solid rgba(86,187,240,0.3)' }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative z-10">
                    {t === 'signin' ? 'Sign In' : 'Sign Up'}
                  </span>
                </button>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="block font-outfit text-sm mb-2" style={{ color: 'rgba(198,235,255,0.7)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isDisabled}
                className={inputClass}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(86,187,240,0.28)',
                  opacity: isDisabled ? 0.6 : 1,
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-outfit text-sm mb-2" style={{ color: 'rgba(198,235,255,0.7)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Create a strong password' : 'Enter your password'}
                  disabled={isDisabled}
                  className={`${inputClass} pr-11`}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(86,187,240,0.28)',
                    opacity: isDisabled ? 0.6 : 1,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isDisabled}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity opacity-50 hover:opacity-80 disabled:opacity-30"
                  style={{ color: 'rgba(198,235,255,0.6)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password requirements (sign up only) */}
              <AnimatePresence>
                {tab === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-1.5 px-1">
                      <PasswordRequirement met={pwReqs.length} text="At least 8 characters" />
                      <PasswordRequirement met={pwReqs.upper} text="One uppercase letter" />
                      <PasswordRequirement met={pwReqs.number} text="One number" />
                      <PasswordRequirement met={pwReqs.special} text="One special character" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA button */}
            <button
              onClick={handleAuth}
              disabled={isDisabled || (tab === 'signup' && !allReqsMet)}
              className="w-full py-3.5 rounded-xl font-outfit font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)',
                color: 'white',
              }}
            >
              {isPending || (loading && !isPending)
                ? 'Please wait…'
                : authLoading
                  ? 'Loading…'
                  : tab === 'signup'
                    ? 'Create Account'
                    : 'Sign In'}
            </button>

            {/* Tab toggle hint */}
            <p className="font-outfit text-xs text-center" style={{ color: 'rgba(198,235,255,0.4)' }}>
              {tab === 'signin' ? (
                <>
                  No account?{' '}
                  <button
                    onClick={() => switchTab('signup')}
                    className="text-sky-400 hover:text-sky-300 transition-colors font-semibold"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => switchTab('signin')}
                    className="text-sky-400 hover:text-sky-300 transition-colors font-semibold"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 p-4 rounded-xl border"
              style={{
                borderColor: 'rgba(239,68,68,0.3)',
                backgroundColor: 'rgba(239,68,68,0.1)',
                color: '#FECACA',
              }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span className="font-outfit text-sm leading-relaxed">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 font-outfit text-xs text-center" style={{ color: 'rgba(198,235,255,0.25)' }}>
          <Link href="/" className="hover:text-white transition-colors">
            Back to home
          </Link>
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
