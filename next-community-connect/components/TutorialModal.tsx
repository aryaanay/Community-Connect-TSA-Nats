'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/context/AchievementsContext'

const STEPS = [
  {
    emoji: '👋',
    badge: 'Welcome',
    title: 'Welcome to CommunityConnect!',
    body: 'Your all-in-one hub for Bothell, WA. Discover local resources, explore events, support causes, and connect with your community, all in one place.',
    accent: '#56BBF0',
    accentBg: 'rgba(86,187,240,0.12)',
    link: null,
  },
  {
    emoji: '📚',
    badge: 'Resources',
    title: 'Browse Community Resources',
    body: 'Find local services: food banks, health clinics, career support, youth programs, and more. Filter by category, search by name, and expand any card for full contact details.',
    accent: '#10B981',
    accentBg: 'rgba(16,185,129,0.12)',
    link: { label: 'Explore Resources', href: '/dashboard/resources' },
  },
  {
    emoji: '📅',
    badge: 'Events',
    title: 'Events Calendar & Creation',
    body: 'Browse upcoming workshops, volunteer days, and local activities. Signed-in users can also create their own events. Your event appears on the calendar instantly for everyone to see.',
    accent: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.12)',
    link: { label: 'View Events', href: '/dashboard/events' },
  },
  {
    emoji: '🗺️',
    badge: 'Map',
    title: 'Interactive Community Map',
    body: 'Explore Bothell\'s resources on a live map. Filter pins by category and click any marker to see details, hours, and contact info for that location.',
    accent: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.12)',
    link: { label: 'Open Map', href: '/dashboard/map' },
  },
  {
    emoji: '🙌',
    badge: 'Community Favors',
    title: 'Ask for Help or Offer a Hand',
    body: 'Need a ride? Offering lawn care? Community Favors is a local bulletin board where neighbors post small tasks and requests. Browse open favors, mark yourself as helping, and post your own, with optional pay and contact details.',
    accent: '#E85D26',
    accentBg: 'rgba(232,93,38,0.12)',
    link: { label: 'Browse Favors', href: '/dashboard/favors' },
  },
  {
    emoji: '🔍',
    badge: 'Lost & Found',
    title: 'Community Lost & Found',
    body: 'Lost something? Found something? Post it here. Add a photo (AI-reviewed for appropriateness), use AI to auto-write your description, and contact posters directly by email or phone.',
    accent: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.12)',
    link: { label: 'Browse Lost & Found', href: '/dashboard/lost-found' },
  },
  {
    emoji: '🤝',
    badge: 'Social',
    title: 'Community Social Directory',
    body: 'Connect with neighbors, view community member profiles, and find people who share your interests. The social directory is your window into the people making Bothell great.',
    accent: '#56BBF0',
    accentBg: 'rgba(86,187,240,0.12)',
    link: { label: 'Explore Social', href: '/dashboard/social' },
  },
  {
    emoji: '👥',
    badge: 'Groups',
    title: 'Community Groups',
    body: 'Join or create groups around shared interests, neighborhoods, or causes. Groups give you a space to coordinate, share updates, and build lasting connections.',
    accent: '#A78BFA',
    accentBg: 'rgba(167,139,250,0.12)',
    link: { label: 'Browse Groups', href: '/dashboard/groups' },
  },
  {
    emoji: '💛',
    badge: 'Donate',
    title: 'Support Local Causes',
    body: 'Donate directly to curated Bothell causes: the food bank, youth mentorship, senior companions, park restoration, and more. Every dollar goes to the organization, with zero platform fees. See live totals and track your impact.',
    accent: '#B83A6A',
    accentBg: 'rgba(184,58,106,0.12)',
    link: { label: 'Donate to a Cause', href: '/wishlist' },
  },
  {
    emoji: '🏆',
    badge: 'Achievements',
    title: 'Earn Achievements',
    body: 'Earn badges as you explore. Visit pages, submit resources, complete the tutorial, and more. Track your progress and contributions on your personal profile.',
    accent: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.12)',
    link: { label: 'View Profile', href: '/dashboard/profile' },
  },
  {
    emoji: '✉️',
    badge: 'Submit',
    title: 'Add a Resource',
    body: 'Know a local service that isn\'t listed yet? Submit it and our AI moderator will review it instantly. Approved resources appear in the directory right away, no waiting.',
    accent: '#EF4444',
    accentBg: 'rgba(239,68,68,0.12)',
    link: { label: 'Submit a Resource', href: '/submit' },
  },
  {
    emoji: '⚙️',
    badge: 'Settings',
    title: 'Customize Your Experience',
    body: 'Switch to dark mode, change the language, adjust font sizes, or enable accessibility features like dyslexia fonts and reduced motion, all from Settings.',
    accent: '#6366F1',
    accentBg: 'rgba(99,102,241,0.12)',
    link: { label: 'Open Settings', href: '/dashboard/settings' },
  },
]

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}

export function TutorialModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const { unlock } = useAchievements()

  const go = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(1,16,32,0.88)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #021e38 0%, #033460 100%)',
          border: '1px solid rgba(86,187,240,0.18)',
          boxShadow: '0 40px 120px rgba(1,16,32,0.7), 0 0 0 1px rgba(86,187,240,0.06)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
          style={{ color: 'rgba(198,235,255,0.4)' }}
        >
          <X size={16} />
        </button>

        {/* Colored header band */}
        <div
          className="px-8 pt-8 pb-6 relative overflow-hidden"
          style={{ borderBottom: '1px solid rgba(86,187,240,0.08)' }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 30% 50%, ${current.accent}, transparent 70%)` }}
          />

          {/* Badge */}
          <motion.div
            key={`badge-${step}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
            style={{
              background: current.accentBg,
              border: `1px solid ${current.accent}40`,
            }}
          >
            <span
              className="font-outfit text-[10px] font-bold uppercase tracking-widest"
              style={{ color: current.accent }}
            >
              {current.badge}
            </span>
          </motion.div>

          {/* Emoji + step counter row */}
          <div className="flex items-start justify-between gap-4">
            <motion.div
              key={`emoji-${step}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: current.accentBg, border: `1.5px solid ${current.accent}35` }}
            >
              {current.emoji}
            </motion.div>
            <span
              className="font-outfit text-xs mt-1 flex-shrink-0"
              style={{ color: 'rgba(198,235,255,0.3)' }}
            >
              {step + 1} / {STEPS.length}
            </span>
          </div>
        </div>

        {/* Step content — slides */}
        <div className="px-8 pt-6 pb-2 min-h-[160px] overflow-hidden relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-syne text-xl font-bold text-white mb-3 leading-snug">
                {current.title}
              </h2>
              <p className="font-outfit text-sm leading-relaxed" style={{ color: 'rgba(198,235,255,0.65)' }}>
                {current.body}
              </p>

              {current.link && (
                <Link
                  href={current.link.href}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 mt-4 font-outfit text-xs font-semibold transition-all hover:gap-2.5"
                  style={{ color: current.accent }}
                >
                  {current.link.label}
                  <ExternalLink size={11} />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 py-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                background: i === step ? current.accent : 'rgba(198,235,255,0.15)',
              }}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="px-8 pb-7 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              onClick={() => go(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-outfit text-sm transition-all hover:bg-white/8"
              style={{ color: 'rgba(198,235,255,0.5)' }}
            >
              <ChevronLeft size={15} /> Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-outfit text-sm transition-all hover:bg-white/8"
              style={{ color: 'rgba(198,235,255,0.35)' }}
            >
              Skip tour
            </button>
          )}

          <button
            onClick={() => { if (isLast) { unlock('tutorial_complete'); onClose() } else { go(step + 1) } }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-outfit text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${current.accent}cc, ${current.accent}99)`,
              boxShadow: `0 4px 16px ${current.accent}30`,
            }}
          >
            {isLast ? 'Get Started!' : <>Next <ChevronRight size={15} /></>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
