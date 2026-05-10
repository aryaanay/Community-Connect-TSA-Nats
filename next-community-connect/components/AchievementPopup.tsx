'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAchievements, Achievement } from '@/context/AchievementsContext'
import { Sparkles } from 'lucide-react'

const RARITY = {
  common:    { label: 'Common',    shimmer: '#56BBF0', border: 'rgba(86,187,240,0.55)',  badge: 'rgba(86,187,240,0.15)',  text: '#56BBF0',  glow: 'rgba(86,187,240,0.35)',  grad: 'linear-gradient(145deg,#071e2e 0%,#0d3654 100%)' },
  uncommon:  { label: 'Uncommon',  shimmer: '#10B981', border: 'rgba(16,185,129,0.55)',  badge: 'rgba(16,185,129,0.15)',  text: '#10B981',  glow: 'rgba(16,185,129,0.35)',  grad: 'linear-gradient(145deg,#051d12 0%,#0b3823 100%)' },
  rare:      { label: 'Rare',      shimmer: '#8B5CF6', border: 'rgba(139,92,246,0.55)',  badge: 'rgba(139,92,246,0.15)',  text: '#A78BFA',  glow: 'rgba(139,92,246,0.35)',  grad: 'linear-gradient(145deg,#110720 0%,#221040 100%)' },
  legendary: { label: 'Legendary', shimmer: '#F59E0B', border: 'rgba(245,158,11,0.65)',  badge: 'rgba(245,158,11,0.15)',  text: '#FCD34D',  glow: 'rgba(245,158,11,0.45)',  grad: 'linear-gradient(145deg,#1c0f00 0%,#3a2000 100%)' },
}

function Card3D({ achievement }: { achievement: Achievement }) {
  const cardRef   = useRef<HTMLDivElement>(null)
  const animRef   = useRef<number>()
  const angleY    = useRef(0)
  const currentX  = useRef(0)
  const targetX   = useRef(0)
  const targetY   = useRef(0)
  const [rotX, setRotX] = useState(0)
  const [rotY, setRotY] = useState(0)
  const [glare, setGlare]           = useState({ x: 50, y: 50 })
  const [flashlight, setFlashlight] = useState({ x: 50, y: 50, active: false })
  const [hovered, setHovered]       = useState(false)
  const [flipped, setFlipped]       = useState(false)

  const cfg = RARITY[achievement.rarity]

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    targetX.current = -((e.clientY - cy) / (rect.height / 2)) * 20
    targetY.current =  ((e.clientX - cx) / (rect.width  / 2)) * 20
    const gx = ((e.clientX - rect.left) / rect.width)  * 100
    const gy = ((e.clientY - rect.top)  / rect.height) * 100
    setGlare({ x: gx, y: gy })
    setFlashlight({ x: gx, y: gy, active: true })
  }, [])

  useEffect(() => {
    const tick = () => {
      if (!flipped) {
        if (hovered) {
          // Smooth mouse-follow
          currentX.current += (targetX.current - currentX.current) * 0.1
          const interpY = rotY + (targetY.current - rotY) * 0.1
          setRotX(currentX.current)
          setRotY(interpY)
        } else {
          // Continuous Y-axis rotation — 1.2°/frame ≈ 1 full spin every 5 sec
          angleY.current = (angleY.current + 1.2) % 360
          currentX.current += (0 - currentX.current) * 0.05
          setRotX(currentX.current)
          setRotY(angleY.current)
        }
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [hovered, flipped]) // eslint-disable-line react-hooks/exhaustive-deps

  const transform = flipped
    ? 'rotateY(180deg)'
    : `rotateX(${rotX}deg) rotateY(${rotY}deg)`

  return (
    <div
      ref={cardRef}
      style={{ perspective: '1100px', width: 290, height: 400, cursor: 'pointer' }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setGlare({ x: 50, y: 50 })
        setFlashlight(f => ({ ...f, active: false }))
        // Sync auto-angle to current Y so rotation continues smoothly
        angleY.current = rotY
      }}
      onClick={() => setFlipped(f => !f)}
    >
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transform,
        transition: flipped ? 'transform 0.55s cubic-bezier(0.16,1,0.3,1)' : 'none',
      }}>

        {/* FRONT */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20,
          background: cfg.grad,
          border: `1.5px solid ${cfg.border}`,
          boxShadow: `0 24px 64px ${cfg.glow}, 0 0 0 1px ${cfg.border}22`,
          overflow: 'hidden',
          backfaceVisibility: 'hidden',
        }}>
          {/* Holographic shimmer driven by rotation angle */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay',
            backgroundImage: `conic-gradient(from ${rotY * 4}deg at 50% 45%,
              transparent 0deg, ${cfg.shimmer}22 40deg, transparent 80deg,
              ${cfg.shimmer}12 160deg, transparent 220deg,
              ${cfg.shimmer}20 280deg, transparent 340deg, ${cfg.shimmer}12 360deg)`,
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.3s',
          }} />

          {hovered && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.22) 0%, transparent 58%)`,
            }} />
          )}

          {flashlight.active && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen',
              background: `radial-gradient(ellipse 45% 55% at ${flashlight.x}% ${flashlight.y}%, rgba(255,255,255,0.18) 0%, ${cfg.shimmer}18 35%, transparent 70%)`,
            }} />
          )}

          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 1, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{
                fontSize: 9, fontFamily: 'outfit,sans-serif', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: cfg.text, background: cfg.badge,
                border: `1px solid ${cfg.border}`, padding: '3px 10px', borderRadius: 100,
              }}>
                {cfg.label}
              </span>
              <span style={{ fontSize: 10, fontFamily: 'outfit,sans-serif', color: 'rgba(255,255,255,0.55)' }}>
                +{achievement.xp} XP
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 80, filter: `drop-shadow(0 0 28px ${cfg.shimmer}70)` }}>
              {achievement.emoji}
            </div>

            <div>
              <p style={{ fontSize: 9, fontFamily: 'outfit,sans-serif', color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>
                Achievement Unlocked
              </p>
              <h3 style={{ fontSize: 21, fontFamily: 'syne,sans-serif', fontWeight: 800,
                color: 'white', lineHeight: 1.2, marginBottom: 7 }}>
                {achievement.title}
              </h3>
              <p style={{ fontSize: 11.5, fontFamily: 'outfit,sans-serif',
                color: 'rgba(255,255,255,0.82)', lineHeight: 1.55 }}>
                {achievement.description}
              </p>
            </div>

            <p style={{ fontSize: 8.5, fontFamily: 'outfit,sans-serif',
              color: 'rgba(255,255,255,0.40)', textAlign: 'center', marginTop: 14 }}>
              Click to flip · Hover to control
            </p>
          </div>
        </div>

        {/* BACK */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20,
          background: cfg.grad,
          border: `1.5px solid ${cfg.border}`,
          boxShadow: `0 24px 64px ${cfg.glow}`,
          overflow: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `radial-gradient(${cfg.shimmer}28 1px, transparent 1px)`,
            backgroundSize: '22px 22px',
          }} />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `repeating-linear-gradient(-45deg, transparent, transparent 18px, ${cfg.shimmer}06 18px, ${cfg.shimmer}06 19px)`,
          }} />
          {flashlight.active && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen',
              background: `radial-gradient(ellipse 45% 55% at ${flashlight.x}% ${flashlight.y}%, rgba(255,255,255,0.15) 0%, ${cfg.shimmer}14 35%, transparent 70%)`,
            }} />
          )}
          <div style={{
            padding: 30, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', position: 'relative', zIndex: 1,
            textAlign: 'center', boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: 52, marginBottom: 18, filter: `drop-shadow(0 0 20px ${cfg.shimmer}60)` }}>
              {achievement.emoji}
            </div>
            <div style={{ width: 52, height: 3, borderRadius: 4, marginBottom: 18,
              background: `linear-gradient(90deg, transparent, ${cfg.shimmer}, transparent)` }} />
            <h4 style={{ fontSize: 19, fontFamily: 'syne,sans-serif', fontWeight: 800, color: 'white', marginBottom: 12 }}>
              {achievement.title}
            </h4>
            <p style={{ fontSize: 13, fontFamily: 'outfit,sans-serif', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, marginBottom: 22 }}>
              {achievement.description}
            </p>
            <div style={{ padding: '9px 20px', borderRadius: 14, background: cfg.badge, border: `1px solid ${cfg.border}` }}>
              <span style={{ fontSize: 14, fontFamily: 'syne,sans-serif', fontWeight: 700, color: cfg.text }}>
                +{achievement.xp} XP earned
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AchievementPopup() {
  const { queue, dismissCurrent } = useAchievements()
  const current = queue[0]

  useEffect(() => {
    if (!current) return
    const t = setTimeout(dismissCurrent, 12000)
    return () => clearTimeout(t)
  }, [current, dismissCurrent])

  return (
    <AnimatePresence mode="wait">
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(1,14,28,0.85)', backdropFilter: 'blur(18px)' }}
          onClick={dismissCurrent}
        >
          {/* Header explanation */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2 mb-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'rgba(86,187,240,0.12)', border: '1px solid rgba(86,187,240,0.25)' }}>
              <Sparkles size={13} style={{ color: '#56BBF0' }} />
              <span className="font-outfit text-xs font-semibold uppercase tracking-widest" style={{ color: '#90D4F7' }}>
                Achievement Unlocked
              </span>
            </div>
            <p className="font-outfit text-sm text-center max-w-xs" style={{ color: 'rgba(198,235,255,0.55)' }}>
              Earn XP by exploring Community Connect. Level up to unlock new titles on your profile.
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.75, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -24, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <Card3D achievement={current} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5 font-outfit text-xs"
            style={{ color: 'rgba(198,235,255,0.3)' }}
          >
            Click anywhere to dismiss
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
