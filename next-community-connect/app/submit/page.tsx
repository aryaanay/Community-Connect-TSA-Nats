'use client'

import { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Mail, Phone, MapPin, Send, X, LogIn, Sparkles, ArrowRight, Bot, ShieldCheck, ShieldX, Loader2 } from 'lucide-react'
import { HeroDemo } from '@/components/ui/animated-hero-demo'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type FormData = {
  name: string
  organization: string
  email: string
  phone: string
  category: string
  website: string
  description: string
  address: string
  hours: string
}

const categories = [
  'Education', 'Health & Wellness', 'Career & Jobs', 'Volunteering',
  'Community Projects', 'Food & Nutrition', 'Housing & Shelter',
  'Legal Services', 'Mental Health', 'Youth Programs', 'Senior Services', 'Other',
]

const field = "w-full px-5 py-3 rounded-[var(--radius-md)] border-2 border-sky-200 bg-white font-outfit text-sm text-sky-900 placeholder:text-sky-300 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
const iconField = "w-full pl-12 pr-5 py-3 rounded-[var(--radius-md)] border-2 border-sky-200 bg-white font-outfit text-sm text-sky-900 placeholder:text-sky-300 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"

const EMPTY_FORM: FormData = {
  name: '', organization: '', email: '', phone: '',
  category: '', website: '', description: '', address: '', hours: '',
}

function getErrorMessage(err: unknown): string {
  if (!err) return 'Submission failed — please try again.'
  if (typeof err === 'string') return err
  if (typeof err === 'object') {
    const e = err as Record<string, unknown>
    if (typeof e.message === 'string' && e.message) return e.message
    if (typeof e.details === 'string' && e.details) return e.details
    if (typeof e.hint   === 'string' && e.hint)    return e.hint
    if (typeof e.code   === 'string' && e.code)    return `Database error (code: ${e.code})`
  }
  return 'Submission failed — please try again.'
}

async function saveToSubmissions(data: FormData) {
  const { error } = await supabase
    .from('submissions')
    .insert({
      resource_name: data.name,
      category:      data.category,
      description:   data.description,
      contact_email: data.email,
      phone:         data.phone   || null,
      address:       data.address || null,
      hours:         data.hours   || null,
      website:       data.website || null,
      status:        'pending',
    })
  if (error) throw error
}

async function addToResources(data: FormData) {
  const { error } = await supabase
    .from('resources')
    .insert({
      name:        data.name,
      category:    data.category,
      description: data.description,
      email:       data.email    || null,
      phone:       data.phone    || null,
      address:     data.address  || null,
      hours:       data.hours    || null,
      website_url: data.website  || null,
      image_url:   null,
      is_verified: true,
      is_featured: false,
    })
  if (error) console.warn('Resources insert failed:', error)
}

// ─── AI Review Modal ──────────────────────────────────────────────────────────

type ReviewState = 'submitting' | 'reviewing' | 'approved' | 'rejected'

const AI_CHECK_ITEMS = [
  'Analyzing content quality',
  'Checking community relevance',
  'Verifying category accuracy',
  'Reviewing submission guidelines',
  'Generating AI decision',
]

function AIReviewModal({
  state,
  reason,
  onClose,
}: {
  state: ReviewState
  reason: string
  onClose: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(-1)

  const isTerminal = state === 'approved' || state === 'rejected'
  const isApproved = state === 'approved'

  // Drive animated progress + step checklist while reviewing
  useEffect(() => {
    if (state !== 'reviewing') return
    setProgress(0)
    setCompletedSteps([])
    setCurrentStep(0)

    const TOTAL = 3600
    const stepMs = TOTAL / AI_CHECK_ITEMS.length
    const t0 = Date.now()

    const progressInterval = setInterval(() => {
      const p = Math.min(88, ((Date.now() - t0) / TOTAL) * 88)
      setProgress(p)
      if (p >= 88) clearInterval(progressInterval)
    }, 40)

    const stepTimers = AI_CHECK_ITEMS.map((_, i) =>
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i])
        setCurrentStep(i + 1 < AI_CHECK_ITEMS.length ? i + 1 : i)
      }, stepMs * (i + 1))
    )

    return () => {
      clearInterval(progressInterval)
      stepTimers.forEach(clearTimeout)
    }
  }, [state])

  // Snap to 100% and complete all steps on result
  useEffect(() => {
    if (!isTerminal) return
    setProgress(100)
    setCompletedSteps(AI_CHECK_ITEMS.map((_, i) => i))
    setCurrentStep(-1)
  }, [isTerminal])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(1,22,41,0.85)', backdropFilter: 'blur(24px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #022747 0%, #033460 100%)',
          border: '1px solid rgba(86,187,240,0.22)',
          boxShadow: '0 40px 100px rgba(1,22,41,0.6)',
        }}
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-sky-400/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(86,187,240,0.1)', border: '1px solid rgba(86,187,240,0.18)' }}>
              <Bot size={20} className="text-sky-400" />
            </div>
            <div>
              <p className="font-outfit text-[10px] text-sky-400/50 uppercase tracking-widest">AI Moderation System</p>
              <h3 className="font-syne text-base font-bold text-white leading-tight">
                {state === 'submitting' ? 'Saving Submission…'
                  : state === 'reviewing' ? 'AI is Reviewing Your Resource'
                  : isApproved ? 'Resource Approved!'
                  : 'Not Approved'}
              </h3>
            </div>
          </div>
        </div>

        {/* Progress bar — shown during review and on result */}
        {(state === 'reviewing' || isTerminal) && (
          <div className="px-7 pt-5 pb-1">
            <div className="flex justify-between mb-1.5">
              <span className="font-outfit text-[10px] text-sky-400/50 uppercase tracking-wider">Review Progress</span>
              <span className="font-outfit text-[10px] font-semibold" style={{ color: isTerminal ? (isApproved ? '#34D399' : '#F87171') : '#56BBF0' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(86,187,240,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: isTerminal
                    ? isApproved ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #EF4444, #F87171)'
                    : 'linear-gradient(90deg, #0EA5E9, #38BDF8)',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: 'linear' }}
              />
            </div>
          </div>
        )}

        {/* Submitting spinner */}
        {state === 'submitting' && (
          <div className="px-7 py-6 flex items-center gap-3">
            <Loader2 size={15} className="text-sky-400 animate-spin flex-shrink-0" />
            <span className="font-outfit text-sm text-sky-200/70">Saving your submission to our database…</span>
          </div>
        )}

        {/* Animated check items */}
        {(state === 'reviewing' || isTerminal) && (
          <div className="px-7 py-5 space-y-2">
            {AI_CHECK_ITEMS.map((label, i) => {
              const isDone = completedSteps.includes(i)
              const isActive = currentStep === i && !isTerminal
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2.5"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isDone ? 'rgba(16,185,129,0.12)' : isActive ? 'rgba(86,187,240,0.12)' : 'rgba(255,255,255,0.03)',
                      border: isDone ? '1px solid rgba(16,185,129,0.35)' : isActive ? '1px solid rgba(86,187,240,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {isDone
                      ? <CheckCircle size={11} className="text-emerald-400" />
                      : isActive
                        ? <Loader2 size={10} className="text-sky-400 animate-spin" />
                        : <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
                    }
                  </div>
                  <span
                    className="font-outfit text-xs transition-all duration-300"
                    style={{
                      color: isDone ? 'rgba(167,243,208,0.85)' : isActive ? '#C6EBFF' : 'rgba(198,235,255,0.25)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {label}{isActive && <span className="opacity-50"> …</span>}
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Result panel */}
        <AnimatePresence>
          {isTerminal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="px-7 pb-7"
            >
              <div
                className="rounded-2xl p-4 mb-4 mt-1"
                style={{
                  background: isApproved ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)',
                  border: isApproved ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                }}
              >
                <div className="flex items-start gap-2.5">
                  {isApproved
                    ? <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    : <ShieldX size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  }
                  <p className="font-outfit text-xs leading-relaxed"
                    style={{ color: isApproved ? 'rgba(167,243,208,0.9)' : 'rgba(252,165,165,0.9)' }}>
                    {reason}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl font-outfit font-semibold text-sm transition-all"
                style={{
                  background: isApproved
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.7), rgba(56,189,248,0.65))'
                    : 'rgba(255,255,255,0.06)',
                  color: 'white',
                  border: isApproved ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {isApproved ? 'View Directory →' : 'Close & Edit Submission'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function PlaneSuccess() {
  const confetti = Array.from({ length: 18 }, (_, i) => ({
    left: `${12 + (i * 43) % 76}%`,
    delay: i * 0.06,
    color: ['#56BBF0', '#90D4F7', '#FF8C42', '#10B981'][i % 4],
  }))

  return (
    <div className="min-h-screen flex items-center justify-center kinetic-gradient px-4 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #011629 0%, #044069 46%, #0D7BB5 100%)' }}>
      <motion.div
        aria-hidden="true"
        className="absolute left-[-10%] top-[18%] h-24 w-[58%] rounded-full border border-white/10 bg-white/5"
        animate={{ x: [0, 34, 0], rotate: [-8, -3, -8] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[-14%] bottom-[20%] h-24 w-[48%] rounded-full border border-sky-100/10 bg-sky-100/5"
        animate={{ x: [0, -28, 0], rotate: [8, 4, 8] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      {confetti.map((piece, i) => (
        <motion.span
          key={i}
          className="absolute top-[18%] h-3 w-1.5 rounded-sm"
          style={{ left: piece.left, backgroundColor: piece.color }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{ y: [0, 180, 320], opacity: [0, 1, 0], rotate: [0, 140, 260] }}
          transition={{ duration: 2.4, delay: 0.9 + piece.delay, ease: 'easeOut' }}
        />
      ))}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-xl w-full relative z-10">
        <div className="relative h-48 mb-2">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 190" preserveAspectRatio="none">
            <motion.path
              d="M 10 155 C 120 118, 155 130, 238 82 S 392 34, 510 26"
              stroke="rgba(198,235,255,0.72)" strokeWidth="3" strokeDasharray="12 10"
              fill="none" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0.5] }}
              transition={{ duration: 1.7, ease: "easeOut" }}
            />
            <motion.path
              d="M 16 166 C 136 130, 164 144, 246 98 S 392 56, 506 44"
              stroke="rgba(86,187,240,0.34)" strokeWidth="2" strokeDasharray="7 12"
              fill="none" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.5, 0.5, 0.1] }}
              transition={{ duration: 1.9, ease: "easeOut", delay: 0.12 }}
            />
          </svg>
          <motion.div
            className="absolute"
            initial={{ left: '0%', top: '76%', opacity: 0, scale: 0.75 }}
            animate={{ left: '88%', top: '4%', opacity: [0, 1, 1], scale: [0.75, 1.05, 1] }}
            transition={{ duration: 1.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute' }}
          >
            <motion.div animate={{ rotate: [-18, -25, -18] }} transition={{ duration: 0.38, repeat: 4, repeatType: 'mirror' }} className="liquid-glass rounded-2xl p-3">
              <span className="liquid-content block">
                <Send className="w-8 h-8 text-sky-100" />
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-glass rounded-[32px] p-8 sm:p-10"
        >
          <div className="liquid-content">
          <motion.div
            initial={{ scale: 0, rotate: -14 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.72, type: 'spring', stiffness: 220, damping: 13 }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(86,187,240,0.95))', boxShadow: '0 20px 60px rgba(16,185,129,0.35)' }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)' }}
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span className="font-space text-xs uppercase tracking-[0.14em] text-sky-100/80">AI Approved</span>
          </motion.div>

          <h1 className="font-syne text-3xl sm:text-4xl font-bold text-white mb-3">Resource Added!</h1>
          <p className="font-dm-sans text-base mb-5" style={{ color: 'rgba(198,235,255,0.75)' }}>
            Your resource was reviewed and approved by our AI moderator and is now live in the community directory.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="px-6 py-3 rounded-xl font-outfit font-semibold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#022747' }}>
              Return Home
            </Link>
            <Link href="/resources" className="px-6 py-3 rounded-xl font-outfit font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
              <span className="inline-flex items-center gap-2">Browse Resources <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Sign-in Modal ────────────────────────────────────────────────────────────

function SignInModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(1,22,41,0.75)', backdropFilter: 'blur(16px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm rounded-3xl p-8 text-center"
          style={{ backgroundColor: '#033460', border: '1px solid rgba(86,187,240,0.35)', boxShadow: '0 40px 80px rgba(1,22,41,0.5)' }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ color: 'rgba(198,235,255,0.5)' }}>
            <X size={16} />
          </button>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)' }}>
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-syne text-2xl font-bold text-white mb-3">Sign in to submit</h2>
          <p className="font-outfit text-sm mb-7 leading-relaxed" style={{ color: 'rgba(198,235,255,0.7)' }}>
            You need to be signed in to submit a resource. It only takes a moment.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/signin?redirect=/submit"
              className="w-full py-3.5 rounded-xl font-outfit font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)' }}>
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
            <Link href="/signin?redirect=/submit"
              className="w-full py-3.5 rounded-xl font-outfit font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(198,235,255,0.85)', border: '1px solid rgba(86,187,240,0.3)' }}>
              Create Account
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubmitPage() {
  const { isSignedIn, user } = useAuth()
  const { unlock, markPageVisited } = useAchievements()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isPending, startTransition] = useTransition()

  const [reviewState, setReviewState] = useState<ReviewState | null>(null)
  const [reviewReason, setReviewReason] = useState('')

  const busy = isLoading || isPending

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn || !user?.id) { setShowAuthModal(true); return }

    setIsLoading(true)
    setSubmitError('')
    setReviewState('submitting')

    startTransition(async () => {
      try {
        // Step 1: Save submission record
        await saveToSubmissions(formData)

        // Step 2: Call AI review
        setReviewState('reviewing')
        const res = await fetch('/api/review-resource', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            description: formData.description,
            email: formData.email,
            address: formData.address,
          }),
        })
        const review = await res.json() as { approved: boolean; reason: string }

        // Step 3: Act on result
        unlock('submit_resource')
        markPageVisited('submit')
        if (review.approved) {
          await addToResources(formData)
          setReviewState('approved')
          setReviewReason(review.reason)
          unlock('ai_approved')
        } else {
          setReviewState('rejected')
          setReviewReason(review.reason)
        }
      } catch (err: unknown) {
        setReviewState(null)
        setSubmitError(getErrorMessage(err))
        console.error('Submit error:', err)
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleReviewClose = () => {
    if (reviewState === 'approved') {
      setFormData(EMPTY_FORM)
      setIsSubmitted(true)
    }
    setReviewState(null)
    setReviewReason('')
  }

  if (isSubmitted) return <PlaneSuccess />

  return (
    <>
      {showAuthModal && <SignInModal onClose={() => setShowAuthModal(false)} />}

      <AnimatePresence>
        {reviewState && (
          <AIReviewModal
            state={reviewState}
            reason={reviewReason}
            onClose={handleReviewClose}
          />
        )}
      </AnimatePresence>

      <HeroDemo
        badge="Community Driven"
        staticTitle="Submit a Resource"
        subtitle="Know of a program that helped you or someone you know? Share it with our community so others can benefit too."
        backgroundImage="/img/page-6.jpg"
      />

      <div className="relative z-10">
      <section className="py-24 bg-[var(--section-bg)]">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[var(--radius-lg)] border border-sky-100 shadow-card p-8 md:p-10"
          >
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-[var(--radius-md)] flex items-start gap-3 border border-red-200 bg-red-50 overflow-hidden"
                >
                  <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="font-outfit text-sm text-red-800">{submitError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-sky-50 border border-sky-200 rounded-[var(--radius-md)] p-4 mb-8 flex items-start gap-3">
              <Bot className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
              <div className="font-outfit text-sm text-sky-800">
                <strong className="text-sky-900">AI-powered moderation</strong> — your submission is instantly reviewed by our AI to ensure it meets community guidelines. Approved resources are added to the directory immediately.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label htmlFor="name" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">
                  Resource Name <span className="text-red-500">*</span>
                </label>
                <input type="text" id="name" name="name" required
                  value={formData.name} onChange={handleChange}
                  placeholder="e.g., Bothell Food Bank"
                  className={field} disabled={busy} />
              </div>

              <div>
                <label htmlFor="organization" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">
                  Organization / Provider Name
                </label>
                <input type="text" id="organization" name="organization"
                  value={formData.organization} onChange={handleChange}
                  placeholder="e.g., Bothell Community Services"
                  className={field} disabled={busy} />
              </div>

              <div>
                <label htmlFor="category" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select id="category" name="category" required
                  value={formData.category} onChange={handleChange}
                  className={field} disabled={busy}>
                  <option value="">Select a category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea id="description" name="description" required rows={4}
                  value={formData.description} onChange={handleChange}
                  placeholder="Describe the resource, who it's for, and what services it provides..."
                  className={`${field} resize-none`} disabled={busy} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                    <input type="email" id="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      placeholder="contact@organization.org"
                      className={iconField} disabled={busy} />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                    <input type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      placeholder="(123) 456-7890"
                      className={iconField} disabled={busy} />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                  <input type="text" id="address" name="address"
                    value={formData.address} onChange={handleChange}
                    placeholder="123 Main St, Bothell, WA 98011"
                    className={iconField} disabled={busy} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="hours" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">Hours of Operation</label>
                  <input type="text" id="hours" name="hours"
                    value={formData.hours} onChange={handleChange}
                    placeholder="Mon-Fri 9am-5pm"
                    className={field} disabled={busy} />
                </div>
                <div>
                  <label htmlFor="website" className="block font-outfit text-sm font-semibold text-sky-900 mb-2">Website</label>
                  <input type="url" id="website" name="website"
                    value={formData.website} onChange={handleChange}
                    placeholder="https://organization.org"
                    className={field} disabled={busy} />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-gradient-to-r from-sky-600 to-sky-500 text-white font-outfit font-semibold px-8 py-4 rounded-[var(--radius-md)] flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {busy ? (
                  <>
                    <motion.div animate={{ x: [0, 6, 0], y: [0, -3, 0] }} transition={{ duration: 0.7, repeat: Infinity }}>
                      <Send className="w-5 h-5" />
                    </motion.div>
                    Sending…
                  </>
                ) : (
                  <><Send size={18} /> Submit Resource</>
                )}
              </button>

            </form>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  )
}
