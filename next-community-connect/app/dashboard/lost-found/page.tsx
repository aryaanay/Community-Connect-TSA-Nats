'use client'

import { useState, useEffect, useCallback, useTransition, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PackageSearch, Plus, MapPin, Phone, Mail, Calendar, Check, X, Search, Upload, Sparkles, MessageCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { supabase } from '@/lib/supabaseClient'
import { useT } from '@/lib/useT'
import { JudgeNotice } from '@/components/JudgeNotice'

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
  image_url?: string
  created_at: string
}

type FilterType = 'all' | 'lost' | 'found'

const EMPTY_FORM = {
  type: 'lost' as 'lost' | 'found',
  title: '', description: '', location: '',
  contact_email: '', contact_phone: '', date_occurred: '',
}

export default function LostFoundPage() {
  const t = useT()
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

  // Photo upload state
  const fileInputRef            = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile]     = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [aiApproval, setAiApproval]   = useState<'pending' | 'approved' | 'rejected' | null>(null)
  const [generatingDesc, setGeneratingDesc] = useState(false)

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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    setImageFile(file)
    setAiApproval('pending')

    // Convert to base64 for AI review
    try {
      const base64 = await fileToBase64(file)
      const res = await fetch('/api/lost-found-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_image', imageBase64: base64, mimeType: file.type }),
      })
      const data = await res.json()
      if (data.approved === false) {
        setAiApproval('rejected')
        setImageFile(null)
      } else {
        setAiApproval('approved')
      }
    } catch {
      setAiApproval('approved') // allow on network error
    }
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Strip the data URL prefix to get raw base64
        resolve(result.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setAiApproval(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const generateDescription = async () => {
    if (!form.title.trim()) return
    setGeneratingDesc(true)
    try {
      const res = await fetch('/api/lost-found-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_description', title: form.title, type: form.type, location: form.location }),
      })
      const data = await res.json()
      if (data.description) {
        setForm(p => ({ ...p, description: data.description }))
      }
    } catch { /* silent */ } finally {
      setGeneratingDesc(false)
    }
  }

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) { setError('Sign in to post an item.'); return }
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (aiApproval === 'rejected') { setError('Please remove the rejected photo before posting.'); return }
    if (user!.id === 'demo-judge-001') { setError('The judge demo account cannot create posts.'); return }
    // Prevent future dates for date_occurred
    const todayIso = new Date().toISOString().split('T')[0]
    if (form.date_occurred && form.date_occurred > todayIso) {
      setError('Date cannot be in the future. Please choose today or a past date.')
      return
    }
    setError('')
    startTransition(async () => {
      // Ensure session JWT is attached before writing
      await supabase.auth.getSession()

      let image_url: string | undefined
      if (imageFile && aiApproval === 'approved') {
        try {
          const ext = imageFile.name.split('.').pop() ?? 'jpg'
          const path = `${user!.id}/${Date.now()}.${ext}`
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('lost-found')
            .upload(path, imageFile, { upsert: true })
          if (!uploadErr && uploadData) {
            const { data: urlData } = supabase.storage.from('lost-found').getPublicUrl(uploadData.path)
            image_url = urlData?.publicUrl
          }
        } catch { /* storage bucket may not exist — continue without image */ }
      }

      const { error: dbErr } = await supabase.from('lost_found').insert({
        user_id: user!.id,
        ...form,
        ...(image_url ? { image_url } : {}),
      })
      if (dbErr) {
        setError(`Failed to post: ${dbErr.message} (code: ${dbErr.code})`)
        return
      }
      setForm(EMPTY_FORM)
      clearImage()
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

        <JudgeNotice action="post lost or found items" />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <PackageSearch size={18} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h1 className="font-syne text-2xl font-black text-white">{t('lf.title')}</h1>
              <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.45)' }}>
                {lostCount} lost · {foundCount} found · in the Bothell community
              </p>
            </div>
          </div>
          {isSignedIn && (
            <button onClick={() => setPosting(p => !p)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#B45309,#F59E0B)', boxShadow: '0 4px 16px rgba(245,158,11,0.25)' }}>
              <Plus size={15} /> {t('lf.post_btn')}
            </button>
          )}
        </motion.div>

        {/* Post form */}
        <AnimatePresence>
          {posting && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <form onSubmit={handlePost} className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <div className="flex justify-between items-center">
                  <p className="font-syne text-sm font-bold text-white">{t('lf.form.heading')}</p>
                  <button type="button" onClick={() => { setPosting(false); setError(''); clearImage() }}><X size={15} style={{ color: 'rgba(198,235,255,0.4)' }} /></button>
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

                {/* Description with AI generate button */}
                <div className="relative">
                  <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Description (color, brand, size, distinguishing features…)" className="w-full px-4 py-2.5 pr-32 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/35 resize-none"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,158,11,0.2)' }} />
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={!form.title.trim() || generatingDesc}
                    className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-outfit text-[10px] font-bold transition-all disabled:opacity-40 hover:brightness-110"
                    style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.35)', color: '#F59E0B' }}
                    title={generatingDesc ? t('lf.ai.writing') : t('lf.ai.write')}>
                    <Sparkles size={11} />
                    {generatingDesc ? t('lf.ai.writing') : t('lf.ai.write')}
                  </button>
                </div>

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
                      max={new Date().toISOString().split('T')[0]}
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

                {/* Photo upload */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-outfit text-xs font-semibold" style={{ color: 'rgba(198,235,255,0.55)' }}>Photo (optional)</p>
                    <span className="font-outfit text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>AI-reviewed</span>
                  </div>

                  {/* Hidden file input */}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {/* AI status badge */}
                      <div className="absolute top-2 right-2">
                        {aiApproval === 'pending' && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full font-outfit text-[10px] font-bold" style={{ background: 'rgba(245,158,11,0.85)', color: '#000' }}>
                            <span className="w-2 h-2 rounded-full bg-black/40 animate-pulse" /> Reviewing…
                          </span>
                        )}
                        {aiApproval === 'approved' && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full font-outfit text-[10px] font-bold" style={{ background: 'rgba(16,185,129,0.85)', color: '#fff' }}>
                            ✅ Approved
                          </span>
                        )}
                        {aiApproval === 'rejected' && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full font-outfit text-[10px] font-bold" style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}>
                            ❌ Not suitable
                          </span>
                        )}
                      </div>
                      <button type="button" onClick={clearImage}
                        className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-black/60"
                        style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <X size={13} style={{ color: '#fff' }} />
                      </button>
                      {aiApproval === 'rejected' && (
                        <p className="absolute bottom-2 left-2 right-2 font-outfit text-[10px] text-red-300 text-center">Photo not suitable for a lost &amp; found listing — please use a different image.</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => { if (fileInputRef.current) { fileInputRef.current.removeAttribute('capture'); fileInputRef.current.click() } }}
                        className="w-full py-3 rounded-xl font-outfit text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:bg-white/5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.18)', color: 'rgba(198,235,255,0.5)' }}>
                        <Upload size={14} /> Upload File
                      </button>
                    </div>
                  )}
                </div>

                {error && <p className="font-outfit text-xs text-red-400">{error}</p>}

                <button type="submit" disabled={isPending || aiApproval === 'pending' || aiApproval === 'rejected'}
                  className="w-full py-2.5 rounded-xl font-outfit text-sm font-bold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#B45309,#F59E0B)' }}>
                  {isPending ? t('lf.posting') : aiApproval === 'pending' ? t('lf.reviewing_photo') : t('lf.post_btn')}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('lf.search_ph')}
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
            <p className="font-syne text-base font-bold text-white mb-1">{t('lf.empty.title')}</p>
            <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.4)' }}>
              {items.length === 0 ? t('lf.empty.first') : t('lf.empty.filter')}
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
  const t = useT()
  const isLost   = item.type === 'lost'
  const resolved = item.status === 'resolved'
  const accent   = isLost ? { text: '#FCA5A5', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' }
                          : { text: '#6EE7B7', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)' }

  const hasContact = item.contact_email || item.contact_phone

  return (
    <motion.div layout className="rounded-2xl overflow-hidden" style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${resolved ? 'rgba(255,255,255,0.06)' : accent.border}`,
      opacity: resolved ? 0.6 : 1,
    }}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/2 transition-colors">
        {/* Thumbnail or icon */}
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" style={{ border: `1px solid ${accent.border}` }} />
        ) : (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: accent.bg, border: `1px solid ${accent.border}` }}>
            {isLost ? '❌' : '✅'}
          </div>
        )}
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
        {/* Contact indicator (non-owner) */}
        {!isOwner && hasContact && !resolved && (
          <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(86,187,240,0.1)', border: '1px solid rgba(86,187,240,0.2)' }}>
            <MessageCircle size={12} style={{ color: '#56BBF0' }} />
          </div>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: accent.border + '40' }}>

              {/* Full image */}
              {item.image_url && (
                <div className="pt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url} alt={item.title} className="w-full max-h-52 object-cover rounded-xl" style={{ border: `1px solid ${accent.border}40` }} />
                </div>
              )}

              {item.description && (
                <p className="font-outfit text-sm pt-3 leading-relaxed" style={{ color: 'rgba(198,235,255,0.65)' }}>{item.description}</p>
              )}

              {/* Contact Poster section */}
              {!isOwner && hasContact && !resolved && (
                <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(86,187,240,0.05)', border: '1px solid rgba(86,187,240,0.15)' }}>
                  <p className="font-outfit text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(86,187,240,0.6)' }}>{t('lf.card.contact')}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.contact_email && (
                      <a href={`mailto:${item.contact_email}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs font-semibold text-sky-300 hover:bg-sky-400/10 transition-colors"
                        style={{ background: 'rgba(86,187,240,0.08)', border: '1px solid rgba(86,187,240,0.2)' }}>
                        <Mail size={12} /> {item.contact_email}
                      </a>
                    )}
                    {item.contact_phone && (
                      <a href={`tel:${item.contact_phone}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs font-semibold text-emerald-300 hover:bg-emerald-400/10 transition-colors"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <Phone size={12} /> {item.contact_phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Owner contact links */}
              {isOwner && hasContact && (
                <div className="flex flex-wrap gap-2">
                  {item.contact_email && (
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs text-sky-300/60"
                      style={{ background: 'rgba(86,187,240,0.05)', border: '1px solid rgba(86,187,240,0.12)' }}>
                      <Mail size={12} /> {item.contact_email}
                    </span>
                  )}
                  {item.contact_phone && (
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs text-emerald-300/60"
                      style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
                      <Phone size={12} /> {item.contact_phone}
                    </span>
                  )}
                </div>
              )}

              {isOwner && !resolved && (
                <button onClick={onResolve} className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-xs font-semibold transition-all hover:-translate-y-0.5" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6EE7B7' }}>
                  <Check size={13} /> {t('lf.card.resolve')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
