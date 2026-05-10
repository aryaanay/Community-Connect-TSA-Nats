'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, MapPin, Clock, Lock, Globe, Mail, X, CheckCircle, AlertCircle, Plus, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Community', 'Volunteer', 'Education', 'Health', 'Donation', 'Social', 'Sports', 'Arts', 'Other']
const EMOJIS     = ['📅','🌿','💻','🥫','🧥','🌱','💙','🎆','🎒','🎨','🏃','🤝','🎵','🍕','📚']

type FormState = {
  title: string
  description: string
  date: string
  time: string
  endTime: string
  location: string
  category: string
  emoji: string
  isPublic: boolean
  inviteEmails: string
}

const EMPTY: FormState = {
  title: '', description: '', date: '', time: '', endTime: '',
  location: '', category: 'Community', emoji: '📅',
  isPublic: true, inviteEmails: '',
}

export default function CreateEventPage() {
  const { user, isSignedIn } = useAuth()
  const { unlock, markPageVisited } = useAchievements()
  const router = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn || !user) { setError('You must be signed in to create an event.'); return }
    if (!form.title || !form.date) { setError('Title and date are required.'); return }
    setError('')
    startTransition(async () => {
      const timeStr = form.time && form.endTime
        ? `${fmt12(form.time)} - ${fmt12(form.endTime)}`
        : form.time ? fmt12(form.time) : ''

      const invites = form.inviteEmails
        .split(/[,\n]+/)
        .map(e => e.trim())
        .filter(Boolean)

      const { error: dbErr } = await supabase.from('user_events').insert({
        user_id:       user.id,
        creator_email: user.email,
        title:         form.title,
        description:   form.description,
        date:          formatDateDisplay(form.date),
        time:          timeStr,
        location:      form.location,
        category:      form.category,
        emoji:         form.emoji,
        is_public:     form.isPublic,
        invite_emails: invites.length ? invites : null,
      })

      if (dbErr) {
        setError('Failed to save event. Make sure the user_events table exists (see supabase/community_features.sql).')
        return
      }

      unlock('create_event')
      markPageVisited('events')
      setDone(true)

      // If private, open mailto to invite people
      if (!form.isPublic && invites.length) {
        const subject = encodeURIComponent(`You're invited: ${form.title}`)
        const body = encodeURIComponent(
          `Hi!\n\nYou're invited to a private event: ${form.title}\n\nDate: ${formatDateDisplay(form.date)}\nTime: ${timeStr}\nLocation: ${form.location || 'TBD'}\n\n${form.description}\n\nSee you there!`
        )
        window.open(`mailto:${invites.join(',')}?subject=${subject}&body=${body}`)
      }
    })
  }

  if (!isSignedIn) return (
    <div className="flex items-center justify-center h-full min-h-[400px] flex-col gap-4" style={{ background: 'linear-gradient(150deg,#011629,#022747)' }}>
      <p className="font-outfit text-white">Sign in to create events.</p>
      <button onClick={() => router.push('/signin')} className="px-4 py-2 rounded-xl font-outfit text-sm text-white" style={{ background: 'linear-gradient(135deg,#0857A0,#2499D6)' }}>Sign In</button>
    </div>
  )

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(150deg,#011629 0%,#022747 60%,#011629 100%)' }}>
      <div className="max-w-2xl mx-auto">

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl p-10 text-center"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              <div className="text-6xl mb-4">{form.emoji}</div>
              <CheckCircle size={32} className="mx-auto mb-3 text-emerald-400" />
              <h2 className="font-syne text-2xl font-black text-white mb-2">Event Created!</h2>
              <p className="font-outfit text-sm mb-6" style={{ color: 'rgba(198,235,255,0.6)' }}>
                {form.isPublic
                  ? 'Your event is now live on the Events page and Community Map.'
                  : 'Your private event was saved and invite emails have been drafted.'}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => router.push('/dashboard/events')} className="px-5 py-2.5 rounded-xl font-outfit text-sm text-white font-semibold" style={{ background: 'linear-gradient(135deg,#0857A0,#2499D6)' }}>
                  View Events
                </button>
                <button onClick={() => { setDone(false); setForm(EMPTY) }} className="px-5 py-2.5 rounded-xl font-outfit text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.2)', color: 'rgba(198,235,255,0.7)' }}>
                  Create Another
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>

              {/* Header */}
              <div className="mb-6">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-1.5 mb-4 font-outfit text-sm transition-colors hover:text-sky-300"
                  style={{ color: 'rgba(198,235,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <ArrowLeft size={14} /> Go Back
                </button>
                <h1 className="font-syne text-2xl font-black text-white mb-1">Create an Event</h1>
                <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.5)' }}>
                  Public events appear on the Events page and Community Map. Private events send email invites.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Visibility toggle */}
                <div className="flex gap-3">
                  {[true, false].map(pub => (
                    <button
                      key={String(pub)}
                      type="button"
                      onClick={() => set('isPublic', pub)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-outfit text-sm font-semibold transition-all"
                      style={{
                        background: form.isPublic === pub ? (pub ? 'rgba(86,187,240,0.18)' : 'rgba(139,92,246,0.18)') : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.isPublic === pub ? (pub ? 'rgba(86,187,240,0.45)' : 'rgba(139,92,246,0.45)') : 'rgba(86,187,240,0.1)'}`,
                        color: form.isPublic === pub ? (pub ? '#56BBF0' : '#A78BFA') : 'rgba(198,235,255,0.4)',
                      }}
                    >
                      {pub ? <Globe size={15} /> : <Lock size={15} />}
                      {pub ? 'Public' : 'Private'}
                    </button>
                  ))}
                </div>

                {/* Emoji picker */}
                <div>
                  <label className="block font-outfit text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgba(198,235,255,0.45)' }}>Event Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => set('emoji', em)}
                        className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                        style={{
                          background: form.emoji === em ? 'rgba(86,187,240,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${form.emoji === em ? 'rgba(86,187,240,0.5)' : 'rgba(86,187,240,0.1)'}`,
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <Field label="Event Title *">
                  <input
                    required value={form.title} onChange={e => set('title', e.target.value)}
                    placeholder="Community Cleanup, Workshop, etc."
                    className="w-full px-4 py-3 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.18)' }}
                  />
                </Field>

                {/* Description */}
                <Field label="Description">
                  <textarea
                    rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                    placeholder="What's happening? Who should come?"
                    className="w-full px-4 py-3 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35 resize-none"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.18)' }}
                  />
                </Field>

                {/* Date + Time row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Date *" className="sm:col-span-1">
                    <input
                      type="date" required value={form.date} onChange={e => set('date', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.18)', colorScheme: 'dark' }}
                    />
                  </Field>
                  <Field label="Start Time">
                    <input
                      type="time" value={form.time} onChange={e => set('time', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.18)', colorScheme: 'dark' }}
                    />
                  </Field>
                  <Field label="End Time">
                    <input
                      type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.18)', colorScheme: 'dark' }}
                    />
                  </Field>
                </div>

                {/* Location */}
                <Field label="Location">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input
                      value={form.location} onChange={e => set('location', e.target.value)}
                      placeholder="Address or place name"
                      className="w-full pl-9 pr-4 py-3 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.18)' }}
                    />
                  </div>
                </Field>

                {/* Category */}
                <Field label="Category">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat} type="button" onClick={() => set('category', cat)}
                        className="px-3 py-1.5 rounded-full font-outfit text-xs font-semibold transition-all"
                        style={{
                          background: form.category === cat ? 'rgba(86,187,240,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${form.category === cat ? 'rgba(86,187,240,0.5)' : 'rgba(86,187,240,0.1)'}`,
                          color: form.category === cat ? '#56BBF0' : 'rgba(198,235,255,0.5)',
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Private: invite emails */}
                {!form.isPublic && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <Field label="Invite Emails (comma or line separated)">
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-3.5" style={{ color: 'rgba(198,235,255,0.35)' }} />
                        <textarea
                          rows={3} value={form.inviteEmails} onChange={e => set('inviteEmails', e.target.value)}
                          placeholder={"friend@email.com,\nanother@email.com"}
                          className="w-full pl-9 pr-4 py-3 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-purple-400/35 resize-none"
                          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}
                        />
                      </div>
                      <p className="mt-1.5 font-outfit text-[10px]" style={{ color: 'rgba(198,235,255,0.35)' }}>
                        After creating the event, your email client will open with a draft invite to all these addresses.
                      </p>
                    </Field>
                  </motion.div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="font-outfit text-xs text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="submit" disabled={isPending}
                  className="w-full py-3.5 rounded-2xl font-outfit text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#0857A0,#2499D6)', boxShadow: '0 8px 24px rgba(36,153,214,0.25)' }}
                >
                  <Plus size={16} />
                  {isPending ? 'Creating…' : 'Create Event'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block font-outfit text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'rgba(198,235,255,0.45)' }}>{label}</label>
      {children}
    </div>
  )
}

function fmt12(t: string) {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

function formatDateDisplay(iso: string) {
  const [y, mo, d] = iso.split('-').map(Number)
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return `${months[mo - 1]} ${d}, ${y}`
}
