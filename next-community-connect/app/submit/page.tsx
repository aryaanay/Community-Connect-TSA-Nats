'use client'

import { useState, useRef, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Mail, Phone, MapPin, Send, X, LogIn, FlaskConical } from 'lucide-react'
import { HeroDemo } from '@/components/ui/animated-hero-demo'
import { useAuth } from '@/context/AuthContext'
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

async function submitResourceToDb(data: FormData) {
  // 1) Insert into submissions (hard fail)
  const { error: submissionError } = await supabase
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

  if (submissionError) throw submissionError

  // 2) TESTING: also insert into resources so it appears instantly (soft fail)
  const { error: resourceError } = await supabase
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
      is_verified: false,
      is_featured: false,
    })

  if (resourceError) {
    console.warn('[Testing] resources insert failed (submission still saved):', JSON.stringify(resourceError, null, 2))
  }
}

function PlaneSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-sky-800 to-sky-700 px-4 relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-sky-400/10 blur-[80px]" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-sky-600/20 blur-[80px]" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-lg w-full relative z-10">
        <div className="relative h-44 mb-2">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 440 180" preserveAspectRatio="none">
            <motion.path
              d="M -10 150 Q 110 110 220 80 Q 330 50 460 10"
              stroke="rgba(144,212,247,0.7)" strokeWidth="2.5" strokeDasharray="12 9"
              fill="none" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.9, 0.9, 0.4] }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.path
              d="M -10 160 Q 110 122 220 94 Q 330 64 460 24"
              stroke="rgba(86,187,240,0.4)" strokeWidth="1.5" strokeDasharray="7 12"
              fill="none" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.5, 0.5, 0.1] }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.15 }}
            />
            <motion.path
              d="M -10 165 Q 110 128 220 100 Q 330 70 460 32"
              stroke="rgba(36,153,214,0.3)" strokeWidth="1" strokeDasharray="5 15"
              fill="none" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.3, 0.3, 0.05] }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
            />
          </svg>
          <motion.div
            className="absolute"
            initial={{ left: '-5%', top: '78%', opacity: 0 }}
            animate={{ left: '108%', top: '2%', opacity: [0, 1, 1, 0.6] }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ position: 'absolute' }}
          >
            <motion.div animate={{ rotate: [-20, -28, -20] }} transition={{ duration: 0.4, repeat: 3, repeatType: 'mirror' }}>
              <Send className="w-10 h-10 text-sky-300" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="backdrop-blur-md rounded-3xl p-10"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 2, type: 'spring', stiffness: 200, damping: 12 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <CheckCircle className="w-8 h-8 text-sky-200" />
          </motion.div>

          <h1 className="font-syne text-3xl font-bold text-white mb-3">Submission Sent!</h1>
          <p className="font-dm-sans text-base mb-5" style={{ color: 'rgba(198,235,255,0.75)' }}>
            Our team will review your resource within 2-3 business days and add it to the directory.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.4 }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl mb-8 mx-auto w-fit"
            style={{ backgroundColor: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}
          >
            <FlaskConical size={14} className="text-amber-300 flex-shrink-0" />
            <p className="font-dm-sans text-xs" style={{ color: 'rgba(253,230,138,0.9)' }}>
              For testing purposes, your submission appears immediately in the directory.
            </p>
          </motion.div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="px-6 py-3 rounded-xl font-outfit font-semibold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#022747' }}>
              Return Home
            </Link>
            <Link href="/resources" className="px-6 py-3 rounded-xl font-outfit font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
              Browse Resources
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

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

export default function SubmitPage() {
  const { isSignedIn, user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isPending, startTransition] = useTransition()

  const busy = isLoading || isPending

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn || !user?.id) { setShowAuthModal(true); return }

    setIsLoading(true)
    setSubmitError('')

    startTransition(async () => {
      try {
        await submitResourceToDb(formData)
        setIsSubmitted(true)
        setFormData(EMPTY_FORM)
      } catch (err: unknown) {
        setSubmitError(getErrorMessage(err))
        console.error('Submit error — raw:', JSON.stringify(err, null, 2))
      } finally {
        setIsLoading(false)
      }
    })
  }

  if (isSubmitted) return <PlaneSuccess />

  return (
    <>
      {showAuthModal && <SignInModal onClose={() => setShowAuthModal(false)} />}

      <HeroDemo
        badge="Community Driven"
        staticTitle="Submit a Resource"
        subtitle="Know of a program that helped you or someone you know? Share it with our community so others can benefit too."
        backgroundImage="/img/page-6.jpg"
      />

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

            <div className="bg-sky-50 border border-sky-200 rounded-[var(--radius-md)] p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
              <div className="font-outfit text-sm text-sky-800">
                <strong className="text-sky-900">All submissions are reviewed</strong> by our team within 2-3 business days to ensure quality and accuracy before being added to the directory.
              </div>
            </div>

            <div className="flex items-start gap-2.5 px-4 py-3 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 mb-8">
              <FlaskConical size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="font-outfit text-xs text-amber-800">
                <strong>Testing mode:</strong> Your submission will appear immediately on the Resources page without review.
              </p>
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
    </>
  )
}