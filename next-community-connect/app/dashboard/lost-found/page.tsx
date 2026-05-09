'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PackageSearch, Plus, MapPin, Phone, Mail, Calendar, Check, X, AlertTriangle, Search, Filter } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { supabase } from '@/lib/supabaseClient'

type LostFoundItem = {
  id: string
  user_id: string | null
  type: 'lost' | 'found'
  title: string
  description: string
  location: string
  contact_email: string
  contact_phone: string
  date_occurred: string
  status: 'open' | 'resolved'
  created_at: string
}

type FilterType = 'all' | 'lost' | 'found'

const EMPTY_FORM = {
  type: 'lost' as 'lost' | 'found',
  title: '', description: '', location: '',
  contact_email: '', contact_phone: '', date_occurred: '',
}

export default function LostFoundPage() {
  const { user, isSignedIn } = useAuth()
  const { markPageVisited } = useAchievements()

  const [items, setItems]       = useState<LostFoundItem[]>([])
  const [loading, setLoading]   = useState(true)
  const [posting, setPosting]   = useState(false)
  const [filter, setFilter]     = useState<FilterType>('all')
  const [search, setSearch]     = useState('')
  const [form, setForm]         = useState(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()
  const [error, setError]       = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => { markPageVisited('lostfound') }, [markPageVisited])

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('lost_found')
        .select('*')
        .order('created_at', { ascending: false })
      setItems((data as LostFoundItem[]) || [])
    } catch { /* table may not exist yet */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) { setError('Sign in to post an item.'); return }
    if (!form.title.trim()) { setError('Title is required.'); return }
    setError('')
    startTransition(async () => {
      const { error: dbErr } = await supabase.from('lost_found').insert({
        user_id:       user!.id,
        ...form,
      })
      if (dbErr) {
        setError('Failed to post. Make sure the lost_found table exists (see supabase/community_features.sql).')
        return
      }
      setForm(EMPTY_FORM)
      setPosting(false)
      fetchItems()
    })
  }

  const resolveItem = async (id: string) => {
    await supabase.from('lost_found').update({ status: 'resolved' }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' } : i))
  }

  const filtered = items.filter(i => {
    if (filter !== 'all' && i.type !== filter) return false
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
        !i.description?.toLowerCase().includes(search.toLowerCase()) &&
        !i.location?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const lostCount  = items.filter(i => i.type === 'lost'  && i.status === 'open').length
  const foundCount = items.filter(i => i.type === 'found' && i.status === 'open').length

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(150deg,#011629 0%,#022747 60%,#011629 100%)' }}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <PackageSearch size={18} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h1 className="font-syne text-2xl font-black text-white">Lost & Found</h1>
              <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.45)' }}>
                {lostCount} lost · {foundCount} found · in the Bothell community
              </p>
            </div>
          </div>
          {isSignedIn && (
            <button onClick={() => setPosting(p => !p)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#B45309,#F59E0B)', boxShadow: '0 4px 16px rgba(245,158,11,0.25)' }}>
              <Plus size={15} /> Post Item
            </button>
          )}
        </motion.div>

        {/* Post form */}
        <AnimatePresence>
          {posting && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <form onSubmit={handlePost} className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <div className="flex justify-between items-center">
                  <p className="font-syne text-sm font-bold text-white">Post an Item</p>
                  <button type="button" onClick={() => { setPosting(false); setError('') }}><X size={15} style={{ color: 'rgba(198,235,255,0.4)' }} /></button>
                </div>

                {/* Lost / Found toggle */}
                <div className="flex gap-2">
                  {(['lost', 'found'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                      className="flex-1 py-2.5 rounded-xl font-outfit text-sm font-semibold transition-all capitalize"
                      style={{
                        background: form.type === t ? (t === 'lost' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)') : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.type === t ? (t === 'lost' ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)') : 'rgba(245,158,11,0.15)'}`,
                        color: form.type === t ? (t === 'lost' ? '#FCA5A5' : '#6EE7B7') : 'rgba(198,235,255,0.45)',
                      }}>
                      {t === 'lost' ? '❌' : '✅'} {t.charAt(0).toUpperCase() + t.slice(1)} Item
                    </button>
                  ))}
                </div>

                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Item name / title *" className="w-full px-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/35"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.2)' }} />

                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Description (color, brand, size, distinguishing features…)" className="w-full px-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/35 resize-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.2)' }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="Last seen / found location"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.2)' }} />
                  </div>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input type="date" value={form.date_occurred} onChange={e => setForm(p => ({ ...p, date_occurred: e.target.value }))}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.2)', colorScheme: 'dark' }} />
                  </div>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))}
                      placeholder="Contact email"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.2)' }} />
                  </div>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
                    <input value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))}
                      placeholder="Contact phone"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/35"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.2)' }} />
                  </div>
                </div>

                {error && <p className="font-outfit text-xs text-red-400">{error}</p>}

                <button type="submit" disabled={isPending}
                  className="w-full py-2.5 rounded-xl font-outfit text-sm font-bold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#B45309,#F59E0B)' }}>
                  {isPending ? 'Posting…' : 'Post Item'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/35"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.18)' }} />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'lost', 'found'] as FilterType[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2.5 rounded-xl font-outfit text-xs font-semibold capitalize transition-all"
                style={{
                  background: filter === f ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${filter === f ? 'rgba(245,158,11,0.4)' : 'rgba(245,158,11,0.12)'}`,
                  color: filter === f ? '#F59E0B' : 'rgba(198,235,255,0.5)',
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-5 h-5 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <PackageSearch size={36} className="mx-auto mb-3 opacity-20" style={{ color: '#F59E0B' }} />
            <p className="font-syne text-base font-bold text-white mb-1">No items found</p>
            <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.4)' }}>
              {items.length === 0 ? 'Be the first to post!' : 'Try a different search or filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                isOwner={item.user_id === user?.id}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                onResolve={() => resolveItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ItemCard({ item, isOwner, expanded, onToggle, onResolve }: {
  item: LostFoundItem; isOwner: boolean; expanded: boolean
  onToggle: () => void; onResolve: () => void
}) {
  const isLost   = item.type === 'lost'
  const resolved = item.status === 'resolved'
  const accent   = isLost ? { text: '#FCA5A5', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' }
                          : { text: '#6EE7B7', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)' }

  return (
    <motion.div layout className="rounded-2xl overflow-hidden" style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${resolved ? 'rgba(255,255,255,0.06)' : accent.border}`,
      opacity: resolved ? 0.6 : 1,
    }}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/2 transition-colors">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: accent.bg, border: `1px solid ${accent.border}` }}>
          {isLost ? '❌' : '✅'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-syne text-sm font-bold text-white truncate">{item.title}</p>
            <span className="font-outfit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: accent.bg, border: `1px solid ${accent.border}`, color: accent.text }}>
              {resolved ? 'Resolved' : item.type}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {item.location && (
              <span className="flex items-center gap-1 font-outfit text-[11px]" style={{ color: 'rgba(198,235,255,0.45)' }}>
                <MapPin size={9} /> {item.location}
              </span>
            )}
            {item.date_occurred && (
              <span className="flex items-center gap-1 font-outfit text-[11px]" style={{ color: 'rgba(198,235,255,0.35)' }}>
                <Calendar size={9} /> {item.date_occurred}
              </span>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: accent.border + '40' }}>
              {item.description && (
                <p className="font-outfit text-sm pt-3 leading-relaxed" style={{ color: 'rgba(198,235,255,0.65)' }}>{item.description}</p>
              )}

              <div className="flex flex-wrap gap-3">
                {item.contact_email && (
                  <a href={`mailto:${item.contact_email}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs font-semibold text-sky-300 hover:bg-sky-400/10 transition-colors" style={{ background: 'rgba(86,187,240,0.08)', border: '1px solid rgba(86,187,240,0.2)' }}>
                    <Mail size={12} /> {item.contact_email}
                  </a>
                )}
                {item.contact_phone && (
                  <a href={`tel:${item.contact_phone}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs font-semibold text-emerald-300 hover:bg-emerald-400/10 transition-colors" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Phone size={12} /> {item.contact_phone}
                  </a>
                )}
              </div>

              {isOwner && !resolved && (
                <button onClick={onResolve} className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-xs font-semibold transition-all hover:-translate-y-0.5" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6EE7B7' }}>
                  <Check size={13} /> Mark as Resolved
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
