'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ArrowRight, CheckCircle, BookOpen, Heart, Send } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const features = [
  { icon: BookOpen, label: 'Browse 30+ verified community resources' },
  { icon: Heart,    label: 'Make demo donations to local causes' },
  { icon: Send,     label: 'Submit a resource to the directory' },
]

export default function JudgesPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const { signIn, isSignedIn, user } = useAuth()
  const router = useRouter()

  const handleJudgeSignIn = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    signIn('judges@tsa.com', 'judges!')
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #011629 0%, #022747 50%, #033460 100%)' }}>
      {/* Orbs */}
      <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-sky-400/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[350px] h-[350px] rounded-full bg-sky-600/15 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 border"
          style={{ backgroundColor: 'rgba(36,153,214,0.15)', borderColor: 'rgba(86,187,240,0.35)' }}
        >
          <Star className="w-4 h-4 text-sky-300" fill="currentColor" />
          <span className="font-syne text-xs font-bold uppercase tracking-widest text-sky-300">TSA Webmaster — State 2026</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-syne text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
        >
          Judge Access
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-outfit text-lg mb-10 max-w-md"
          style={{ color: 'rgba(198,235,255,0.75)' }}
        >
          Welcome to Community Connect. Use the button below to instantly sign in and explore all features of the site.
        </motion.p>

        {/* Credentials card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-3xl p-8 mb-6 border"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(86,187,240,0.25)' }}
        >
          <p className="font-syne text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(144,212,247,0.6)' }}>Judge Credentials</p>
          <div className="grid grid-cols-2 gap-4 mb-7">
            {[
              { label: 'Email', value: 'judges@tsa.com' },
              { label: 'Password', value: 'judges!' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl p-4 text-left" style={{ backgroundColor: 'rgba(36,153,214,0.12)', border: '1px solid rgba(86,187,240,0.2)' }}>
                <p className="font-outfit text-xs mb-1" style={{ color: 'rgba(144,212,247,0.6)' }}>{label}</p>
                <p className="font-mono text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {done || isSignedIn ? (
            <div className="flex items-center justify-center gap-3 py-4 rounded-2xl" style={{ backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-outfit font-semibold text-emerald-300">Signed in as {user?.email ?? 'TSA Judge'}</span>
            </div>
          ) : (
            <button
              onClick={handleJudgeSignIn}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-syne font-bold text-base text-white flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #085D8A 0%, #2499D6 100%)', boxShadow: '0 4px 24px rgba(36,153,214,0.3)' }}
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Star className="w-5 h-5" fill="currentColor" /> Sign In as Judge <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          )}
        </motion.div>

        {/* What you can explore */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full rounded-3xl p-6 mb-8 border"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(86,187,240,0.15)' }}
        >
          <p className="font-syne text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(144,212,247,0.5)' }}>What you can explore</p>
          <div className="space-y-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(36,153,214,0.2)' }}>
                  <Icon className="w-4 h-4 text-sky-300" />
                </div>
                <span className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.8)' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Nav links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {[
            { href: '/',          label: 'Home' },
            { href: '/resources', label: 'Resources' },
            { href: '/events',    label: 'Events' },
            { href: '/wishlist',  label: 'Donate' },
            { href: '/submit',    label: 'Submit' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-5 py-2.5 rounded-xl font-outfit text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(198,235,255,0.85)', border: '1px solid rgba(86,187,240,0.2)' }}
            >
              {label}
            </Link>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
