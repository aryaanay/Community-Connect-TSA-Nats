'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HandHeart, Plus, MapPin, Phone, Mail, DollarSign, Check, X, Search, Star } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { supabase } from '@/lib/supabaseClient'
import { useT } from '@/lib/useT'
import { JudgeNotice } from '@/components/JudgeNotice'

type Favor = {
  id: string
  user_id: string | null
  title: string
  description: string
  location: string
  pay_amount: string
  contact_email: string
  contact_phone: string
  status: 'open' | 'done'
  created_at: string
}

const EMPTY_FORM = {
  title: '', description: '', location: '',
  pay_amount: '', contact_email: '', contact_phone: '',
}

export default function FavorsPage() {
  const t = useT()
  const { user, isSignedIn } = useAuth()
  const { markPageVisited, unlock } = useAchievements()

  const [favors, setFavors]     = useState<Favor[]>([])
  const [loading, setLoading]   = useState(true)
  const [posting, setPosting]   = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [search, setSearch]     = useState('')
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [helpedIds, setHelpedIds]   = useState<Set<string>>(new Set())

  useEffect(() => { markPageVisited('favors') }, [markPageVisited])

  const fetchFavors = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('favors')
        .select('*')
        .order('created_at', { ascending: false })
      setFavors((data as Favor[]) || [])
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [])

  // Load which favors this user has already helped with
  const fetchHelpedIds = useCallback(async () => {
    if (!user || user.id === 'demo-judge-001') return
    await supabase.auth.getSession()
    const { data } = await supabase
      .from('favor_helps')
      .select('favor_id')
      .eq('helper_id', user.id)
    if (data) setHelpedIds(new Set(data.map((r: { favor_id: string }) => r.favor_id)))
  }, [user])

  useEffect(() => { fetchFavors() }, [fetchFavors])
  useEffect(() => { fetchHelpedIds() }, [fetchHelpedIds])

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) { setError('Sign in to post a favor.'); return }
    if (user!.id === 'demo-judge-001') { setError('The judge demo account cannot post favors.'); return }
    if (!form.title.trim()) { setError('Title is required.'); return }
    setError('')
    setSaving(true)

    await supabase.auth.getSession()
    const { error: dbErr } = await supabase.from('favors').insert({
      user_id: user!.id,
      ...form,
    })

    setSaving(false)
    if (dbErr) { setError(`Failed to post: ${dbErr.message}`); return }

    unlock('favor_posted')
    setForm(EMPTY_FORM)
    setPosting(false)
    fetchFavors()
  }

  const handleHelp = async (favor: Favor) => {
    if (!isSignedIn) { setError('Sign in to help.'); return }
    if (user!.id === 'demo-judge-001') return
    if (favor.user_id === user!.id) return
    if (helpedIds.has(favor.id)) return

    await supabase.auth.getSession()
    const { error: dbErr } = await supabase.from('favor_helps').insert({
      favor_id: favor.id,
      helper_id: user!.id,
    })
    if (dbErr) return

    const newIds = new Set(helpedIds).add(favor.id)
    setHelpedIds(newIds)

    // Count total helps and unlock achievements
    const { count } = await supabase
      .from('favor_helps')
      .select('*', { count: 'exact', head: true })
      .eq('helper_id', user!.id)

    const total = count ?? newIds.size
    unlock('first_helper')
    if (total >= 3)  unlock('helper_3')
    if (total >= 10) unlock('helper_10')
    if (total >= 25) unlock('super_helper')
  }

  const markDone = async (id: string) => {
    await supabase.from('favors').update({ status: 'done' }).eq('id', id)
    setFavors(prev => prev.map(f => f.id === id ? { ...f, status: 'done' } : f))
  }

  const filtered = favors.filter(f =>
    !search ||
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.description?.toLowerCase().includes(search.toLowerCase()) ||
    f.location?.toLowerCase().includes(search.toLowerCase())
  )

  const openCount = favors.filter(f => f.status === 'open').length

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-8 py-8"
      style={{ background: 'linear-gradient(150deg,#011629 0%,#022747 60%,#011629 100%)' }}>
      <div className="max-w-3xl mx-auto space-y-5">

        <JudgeNotice action="post or help with favors" />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <HandHeart size={18} style={{ color: '#10B981' }} />
            </div>
            <div>
              <h1 className="font-syne text-2xl font-black text-white">{t('fav.title')}</h1>
              <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.45)' }}>
                {openCount} {t('fav.open_help')}
              </p>
            </div>
          </div>
          {isSignedIn && (
            <button onClick={() => setPosting(p => !p)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#059669,#10B981)', boxShadow: '0 4px 16px rgba(16,185,129,0.25)' }}>
              <Plus size={15} /> {t('fav.ask_btn')}
            </button>
          )}
        </motion.div>

        {/* Post form */}
        <AnimatePresence>
          {posting && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <form onSubmit={handlePost} className="rounded-2xl p-5 space-y-3"
                style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div className="flex justify-between items-center">
                  <p className="font-syne text-sm font-bold text-white">{t('fav.form.heading')}</p>
                  <button type="button" onClick={() => { setPosting(false); setError('') }}>
                    <X size={15} style={{ color: 'rgba(198,235,255,0.4)' }} />
                  </button>
                </div>

                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder={t('fav.form.title_ph')}
                  className="w-full px-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400/35"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(16,185,129,0.2)' }} />

                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder={t('fav.form.desc_ph')}
                  className="w-full px-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400/35 resize-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(16,185,129,0.2)' }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="Location"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(16,185,129,0.2)' }} />
                  </div>
                  <div className="relative">
                    <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input value={form.pay_amount} onChange={e => setForm(p => ({ ...p, pay_amount: e.target.value }))}
                      placeholder={t('fav.form.pay_ph')}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(16,185,129,0.2)' }} />
                  </div>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))}
                      placeholder="Contact email"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(16,185,129,0.2)' }} />
                  </div>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))}
                      placeholder="Contact phone"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(16,185,129,0.2)' }} />
                  </div>
                </div>

                {error && <p className="font-outfit text-xs text-red-400">{error}</p>}

                <button type="submit" disabled={saving}
                  className="w-full py-2.5 rounded-xl font-outfit text-sm font-bold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#059669,#10B981)' }}>
                  {saving ? t('fav.status.posting') : t('fav.form.post')}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('fav.search_ph')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-emerald-400/35"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(16,185,129,0.18)' }} />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-5 h-5 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <HandHeart size={36} className="mx-auto mb-3 opacity-20" style={{ color: '#10B981' }} />
            <p className="font-syne text-base font-bold text-white mb-1">{t('fav.empty.title')}</p>
            <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.4)' }}>
              {favors.length === 0 ? t('fav.empty.first') : t('fav.empty.filter')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(favor => (
              <FavorCard
                key={favor.id}
                favor={favor}
                isOwner={favor.user_id === user?.id}
                hasHelped={helpedIds.has(favor.id)}
                expanded={expandedId === favor.id}
                onToggle={() => setExpandedId(expandedId === favor.id ? null : favor.id)}
                onHelp={() => handleHelp(favor)}
                onDone={() => markDone(favor.id)}
                isSignedIn={isSignedIn}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FavorCard({ favor, isOwner, hasHelped, expanded, onToggle, onHelp, onDone, isSignedIn }: {
  favor: Favor; isOwner: boolean; hasHelped: boolean; expanded: boolean
  onToggle: () => void; onHelp: () => void; onDone: () => void; isSignedIn: boolean
}) {
  const t = useT()
  const done = favor.status === 'done'
  const hasContact = favor.contact_email || favor.contact_phone

  return (
    <motion.div layout className="rounded-2xl overflow-hidden" style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${done ? 'rgba(255,255,255,0.06)' : 'rgba(16,185,129,0.3)'}`,
      opacity: done ? 0.6 : 1,
    }}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/2 transition-colors">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
          🤝
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-syne text-sm font-bold text-white truncate">{favor.title}</p>
            {done && (
              <span className="font-outfit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6EE7B7' }}>
                {t('fav.status.done')}
              </span>
            )}
            {favor.pay_amount && !done && (
              <span className="font-outfit text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6EE7B7' }}>
                {favor.pay_amount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {favor.location && (
              <span className="flex items-center gap-1 font-outfit text-[11px]" style={{ color: 'rgba(198,235,255,0.45)' }}>
                <MapPin size={9} /> {favor.location}
              </span>
            )}
          </div>
        </div>
        {!isOwner && !done && isSignedIn && (
          <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: hasHelped ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.08)',
              border: `1px solid ${hasHelped ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.2)'}`,
            }}>
            {hasHelped
              ? <Check size={12} style={{ color: '#6EE7B7' }} />
              : <Star size={12} style={{ color: '#6EE7B7' }} />}
          </div>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>

              {favor.description && (
                <p className="font-outfit text-sm pt-3 leading-relaxed" style={{ color: 'rgba(198,235,255,0.65)' }}>
                  {favor.description}
                </p>
              )}

              {/* Contact / Help section for non-owners */}
              {!isOwner && hasContact && !done && (
                <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}>
                  <div className="flex items-center justify-between">
                    <p className="font-outfit text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(16,185,129,0.7)' }}>
                      {t('fav.card.contact')}
                    </p>
                    {isSignedIn && !hasHelped && (
                      <button onClick={onHelp}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-outfit text-[11px] font-bold transition-all hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff' }}>
                        <Star size={10} /> {t('fav.card.help')}
                      </button>
                    )}
                    {hasHelped && (
                      <span className="flex items-center gap-1 font-outfit text-[11px] font-bold" style={{ color: '#6EE7B7' }}>
                        <Check size={11} /> {t('fav.card.helping')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favor.contact_email && (
                      <a href={`mailto:${favor.contact_email}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs font-semibold text-emerald-300 hover:bg-emerald-400/10 transition-colors"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <Mail size={12} /> {favor.contact_email}
                      </a>
                    )}
                    {favor.contact_phone && (
                      <a href={`tel:${favor.contact_phone}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs font-semibold text-emerald-300 hover:bg-emerald-400/10 transition-colors"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <Phone size={12} /> {favor.contact_phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Owner contact display */}
              {isOwner && hasContact && (
                <div className="flex flex-wrap gap-2">
                  {favor.contact_email && (
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs text-emerald-300/60"
                      style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
                      <Mail size={12} /> {favor.contact_email}
                    </span>
                  )}
                  {favor.contact_phone && (
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs text-emerald-300/60"
                      style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
                      <Phone size={12} /> {favor.contact_phone}
                    </span>
                  )}
                </div>
              )}

              {isOwner && !done && (
                <button onClick={onDone}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-xs font-semibold transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6EE7B7' }}>
                  <Check size={13} /> {t('fav.card.done_btn')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
