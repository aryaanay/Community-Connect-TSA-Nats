'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useAchievements, ACHIEVEMENTS, TOTAL_POSSIBLE_XP, Achievement } from '@/context/AchievementsContext'
import { supabase } from '@/lib/supabaseClient'
import { Lock, Edit3, Save, X, Camera, Users2, AlertTriangle, RotateCcw } from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const JUDGE_EMAIL = 'judges@tsa.com'

const LEVELS = [
  { min: 0,    max: 99,   level: 1, title: 'Community Newcomer', color: '#56BBF0' },
  { min: 100,  max: 299,  level: 2, title: 'Active Member',      color: '#10B981' },
  { min: 300,  max: 599,  level: 3, title: 'Resource Champion',  color: '#8B5CF6' },
  { min: 600,  max: 999,  level: 4, title: 'Community Hero',     color: '#F59E0B' },
  { min: 1000, max: Infinity, level: 5, title: 'Local Legend',   color: '#EC4899' },
]

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, legendary: 3 }

const RARITY_STYLE = {
  common:    { label: 'Common',    text: '#56BBF0', bg: 'rgba(86,187,240,0.12)',  border: 'rgba(86,187,240,0.3)'  },
  uncommon:  { label: 'Uncommon',  text: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'  },
  rare:      { label: 'Rare',      text: '#A78BFA', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.3)'  },
  legendary: { label: 'Legendary', text: '#FCD34D', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLevelInfo(xp: number) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) ?? LEVELS[LEVELS.length - 1]
}
function getNextLevel(current: number) {
  return LEVELS.find(l => l.level === current + 1)
}
function loadAvatar(userId: string): string | null {
  try { return localStorage.getItem(`cc-avatar-${userId}`) } catch { return null }
}
function saveAvatarLocal(userId: string, dataUrl: string) {
  try { localStorage.setItem(`cc-avatar-${userId}`, dataUrl) } catch {}
}
function loadConnections(): string[] {
  try { return JSON.parse(localStorage.getItem('cc-connections') || '[]') } catch { return [] }
}

// ─── Achievement card ─────────────────────────────────────────────────────────

function AchievementCard({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
  const rs = RARITY_STYLE[achievement.rarity]
  return (
    <motion.div
      whileHover={unlocked ? { y: -3, scale: 1.02 } : {}}
      className="relative rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200"
      style={{
        background: unlocked
          ? `linear-gradient(145deg, ${rs.bg}, rgba(255,255,255,0.02))`
          : 'rgba(255,255,255,0.02)',
        border: unlocked ? `1px solid ${rs.border}` : '1px solid rgba(255,255,255,0.06)',
        opacity: unlocked ? 1 : 0.45,
      }}
    >
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ backdropFilter: 'blur(1px)' }}>
          <Lock size={18} style={{ color: 'rgba(198,235,255,0.2)' }} />
        </div>
      )}
      <div className="flex items-start justify-between">
        <span className="text-3xl" style={{ filter: unlocked ? `drop-shadow(0 0 12px ${rs.text}60)` : 'grayscale(1)' }}>
          {achievement.emoji}
        </span>
        <span className="font-outfit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: rs.bg, border: `1px solid ${rs.border}`, color: rs.text }}>
          {rs.label}
        </span>
      </div>
      <div>
        <p className="font-syne text-sm font-bold text-white leading-tight">{achievement.title}</p>
        <p className="font-outfit text-[11px] mt-1 leading-relaxed" style={{ color: 'rgba(198,235,255,0.5)' }}>
          {achievement.description}
        </p>
      </div>
      <div className="mt-auto pt-1">
        <span className="font-outfit text-[10px] font-semibold" style={{ color: unlocked ? rs.text : 'rgba(198,235,255,0.25)' }}>
          {unlocked ? `+${achievement.xp} XP earned` : `${achievement.xp} XP · Locked`}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuth()
  const { unlocked, totalXp, markPageVisited } = useAchievements()

  // Profile fields
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio]                 = useState('')
  const [isPublic, setIsPublic]       = useState(true)
  const [avatarUrl, setAvatarUrl]     = useState<string | null>(null)
  const [editing, setEditing]         = useState(false)
  const [saving, setSaving]           = useState(false)
  const [saveError, setSaveError]     = useState('')
  const [connections, setConnections] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const isJudge = user?.email === JUDGE_EMAIL

  useEffect(() => { markPageVisited('profile') }, [markPageVisited])

  // Load avatar from localStorage
  useEffect(() => {
    if (!user?.id) return
    const saved = loadAvatar(user.id)
    if (saved) setAvatarUrl(saved)
  }, [user?.id])

  // Load connections count
  useEffect(() => { setConnections(loadConnections()) }, [])

  // Load profile from Supabase
  useEffect(() => {
    if (!user?.id) return
    ;(async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('display_name, bio, is_public')
          .eq('user_id', user.id)
          .maybeSingle()
        if (data) {
          setDisplayName(data.display_name || '')
          setBio(data.bio || '')
          setIsPublic(data.is_public ?? true)
        } else {
          setDisplayName(user.email?.split('@')[0] ?? '')
        }
      } catch {
        setDisplayName(user.email?.split('@')[0] ?? '')
      }
    })()
  }, [user?.id, user?.email])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setAvatarUrl(dataUrl)
      saveAvatarLocal(user.id, dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!user?.id) return
    setSaving(true)
    setSaveError('')
    try {
      await supabase.from('profiles').upsert({
        user_id: user.id,
        email: user.email ?? '',
        display_name: displayName.trim() || (user.email?.split('@')[0] ?? 'User'),
        bio: bio.trim(),
        is_public: isPublic,
      }, { onConflict: 'user_id' })
      setEditing(false)
    } catch {
      setSaveError('Could not save. Try again.')
    }
    setSaving(false)
  }

  const levelInfo   = getLevelInfo(totalXp)
  const nextLevel   = getNextLevel(levelInfo.level)
  const xpIntoLevel = totalXp - levelInfo.min
  const xpForLevel  = nextLevel ? nextLevel.min - levelInfo.min : totalXp - levelInfo.min || 1
  const levelPct    = nextLevel ? Math.min(100, (xpIntoLevel / xpForLevel) * 100) : 100

  const initials = (displayName || user?.email?.split('@')[0] || 'U').slice(0, 2).toUpperCase()
  const sortedAchievements = [...ACHIEVEMENTS].sort(
    (a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]
  )

  return (
    <div
      className="min-h-full px-4 sm:px-6 lg:px-8 py-8"
      style={{ background: 'linear-gradient(150deg, #011629 0%, #022747 60%, #011629 100%)' }}
    >
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Judge warning banner */}
        {isJudge && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-2xl px-5 py-4"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)' }}
          >
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#FCD34D' }} />
            <div>
              <p className="font-syne text-sm font-bold" style={{ color: '#FCD34D' }}>
                Hey, Judge! — This is the shared demo account.
              </p>
              <p className="font-outfit text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(252,211,77,0.75)' }}>
                Feel free to explore the profile editor, but please don't change the password, delete the account, or submit anything permanent. We appreciate it!
              </p>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('cc-achievements')
                    localStorage.removeItem('cc-visited-pages')
                    window.location.reload()
                  } catch {}
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-outfit text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#FCD34D' }}
              >
                <RotateCcw size={11} /> Reset achievements for demo
              </button>
            </div>
          </motion.div>
        )}

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(2,39,71,0.6)',
            border: '1px solid rgba(86,187,240,0.18)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse at 10% 50%, ${levelInfo.color}18 0%, transparent 60%)`,
          }} />

          <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-syne text-2xl font-black text-white overflow-hidden"
                style={{
                  background: avatarUrl ? undefined : `linear-gradient(135deg, ${levelInfo.color}50, ${levelInfo.color}20)`,
                  border: `2px solid ${levelInfo.color}50`,
                  boxShadow: `0 8px 32px ${levelInfo.color}30`,
                }}
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  : initials
                }
              </div>
              {editing && (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: '#0ea5e9', border: '2px solid #022747' }}
                  >
                    <Camera size={13} className="text-white" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="font-outfit text-[10px] uppercase tracking-wider mb-1 block" style={{ color: 'rgba(198,235,255,0.4)' }}>Display Name</label>
                    <input
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      maxLength={40}
                      className="w-full rounded-xl px-3 py-2 font-outfit text-sm text-white outline-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.25)' }}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="font-outfit text-[10px] uppercase tracking-wider mb-1 block" style={{ color: 'rgba(198,235,255,0.4)' }}>Bio</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      maxLength={160}
                      rows={2}
                      className="w-full rounded-xl px-3 py-2 font-outfit text-sm text-white outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.25)' }}
                      placeholder="A short bio (160 chars)"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPublic(p => !p)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-outfit text-xs transition-all"
                      style={{
                        background: isPublic ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                        border: isPublic ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.1)',
                        color: isPublic ? '#10B981' : 'rgba(198,235,255,0.4)',
                      }}
                    >
                      {isPublic ? 'Public profile' : 'Private profile'}
                    </button>
                    {saveError && <span className="font-outfit text-xs text-red-400">{saveError}</span>}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-white transition-all disabled:opacity-60"
                      style={{ background: 'rgba(14,165,233,0.85)', border: '1px solid rgba(86,187,240,0.4)' }}
                    >
                      <Save size={13} />
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setSaveError('') }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(198,235,255,0.6)' }}
                    >
                      <X size={13} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="font-syne text-2xl font-black text-white truncate">
                      {displayName || user?.email?.split('@')[0] || 'User'}
                    </h1>
                    <span
                      className="font-outfit text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: `${levelInfo.color}20`, border: `1px solid ${levelInfo.color}50`, color: levelInfo.color }}
                    >
                      Lv.{levelInfo.level} · {levelInfo.title}
                    </span>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-outfit text-xs transition-all"
                      style={{ background: 'rgba(86,187,240,0.10)', border: '1px solid rgba(86,187,240,0.22)', color: 'rgba(198,235,255,0.65)' }}
                    >
                      <Edit3 size={11} />
                      Edit
                    </button>
                  </div>
                  <p className="font-outfit text-sm mb-1" style={{ color: 'rgba(198,235,255,0.45)' }}>
                    {user?.email}
                  </p>
                  {bio && (
                    <p className="font-outfit text-sm mb-3 leading-relaxed" style={{ color: 'rgba(198,235,255,0.65)' }}>
                      {bio}
                    </p>
                  )}

                  {/* XP bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.5)' }}>
                        {totalXp} XP{nextLevel && <> · {nextLevel.min - totalXp} XP to Lv.{nextLevel.level}</>}
                      </span>
                      <span className="font-outfit text-xs font-semibold" style={{ color: levelInfo.color }}>
                        {nextLevel ? `${Math.round(levelPct)}%` : 'MAX LEVEL'}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${levelInfo.color}99, ${levelInfo.color})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${levelPct}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: 'Total XP',     value: totalXp.toLocaleString(),                              color: levelInfo.color },
            { label: 'Achievements', value: `${unlocked.length} / ${ACHIEVEMENTS.length}`,          color: '#10B981' },
            { label: 'Completion',   value: `${Math.round((totalXp / TOTAL_POSSIBLE_XP) * 100)}%`, color: '#8B5CF6' },
            { label: 'Connections',  value: String(connections.length),                             color: '#56BBF0', href: '/dashboard/social' },
          ].map(({ label, value, color, href }) => {
            const inner = (
              <div className="rounded-2xl p-4 text-center h-full transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(86,187,240,0.1)' }}>
                <p className="font-syne text-xl font-black" style={{ color }}>{value}</p>
                <p className="font-outfit text-[11px] mt-0.5" style={{ color: 'rgba(198,235,255,0.45)' }}>{label}</p>
              </div>
            )
            return href
              ? <Link key={label} href={href} className="hover:scale-[1.03] transition-transform">{inner}</Link>
              : <div key={label}>{inner}</div>
          })}
        </motion.div>

        {/* Friends shortcut */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <Link
            href="/dashboard/social"
            className="flex items-center justify-between rounded-2xl px-5 py-4 transition-all hover:border-sky-400/30 group"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(86,187,240,0.12)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(86,187,240,0.12)', border: '1px solid rgba(86,187,240,0.22)' }}>
                <Users2 size={16} style={{ color: '#56BBF0' }} />
              </div>
              <div>
                <p className="font-syne text-sm font-bold text-white">Friends &amp; Connections</p>
                <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.45)' }}>
                  {connections.length > 0
                    ? `${connections.length} connection${connections.length !== 1 ? 's' : ''} · Manage in Community Directory`
                    : 'Find and connect with neighbors in the Community Directory'}
                </p>
              </div>
            </div>
            <span className="font-outfit text-xs px-3 py-1.5 rounded-lg transition-all group-hover:border-sky-400/40"
              style={{ background: 'rgba(86,187,240,0.10)', border: '1px solid rgba(86,187,240,0.2)', color: '#90D4F7' }}>
              Open →
            </span>
          </Link>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne text-base font-bold text-white">Achievements</h2>
            <span className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.4)' }}>
              {unlocked.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedAchievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 + i * 0.04 }}
              >
                <AchievementCard achievement={ach} unlocked={unlocked.includes(ach.id)} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="font-outfit text-xs text-center pb-2" style={{ color: 'rgba(198,235,255,0.2)' }}>
          Community Connect · Built for TSA Nationals 2026
        </p>
      </div>
    </div>
  )
}
