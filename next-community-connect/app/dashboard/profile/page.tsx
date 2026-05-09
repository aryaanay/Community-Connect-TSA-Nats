'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useAchievements, ACHIEVEMENTS, TOTAL_POSSIBLE_XP, Achievement } from '@/context/AchievementsContext'
import { Lock } from 'lucide-react'

const LEVELS = [
  { min: 0,    max: 99,   level: 1, title: 'Community Newcomer',  color: '#56BBF0' },
  { min: 100,  max: 299,  level: 2, title: 'Active Member',       color: '#10B981' },
  { min: 300,  max: 599,  level: 3, title: 'Resource Champion',   color: '#8B5CF6' },
  { min: 600,  max: 999,  level: 4, title: 'Community Hero',      color: '#F59E0B' },
  { min: 1000, max: Infinity, level: 5, title: 'Local Legend',    color: '#EC4899' },
]

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, legendary: 3 }

const RARITY_STYLE = {
  common:    { label: 'Common',    text: '#56BBF0', bg: 'rgba(86,187,240,0.12)',   border: 'rgba(86,187,240,0.3)'  },
  uncommon:  { label: 'Uncommon',  text: '#10B981', bg: 'rgba(16,185,129,0.12)',   border: 'rgba(16,185,129,0.3)'  },
  rare:      { label: 'Rare',      text: '#A78BFA', bg: 'rgba(139,92,246,0.12)',   border: 'rgba(139,92,246,0.3)'  },
  legendary: { label: 'Legendary', text: '#FCD34D', bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.3)'  },
}

function getLevelInfo(xp: number) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) ?? LEVELS[LEVELS.length - 1]
}

function getNextLevel(currentLevel: number) {
  return LEVELS.find(l => l.level === currentLevel + 1)
}

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

export default function ProfilePage() {
  const { user } = useAuth()
  const { unlocked, totalXp, markPageVisited } = useAchievements()

  useEffect(() => { markPageVisited('profile') }, [markPageVisited])

  const levelInfo   = getLevelInfo(totalXp)
  const nextLevel   = getNextLevel(levelInfo.level)
  const xpIntoLevel = totalXp - levelInfo.min
  const xpForLevel  = nextLevel ? nextLevel.min - levelInfo.min : totalXp - levelInfo.min || 1
  const levelPct    = nextLevel ? Math.min(100, (xpIntoLevel / xpForLevel) * 100) : 100

  const initials = (user?.email ?? 'U').split('@')[0].slice(0, 2).toUpperCase()
  const sortedAchievements = [...ACHIEVEMENTS].sort(
    (a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]
  )

  return (
    <div
      className="min-h-full px-4 sm:px-6 lg:px-8 py-8"
      style={{ background: 'linear-gradient(150deg, #011629 0%, #022747 60%, #011629 100%)' }}
    >
      <div className="max-w-4xl mx-auto space-y-6">

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
          {/* glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse at 10% 50%, ${levelInfo.color}18 0%, transparent 60%)`,
          }} />

          <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-syne text-2xl font-black text-white flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${levelInfo.color}50, ${levelInfo.color}20)`,
                border: `2px solid ${levelInfo.color}50`,
                boxShadow: `0 8px 32px ${levelInfo.color}30`,
              }}
            >
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-syne text-2xl font-black text-white truncate">
                  {user?.email?.split('@')[0] ?? 'User'}
                </h1>
                <span
                  className="font-outfit text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: `${levelInfo.color}20`,
                    border: `1px solid ${levelInfo.color}50`,
                    color: levelInfo.color,
                  }}
                >
                  Lv.{levelInfo.level} · {levelInfo.title}
                </span>
              </div>

              <p className="font-outfit text-sm mb-4" style={{ color: 'rgba(198,235,255,0.45)' }}>
                {user?.email}
              </p>

              {/* XP bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.5)' }}>
                    {totalXp} XP
                    {nextLevel && <> · {nextLevel.min - totalXp} XP to Lv.{nextLevel.level}</>}
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
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Total XP',       value: totalXp.toLocaleString(),                     color: levelInfo.color },
            { label: 'Achievements',   value: `${unlocked.length} / ${ACHIEVEMENTS.length}`, color: '#10B981' },
            { label: 'Completion',     value: `${Math.round((totalXp / TOTAL_POSSIBLE_XP) * 100)}%`, color: '#8B5CF6' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl p-4 text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(86,187,240,0.1)',
              }}
            >
              <p className="font-syne text-xl font-black" style={{ color }}>{value}</p>
              <p className="font-outfit text-[11px] mt-0.5" style={{ color: 'rgba(198,235,255,0.45)' }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Achievements grid */}
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
          Community Connect · Bothell, WA · Built for TSA 2025
        </p>
      </div>
    </div>
  )
}
