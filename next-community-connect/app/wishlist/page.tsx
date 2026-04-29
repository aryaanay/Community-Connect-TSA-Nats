'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { HeroDemo } from '@/components/ui/animated-hero-demo'
import { Heart, Users, TrendingUp, X, Check, ChevronRight, Sparkles, ImagePlus, LogIn, Loader2, RefreshCw, AlertCircle, Lock } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import TiltCard from '@/components/TiltCard'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ─── Types ───────────────────────────────────────────────────────────────────

type Cause = {
  id: string
  title: string
  tagline: string
  description: string
  category: string
  goal: number
  raised: number
  supporters: number
  color: string
  colorDark: string
  colorLight: string
  emoji: string
}

// ─── Static fallback data (shown instantly, then hydrated from DB) ────────────

const STATIC_CAUSES: Cause[] = [
  {
    id: 'food-bank',
    title: 'Bothell Food Bank',
    tagline: 'Every $25 feeds a family for a week',
    description: 'Emergency food assistance for 250 families every week. Fresh produce, canned goods, and essential staples distributed with dignity.',
    category: 'Hunger Relief',
    goal: 5000,
    raised: 3200,
    supporters: 87,
    color: '#E85D26',
    colorDark: '#C04820',
    colorLight: '#FEF3EE',
    emoji: '🥫',
  },
  {
    id: 'youth',
    title: 'Youth Mentorship',
    tagline: '$100 funds one mentor for a month',
    description: 'After-school programs connecting 200 at-risk youth with professional mentors, tutors, and skill-building workshops.',
    category: 'Youth Programs',
    goal: 12000,
    raised: 8900,
    supporters: 156,
    color: '#085D8A',
    colorDark: '#044069',
    colorLight: '#EBF7FF',
    emoji: '📚',
  },
  {
    id: 'seniors',
    title: 'Senior Companions',
    tagline: '$30 delivers meals + companionship',
    description: '150 isolated seniors receive weekly home visits, warm meals, and the human connection that makes all the difference.',
    category: 'Senior Care',
    goal: 4000,
    raised: 2700,
    supporters: 62,
    color: '#6B3FA0',
    colorDark: '#52308A',
    colorLight: '#F5F0FF',
    emoji: '🤝',
  },
  {
    id: 'parks',
    title: 'Park Restoration',
    tagline: '$200 funds new playground equipment',
    description: 'Revitalizing Bothell Landing Park with new play structures, accessibility ramps, and green spaces for every family.',
    category: 'Parks & Rec',
    goal: 15000,
    raised: 9800,
    supporters: 203,
    color: '#1A7A4A',
    colorDark: '#155F3A',
    colorLight: '#EDFAF4',
    emoji: '🌳',
  },
  {
    id: 'homeless',
    title: 'Homeless Aid Fund',
    tagline: '$75 provides 3 nights housing + meals',
    description: 'Emergency shelter beds, hot meals, and case management services for 80 unhoused community members each month.',
    category: 'Housing Support',
    goal: 10000,
    raised: 6700,
    supporters: 98,
    color: '#B83A6A',
    colorDark: '#963058',
    colorLight: '#FDF0F5',
    emoji: '🏠',
  },
  {
    id: 'pets',
    title: 'PAWS Pet Shelter',
    tagline: '$50 vaccinates & feeds one dog',
    description: 'Emergency veterinary care, vaccinations, and loving temporary homes for 150 rescued animals awaiting adoption.',
    category: 'Animal Rescue',
    goal: 8000,
    raised: 5200,
    supporters: 124,
    color: '#2499D6',
    colorDark: '#1A80B8',
    colorLight: '#EBF7FF',
    emoji: '🐾',
  },
]

const PRESET_AMOUNTS = [10, 25, 50, 100]

// ─── Supabase helpers (inline so no external dep needed) ──────────────────────

// Maps DB cause_name → static cause id
const CAUSE_NAME_TO_ID: Record<string, string> = {
  'Bothell Food Bank': 'food-bank',
  'Youth Mentorship':  'youth',
  'Senior Companions': 'seniors',
  'Park Restoration':  'parks',
  'Homeless Aid Fund': 'homeless',
  'PAWS Pet Shelter':  'pets',
}

async function fetchCauseTotals(): Promise<Record<string, { raised: number; supporters: number }>> {
  const { data, error } = await supabase
    .from('wishlist_causes')
    .select('cause_name, current_amount, supporter_count')
  if (error || !data) return {}

  const totals: Record<string, { raised: number; supporters: number }> = {}
  for (const row of data) {
    const id = CAUSE_NAME_TO_ID[row.cause_name]
    if (id) totals[id] = { raised: row.current_amount, supporters: row.supporter_count }
  }
  return totals
}

async function fetchUserDonations(userId: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('donations')
    .select('cause_id, amount')
    .eq('user_id', userId)
  if (error || !data) return {}

  const map: Record<string, number> = {}
  for (const row of data) {
    map[row.cause_id] = (map[row.cause_id] || 0) + row.amount
  }
  return map
}

async function insertDonation(_userId: string, causeId: string, amount: number) {
  const causeName = Object.entries(CAUSE_NAME_TO_ID).find(([, id]) => id === causeId)?.[0]
  if (!causeName) throw new Error('Unknown cause')

  const { data, error: fetchError } = await supabase
    .from('wishlist_causes')
    .select('current_amount, supporter_count')
    .eq('cause_name', causeName)
    .single()
  if (fetchError || !data) throw fetchError ?? new Error('Cause not found')

  const { error: updateError } = await supabase
    .from('wishlist_causes')
    .update({
      current_amount:  data.current_amount  + amount,
      supporter_count: data.supporter_count + 1,
    })
    .eq('cause_name', causeName)
  if (updateError) throw updateError
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, v => Math.round(v).toLocaleString())
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const controls = animate(motionVal, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] })
    const unsub = rounded.on('change', v => setDisplay(v))
    return () => { controls.stop(); unsub() }
  }, [value])

  return <span>{display}</span>
}

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div className="relative h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </div>
  )
}

// ─── Stripe payment form (inner, must be inside <Elements>) ──────────────────

function StripePaymentForm({ cause, amount, onSuccess, onBack, tc, dark }: {
  cause: Cause
  amount: number
  onSuccess: () => void
  onBack: () => void
  tc: Record<string, string>
  dark: boolean
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  const handlePay = async () => {
    if (!stripe || !elements) return
    setPaying(true)
    setPayError('')
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })
    if (error) {
      setPayError(error.message ?? 'Payment failed.')
      setPaying(false)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="px-8 py-6">
      <button onClick={onBack} className="flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70"
        style={{ fontFamily: 'var(--font-dm-sans)', color: tc.m }}>
        ← Back
      </button>
      <p style={{ fontFamily: 'var(--font-space)', fontSize: '15px', fontWeight: 600, color: tc.h, marginBottom: '4px' }}>
        Donating <span style={{ color: cause.color }}>${amount}</span> to {cause.title}
      </p>
      <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: tc.m, marginBottom: '24px' }}>
        Enter your card details below. Powered by Stripe.
      </p>

      <div className="mb-5 rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${dark ? 'rgba(36,153,214,0.25)' : '#E2E8F0'}`, padding: '16px', backgroundColor: dark ? 'rgba(2,39,71,0.6)' : '#F8FAFC' }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {payError && (
        <p className="text-red-500 text-xs mb-4 flex items-center gap-1">
          <AlertCircle size={12} /> {payError}
        </p>
      )}

      <button
        onClick={handlePay}
        disabled={!stripe || paying}
        className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 transition-all"
        style={{
          fontFamily: 'var(--font-space)', fontSize: '15px', fontWeight: 600,
          backgroundColor: !stripe || paying ? '#CBD5E1' : cause.color,
          boxShadow: !stripe || paying ? 'none' : `0 8px 24px ${cause.color}40`,
          cursor: !stripe || paying ? 'not-allowed' : 'pointer',
        }}
      >
        {paying ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : <><Lock size={16} /> Pay ${amount}</>}
      </button>
      <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: tc.m, textAlign: 'center', marginTop: '10px' }}>
        Secured by Stripe · SSL encrypted · Test mode — no real charges
      </p>
    </div>
  )
}

// ─── Donation Modal ───────────────────────────────────────────────────────────

function DonationModal({ cause, onClose, onDonate }: {
  cause: Cause
  onClose: () => void
  onDonate: (amount: number) => Promise<void>
}) {
  const [amount, setAmount] = useState(25)
  const [custom, setCustom] = useState('')
  const [step, setStep] = useState<'amount' | 'payment' | 'success'>('amount')
  const [localSaving, setLocalSaving] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const finalAmount = custom ? Number(custom) : amount
  const { settings } = useSettings()
  const dark = settings.dark
  const tc = {
    h: dark ? '#C6EBFF' : '#0F172A',
    b: dark ? '#90D4F7' : '#64748b',
    m: dark ? '#56BBF0' : '#94a3b8',
    d: dark ? '#C6EBFF' : '#334155',
    bg: dark ? '#011629' : 'white',
    bgSub: dark ? 'rgba(2,39,71,0.9)' : '#F8FAFC',
    border: dark ? 'rgba(36,153,214,0.2)' : '#F1F5F9',
    borderInput: dark ? 'rgba(36,153,214,0.3)' : '#E2E8F0',
  }

  const handleDonate = async () => {
    if (finalAmount <= 0) return
    setLocalSaving(true)
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, causeId: cause.id, causeName: cause.title }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch (e: any) {
      alert(e.message ?? 'Could not start payment. Please try again.')
    } finally {
      setLocalSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(1,22,41,0.7)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ backgroundColor: tc.bg, boxShadow: '0 40px 100px rgba(2,39,71,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === 'payment' && clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: dark ? 'night' : 'stripe' } }}>
              <StripePaymentForm
                cause={cause}
                amount={finalAmount}
                onBack={() => setStep('amount')}
                onSuccess={async () => { await onDonate(finalAmount); setStep('success') }}
                tc={tc}
                dark={dark}
              />
            </Elements>
          ) : step === 'amount' ? (
            <motion.div key="amount" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative px-8 pt-8 pb-6" style={{ borderBottom: `1px solid ${tc.border}` }}>
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: tc.m }}
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: dark ? `${cause.color}30` : cause.colorLight }}>
                    {cause.emoji}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: cause.color, marginBottom: '4px' }}>
                      {cause.category}
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-space)', fontSize: '20px', fontWeight: 600, color: tc.h, lineHeight: 1.2, letterSpacing: '-0.3px' }}>
                      {cause.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6">
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: tc.b, lineHeight: 1.7, marginBottom: '24px' }}>
                  {cause.description}
                </p>

                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: tc.m, marginBottom: '12px' }}>
                  Select Amount
                </p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESET_AMOUNTS.map(a => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustom('') }}
                      className="py-3 rounded-xl text-sm transition-all"
                      style={{
                        fontFamily: 'var(--font-space)',
                        fontWeight: 600,
                        fontSize: '14px',
                        backgroundColor: amount === a && !custom ? cause.color : tc.bgSub,
                        color: amount === a && !custom ? 'white' : tc.d,
                        border: `1.5px solid ${amount === a && !custom ? cause.color : tc.borderInput}`,
                        transform: amount === a && !custom ? 'scale(1.03)' : 'scale(1)',
                      }}
                    >
                      ${a}
                    </button>
                  ))}
                </div>

                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    style={{ fontFamily: 'var(--font-space)', fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setAmount(0) }}
                    className="w-full pl-8 pr-4 py-3 rounded-xl text-sm transition-all outline-none"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      border: `1.5px solid ${custom ? cause.color : tc.borderInput}`,
                      backgroundColor: custom ? (dark ? `${cause.color}30` : cause.colorLight) : tc.bgSub,
                      color: tc.h,
                      fontWeight: 500,
                    }}
                    min={1}
                  />
                </div>

                <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: dark ? `${cause.color}25` : cause.colorLight }}>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, color: dark ? cause.color : cause.colorDark, lineHeight: 1.6 }}>
                    {cause.tagline}
                  </p>
                </div>

                <button
                  onClick={handleDonate}
                  disabled={finalAmount <= 0 || localSaving}
                  className="w-full py-4 rounded-2xl text-white transition-all flex items-center justify-center gap-2"
                  style={{
                    fontFamily: 'var(--font-space)',
                    fontSize: '15px',
                    fontWeight: 600,
                    letterSpacing: '-0.2px',
                    backgroundColor: finalAmount > 0 && !localSaving ? cause.color : '#CBD5E1',
                    boxShadow: finalAmount > 0 && !localSaving ? `0 8px 24px ${cause.color}40` : 'none',
                    cursor: finalAmount > 0 && !localSaving ? 'pointer' : 'not-allowed',
                  }}
                >
                  {localSaving ? (
                    <><Loader2 size={16} className="animate-spin" /> Setting up payment…</>
                  ) : (
                    <><Heart size={16} fill="white" /> Donate ${finalAmount > 0 ? finalAmount.toLocaleString() : '-'} <Right size={16} /></>
                  )}
                </button>

                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: tc.m, textAlign: 'center', marginTop: '12px' }}>
                  Secured by Stripe · SSL encrypted
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-8 py-16 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: dark ? `${cause.color}30` : cause.colorLight }}
              >
                <Check size={36} style={{ color: cause.color }} strokeWidth={2.5} />
              </motion.div>
              <h3 style={{ fontFamily: 'var(--font-space)', fontSize: '24px', fontWeight: 600, color: tc.h, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                Thank you!
              </h3>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: tc.b, lineHeight: 1.7, marginBottom: '8px' }}>
                Your <strong style={{ color: cause.color }}>${finalAmount}</strong> donation to <strong>{cause.title}</strong> has been recorded.
              </p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', color: tc.m, marginBottom: '32px' }}>
                {cause.tagline}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-2xl transition-all"
                style={{ fontFamily: 'var(--font-space)', fontSize: '14px', fontWeight: 600, backgroundColor: cause.colorLight, color: cause.color }}
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Sign-in modal ────────────────────────────────────────────────────────────

function DonateSignInModal({ onClose }: { onClose: () => void }) {
  return (
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
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ color: 'rgba(198,235,255,0.5)' }}>
          <X size={16} />
        </button>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)' }}>
          <LogIn className="w-7 h-7 text-white" />
        </div>
        <h2 className="font-syne text-2xl font-bold text-white mb-3">Sign in to donate</h2>
        <p className="font-outfit text-sm mb-7 leading-relaxed" style={{ color: 'rgba(198,235,255,0.7)' }}>
          You need to be signed in to make a donation. It only takes a moment.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/signin?redirect=/wishlist" className="w-full py-3.5 rounded-xl font-outfit font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)' }}>
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
          <Link href="/signin?redirect=/wishlist" className="w-full py-3.5 rounded-xl font-outfit font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(198,235,255,0.85)', border: '1px solid rgba(86,187,240,0.3)' }}>
            Create Account
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DonatePage() {
  const { isSignedIn, user } = useAuth()
  const { settings } = useSettings()
  const dark = settings.dark
  const tc = {
    h: dark ? '#C6EBFF' : '#0F172A',
    b: dark ? '#90D4F7' : '#64748b',
    m: dark ? '#56BBF0' : '#94a3b8',
    d: dark ? '#C6EBFF' : '#334155',
  }

  // ── DB-hydrated state (optimistic on top of static data) ──
  const [dbTotals, setDbTotals] = useState<Record<string, { raised: number; supporters: number }>>({})
  const [userDonations, setUserDonations] = useState<Record<string, number>>({})
  const [dbLoading, setDbLoading] = useState(true)
  const [dbError, setDbError] = useState('')
  const [selected, setSelected] = useState<Cause | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [cardImages, setCardImages] = useState<Record<string, string>>({})
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // ── Load real totals from Supabase ────────────────────────
  const loadTotals = useCallback(async () => {
    setDbError('')
    try {
      const totals = await fetchCauseTotals()
      setDbTotals(totals)
    } catch {
      setDbError('Could not load live totals.')
    } finally {
      setDbLoading(false)
    }
  }, [])

  useEffect(() => { loadTotals() }, [loadTotals])

  // ── Load user's own donations if signed in ────────────────
  useEffect(() => {
    if (!isSignedIn || !user?.id) return
    fetchUserDonations(user.id).then(setUserDonations)
  }, [isSignedIn, user?.id])

  // ── Real-time subscription — watch wishlist_causes for live updates ──
  useEffect(() => {
    const channel = supabase
      .channel('wishlist-causes-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'wishlist_causes' },
        (payload) => {
          const row = payload.new as { cause_name: string; current_amount: number; supporter_count: number }
          const id = CAUSE_NAME_TO_ID[row.cause_name]
          if (!id) return
          setDbTotals(prev => ({
            ...prev,
            [id]: { raised: row.current_amount, supporters: row.supporter_count },
          }))
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── Merge: use DB values directly (they are the totals, not increments) ──
  const causes = STATIC_CAUSES.map(c => ({
    ...c,
    raised:     dbTotals[c.id]?.raised     ?? c.raised,
    supporters: dbTotals[c.id]?.supporters ?? c.supporters,
  }))

  // ── Donate handler ────────────────────────────────────────
  const handleDonate = async (amount: number) => {
    if (!selected || !user?.id) return
    // Optimistic update
    setDbTotals(prev => ({
      ...prev,
      [selected.id]: {
        raised: (prev[selected.id]?.raised || 0) + amount,
        supporters: (prev[selected.id]?.supporters || 0) + 1,
      },
    }))
    setUserDonations(prev => ({ ...prev, [selected.id]: (prev[selected.id] || 0) + amount }))
    try {
      await insertDonation(user.id, selected.id, amount)
    } catch {
      // Rollback optimistic update on failure
      setDbTotals(prev => ({
        ...prev,
        [selected.id]: {
          raised: (prev[selected.id]?.raised || 0) - amount,
          supporters: Math.max(0, (prev[selected.id]?.supporters || 0) - 1),
        },
      }))
      setUserDonations(prev => ({ ...prev, [selected.id]: (prev[selected.id] || 0) - amount }))
      throw new Error('Donation failed — please try again.')
    }
  }

  // ── Card image upload ─────────────────────────────────────
  const handleCardImage = (causeId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) setCardImages(prev => ({ ...prev, [causeId]: ev.target!.result as string }))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── Stats ─────────────────────────────────────────────────
  const totalRaised = causes.reduce((sum, c) => sum + c.raised, 0)
  const totalSupporters = causes.reduce((sum, c) => sum + c.supporters, 0)
  const totalGoal = causes.reduce((sum, c) => sum + c.goal, 0)
  const overallPercent = Math.round((totalRaised / totalGoal) * 100)

  return (
    <>
      <HeroDemo
        badge="Every Dollar Stays Local"
        staticTitle="Support Our Community"
        subtitle="Choose a cause below and make a direct impact for families, youth, and neighbors right here in Bothell."
        backgroundImage="/img/page-5.jpg"
      />

      {/* ── DB error banner ── */}
      <AnimatePresence>
        {dbError && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between gap-3 max-w-6xl mx-auto rounded-b-2xl"
          >
            <div className="flex items-center gap-2 text-amber-800 text-sm">
              <AlertCircle size={15} /> {dbError} Showing estimated totals.
            </div>
            <button onClick={loadTotals} className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors">
              <RefreshCw size={12} /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STATS BAR ── */}
      <section className="wishlist-stats bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-slate-100">
            {[
              { value: totalRaised, prefix: '$', label: 'Total Raised', sub: `across ${STATIC_CAUSES.length} active causes`, icon: <TrendingUp size={18} />, color: '#008fb5' },
              { value: totalSupporters, prefix: '', label: 'Community Donors', sub: 'and growing every day', icon: <Users size={18} />, color: '#008fb5' },
              { value: overallPercent, prefix: '', suffix: '%', label: 'Overall Goal Progress', sub: `$${totalGoal.toLocaleString()} total target`, icon: <Heart size={18} />, color: '#008fb5' },
            ].map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="px-8 flex items-center gap-5"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${stat.color}12`, color: stat.color }}>
                  {dbLoading ? <Loader2 size={18} className="animate-spin opacity-50" /> : stat.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-space)', fontSize: '32px', fontWeight: 600, color: '#008fb5', lineHeight: 1, letterSpacing: '-1px' }}>
                    {stat.prefix}<AnimatedNumber value={stat.value} />{stat.suffix ?? ''}
                  </div>
                  <div style={{ fontFamily: 'var(--font-space)', fontSize: '14px', fontWeight: 600, color: stat.color, marginTop: '4px', letterSpacing: '-0.2px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: tc.m, marginTop: '2px' }}>
                    {dbLoading ? 'Loading live data…' : stat.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAUSE CARDS ── */}
      <section className="wishlist-causes py-24 lg:py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} style={{ color: '#085D8A' }} />
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#085D8A' }}>
                Active Causes
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 style={{ fontFamily: 'var(--font-space)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, color: '#19619f', lineHeight: 1.05, letterSpacing: '-0.5px' }}>
                Choose Where<br />to Give.
              </h2>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 300, color: '#19619f', maxWidth: '260px', lineHeight: 1.7 }} className="lg:text-right">
                100% of donations go directly to local organizations. No platform fees.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {causes.map((cause, i) => {
              const percent = Math.min(100, (cause.raised / cause.goal) * 100)
              const userDonated = (userDonations[cause.id] || 0) > 0

              return (
                <motion.div
                  key={cause.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
                >
                  <TiltCard
                    className="rounded-2xl h-full"
                    intensity={11}
                    glareOpacity={0.14}
                  >
                    <div
                      onClick={() => isSignedIn ? setSelected(cause) : setShowAuthModal(true)}
                      className="group relative rounded-2xl overflow-hidden cursor-pointer h-full"
                      style={{
                        backgroundColor: dark ? '#011629' : 'white',
                        border: userDonated ? `1.5px solid ${cause.color}` : dark ? '1.5px solid rgba(36,153,214,0.2)' : '1.5px solid #F1F5F9',
                        boxShadow: userDonated ? `0 4px 24px ${cause.color}20` : '0 2px 12px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    >
                      {/* Donated badge */}
                      {userDonated && (
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: cause.color }}>
                          <Check size={10} color="white" strokeWidth={3} />
                          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 700, color: 'white' }}>
                            +${userDonations[cause.id].toLocaleString()} given
                          </span>
                        </div>
                      )}

                      {/* Top progress strip */}
                      <div className="h-1.5 w-full" style={{ backgroundColor: `${cause.color}18` }}>
                        <motion.div className="h-full" style={{ backgroundColor: cause.color }}
                          initial={{ width: 0 }} whileInView={{ width: `${percent}%` }}
                          viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.07 }}
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-5">
                          <div className="relative group/img">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl overflow-hidden"
                              style={{ backgroundColor: dark ? `${cause.color}30` : cause.colorLight }}>
                              {cardImages[cause.id]
                                ? <img src={cardImages[cause.id]} alt={cause.title} className="w-full h-full object-cover" />
                                : cause.emoji}
                            </div>
                            <input
                              ref={el => { imageInputRefs.current[cause.id] = el }}
                              type="file" accept="image/*" className="hidden"
                              onChange={(e) => handleCardImage(cause.id, e)}
                            />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); imageInputRefs.current[cause.id]?.click() }}
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                              style={{ backgroundColor: cause.color }}
                            >
                              <ImagePlus size={10} color="white" />
                            </button>
                          </div>
                          <span style={{
                            fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em', color: cause.color,
                            backgroundColor: dark ? `${cause.color}25` : cause.colorLight,
                            padding: '4px 10px', borderRadius: '999px',
                          }}>
                            {cause.category}
                          </span>
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-space)', fontSize: '18px', fontWeight: 600, color: tc.h, lineHeight: 1.25, marginBottom: '6px', letterSpacing: '-0.2px' }}>
                          {cause.title}
                        </h3>
                        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, color: cause.color, marginBottom: '10px', lineHeight: 1.5 }}>
                          {cause.tagline}
                        </p>
                        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, color: tc.b, lineHeight: 1.7, marginBottom: '20px' }}>
                          {cause.description}
                        </p>

                        <div className="mb-5">
                          <div className="flex justify-between items-baseline mb-2">
                            <span style={{ fontFamily: 'var(--font-space)', fontSize: '20px', fontWeight: 600, color: tc.h, letterSpacing: '-0.5px' }}>
                              {dbLoading ? <span className="inline-block w-16 h-5 bg-slate-100 rounded animate-pulse" /> : `$${cause.raised.toLocaleString()}`}
                            </span>
                            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: tc.m }}>
                              of ${cause.goal.toLocaleString()}
                            </span>
                          </div>
                          <ProgressBar percent={percent} color={cause.color} />
                          <div className="flex justify-between items-center mt-2">
                            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: tc.m }}>
                              {dbLoading
                                ? <span className="inline-block w-20 h-3 bg-slate-100 rounded animate-pulse" />
                                : `${cause.supporters} supporters`}
                            </span>
                            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 600, color: cause.color }}>
                              {percent.toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <button
                          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                          style={{
                            fontFamily: 'var(--font-space)', fontSize: '13px', fontWeight: 600,
                            letterSpacing: '-0.1px', backgroundColor: '#2499D6', color: 'white', border: 'none',
                          }}
                        >
                          <Heart size={13} />
                          Donate to {cause.title.split(' ')[0]}
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              )
            })}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="text-center mt-12" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', color: tc.m }}>
            {!dbLoading && `Live data · Last synced just now`}
          </motion.p>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <DonationModal
            cause={selected}
            onClose={() => setSelected(null)}
            onDonate={handleDonate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && <DonateSignInModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>
    </>
  )
}
