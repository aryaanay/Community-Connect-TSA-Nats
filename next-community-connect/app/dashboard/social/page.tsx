'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users2, Search, Mail, UserPlus, Check, Globe, Lock, Edit3, Save, X, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { useT } from '@/lib/useT'
import { supabase } from '@/lib/supabaseClient'

type Profile = {
  id: string
  user_id: string
  display_name: string
  email: string
  bio: string
  is_public: boolean
}

const CONNECTIONS_KEY = 'cc-connections'

function loadConnections(): string[] {
  try { return JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]') } catch { return [] }
}
function saveConnections(c: string[]) {
  try { localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(c)) } catch { /* ignore */ }
}

export default function SocialPage() {
  const { user, isSignedIn } = useAuth()
  const { unlock, markPageVisited } = useAchievements()
  const t = useT()

  const [profiles, setProfiles]     = useState<Profile[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [connections, setConnections] = useState<string[]>([])
  const [myProfile, setMyProfile]   = useState<Profile | null>(null)
  const [editing, setEditing]       = useState(false)
  const [form, setForm]             = useState({ display_name: '', bio: '', is_public: true })
  const [saving, setSaving]         = useState(false)
  const [tab, setTab]               = useState<'directory' | 'connections'>('directory')

  useEffect(() => { markPageVisited('social') }, [markPageVisited])

  useEffect(() => {
    setConnections(loadConnections())
  }, [])

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)
        .order('display_name')
      setProfiles((data as Profile[]) || [])

      if (user) {
        const { data: mine } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        if (mine) {
          setMyProfile(mine as Profile)
          setForm({ display_name: mine.display_name, bio: mine.bio || '', is_public: mine.is_public })
        }
      }
    } catch { /* table may not exist yet */ } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  const saveProfile = async () => {
    if (!user || !form.display_name.trim()) return
    setSaving(true)
    const payload = { user_id: user.id, email: user.email!, ...form }
    if (myProfile) {
      await supabase.from('profiles').update(payload).eq('user_id', user.id)
    } else {
      await supabase.from('profiles').insert(payload)
    }
    setSaving(false)
    setEditing(false)
    fetchProfiles()
  }

  const toggleConnect = (email: string) => {
    setConnections(prev => {
      const next = prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
      saveConnections(next)
      return next
    })
  }

  const filtered = profiles
    .filter(p => p.user_id !== user?.id)
    .filter(p => !search || p.display_name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()))

  const myConnections = profiles.filter(p => connections.includes(p.email))
  const externalConnections = connections.filter(email => !profiles.find(p => p.email === email))

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(150deg,#011629 0%,#022747 60%,#011629 100%)' }}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(86,187,240,0.15)', border: '1px solid rgba(86,187,240,0.3)' }}>
              <Users2 size={18} style={{ color: '#56BBF0' }} />
            </div>
            <h1 className="font-syne text-2xl font-black text-white">{t('social.title')}</h1>
          </div>
          <p className="font-outfit text-sm ml-12" style={{ color: 'rgba(198,235,255,0.45)' }}>
            {t('social.subtitle')}
          </p>
        </motion.div>

        {/* My Profile card */}
        {isSignedIn && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-2xl p-5" style={{ background: 'rgba(86,187,240,0.07)', border: '1px solid rgba(86,187,240,0.18)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-syne text-sm font-bold text-white">{t('social.my_profile')}</p>
              <button onClick={() => setEditing(e => !e)} className="flex items-center gap-1.5 font-outfit text-xs transition-colors hover:text-sky-300" style={{ color: 'rgba(198,235,255,0.5)' }}>
                {editing ? <X size={13} /> : <Edit3 size={13} />}
                {editing ? t('social.cancel') : (myProfile ? t('social.edit') : t('social.create_profile'))}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <input value={form.display_name} onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                    placeholder={t('social.display_ph')} className="w-full px-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.2)' }} />
                  <textarea rows={2} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder={t('social.bio_ph')} className="w-full px-3 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35 resize-none"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.2)' }} />
                  {user?.email === 'judges@tsa.com' && (
                    <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="font-outfit text-xs" style={{ color: 'rgba(245,158,11,0.9)' }}>
                          <strong>Demo Account</strong><br />
                          The judge account cannot create a saved profile. To fully test this feature, create a free account using any real email on the sign-in page.
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setForm(p => ({ ...p, is_public: !p.is_public }))}
                      className="flex items-center gap-1.5 font-outfit text-xs transition-colors"
                      style={{ color: form.is_public ? '#56BBF0' : 'rgba(198,235,255,0.4)' }}>
                      {form.is_public ? <Globe size={13} /> : <Lock size={13} />}
                      {form.is_public ? t('social.visible') : t('social.hidden')}
                    </button>
                    <button onClick={saveProfile} disabled={saving || !form.display_name.trim()}
                      className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-xs font-semibold text-white transition-all disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg,#0857A0,#2499D6)' }}>
                      <Save size={12} /> {saving ? t('social.saving') : t('social.save')}
                    </button>
                  </div>
                </motion.div>
              ) : myProfile ? (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="font-syne text-base font-bold text-white">{myProfile.display_name}</p>
                  {myProfile.bio && <p className="font-outfit text-xs mt-0.5" style={{ color: 'rgba(198,235,255,0.55)' }}>{myProfile.bio}</p>}
                  <p className="font-outfit text-xs mt-1 flex items-center gap-1" style={{ color: 'rgba(198,235,255,0.35)' }}>
                    {myProfile.is_public ? <Globe size={11} /> : <Lock size={11} />}
                    {myProfile.is_public ? t('social.visible_dir') : t('social.hidden')}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.45)' }}>
                    {t('social.create_hint')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(86,187,240,0.1)' }}>
          {(['directory', 'connections'] as const).map(tabId => (
            <button key={tabId} onClick={() => setTab(tabId)}
              className="relative flex-1 py-2 rounded-lg font-outfit text-sm font-semibold transition-colors"
              style={{ color: tab === tabId ? 'white' : 'rgba(198,235,255,0.4)' }}>
              {tab === tabId && (
                <motion.div layoutId="social-tab" className="absolute inset-0 rounded-lg"
                  style={{ background: 'rgba(36,153,214,0.25)', border: '1px solid rgba(86,187,240,0.3)' }}
                  transition={{ duration: 0.2 }} />
              )}
              <span className="relative z-10 capitalize">
                {tabId === 'directory' ? t('social.directory') : `${t('social.my_connections')} (${connections.length})`}
              </span>
            </button>
          ))}
        </div>

        {tab === 'directory' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('social.search_ph')}
                className="w-full pl-10 pr-4 py-3 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/35"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.18)' }} />
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="w-5 h-5 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Users2 size={32} className="mx-auto mb-3" style={{ color: 'rgba(198,235,255,0.2)' }} />
                <p className="font-syne text-base font-bold text-white mb-1">{t('social.no_profiles')}</p>
                <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.4)' }}>
                  {search ? t('social.try_search') : t('social.be_first')}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(p => (
                  <ProfileCard key={p.id} profile={p} connected={connections.includes(p.email)} onToggle={() => toggleConnect(p.email)} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'connections' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {connections.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-syne text-base font-bold text-white mb-1">{t('social.no_connections')}</p>
                <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.4)' }}>{t('social.no_connections_sub')}</p>
              </div>
            ) : (
              <>
                {myConnections.map(p => (
                  <ProfileCard key={p.id} profile={p} connected onToggle={() => toggleConnect(p.email)} />
                ))}
                {externalConnections.map(email => (
                  <div key={email} className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(86,187,240,0.1)' }}>
                    <div>
                      <p className="font-outfit text-sm text-white">{email}</p>
                      <p className="font-outfit text-[11px]" style={{ color: 'rgba(198,235,255,0.35)' }}>{t('social.not_in_dir')}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`mailto:${email}`} className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-outfit text-xs text-sky-300 transition-colors hover:bg-sky-400/10">
                        <Mail size={12} /> {t('social.email')}
                      </a>
                      <button onClick={() => toggleConnect(email)} className="px-3 py-1.5 rounded-xl font-outfit text-xs text-red-300 hover:bg-red-400/10 transition-colors">
                        {t('social.remove')}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function ProfileCard({ profile, connected, onToggle }: { profile: Profile; connected: boolean; onToggle: () => void }) {
  const t = useT()
  const initials = profile.display_name.slice(0, 2).toUpperCase()
  return (
    <motion.div whileHover={{ y: -1 }} className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(86,187,240,0.1)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-syne text-sm font-black text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,rgba(86,187,240,0.3),rgba(86,187,240,0.1))', border: '1px solid rgba(86,187,240,0.3)' }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-syne text-sm font-bold text-white truncate">{profile.display_name}</p>
        {profile.bio && <p className="font-outfit text-[11px] truncate" style={{ color: 'rgba(198,235,255,0.45)' }}>{profile.bio}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <a href={`mailto:${profile.email}`} title={`Email ${profile.display_name}`}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-sky-400/12"
          style={{ color: 'rgba(198,235,255,0.5)' }}>
          <Mail size={14} />
        </a>
        <button onClick={onToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-outfit text-xs font-semibold transition-all"
          style={{
            background: connected ? 'rgba(16,185,129,0.15)' : 'rgba(86,187,240,0.1)',
            border: `1px solid ${connected ? 'rgba(16,185,129,0.35)' : 'rgba(86,187,240,0.25)'}`,
            color: connected ? '#10B981' : '#56BBF0',
          }}>
          {connected ? <><Check size={11} /> {t('social.connected')}</> : <><UserPlus size={11} /> {t('social.connect')}</>}
        </button>
      </div>
    </motion.div>
  )
}
