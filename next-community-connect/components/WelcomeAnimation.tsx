'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  show: boolean
  email: string
  displayName?: string
  onComplete: () => void
}

export function WelcomeAnimation({ show, email, displayName, onComplete }: Props) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onComplete, 2500)
    return () => clearTimeout(t)
  }, [show, onComplete])

  const firstName = displayName?.trim() || email.split('@')[0] || 'there'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
          style={{ background: 'linear-gradient(145deg, #011629 0%, #044069 55%, #011629 100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Atmosphere dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 45 }, (_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-sky-300"
                style={{
                  left: `${4 + ((i * 17) % 93)}%`,
                  top: `${6 + ((i * 29) % 88)}%`,
                  width: 2 + (i % 2),
                  height: 2 + (i % 2),
                  opacity: 0.05 + (i % 4) * 0.022,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 220, damping: 18 }}
          >
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
              <circle cx="14" cy="14" r="12.5" stroke="#56BBF0" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="3" fill="#56BBF0" />
              <circle cx="14" cy="5.5" r="2" fill="#90D4F7" />
              <circle cx="21.5" cy="18.5" r="2" fill="#90D4F7" />
              <circle cx="6.5" cy="18.5" r="2" fill="#90D4F7" />
              <line x1="14" y1="11" x2="14" y2="7.5" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="16.5" y1="15.5" x2="19.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="11.5" y1="15.5" x2="8.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Text */}
          <motion.div
            className="text-center mt-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.5 }}
          >
            <h1 className="font-syne text-4xl sm:text-5xl font-bold text-white leading-tight">
              Welcome back,
            </h1>
            <p className="font-syne text-2xl sm:text-3xl font-black text-sky-400 mt-1">
              {firstName}
            </p>
          </motion.div>

          {/* Divider hint */}
          <motion.div
            className="flex items-center gap-3 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="h-px w-10" style={{ background: 'rgba(86,187,240,0.25)' }} />
            <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.4)' }}>
              Taking you to your dashboard
            </p>
            <div className="h-px w-10" style={{ background: 'rgba(86,187,240,0.25)' }} />
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="flex gap-2 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-sky-400"
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.25, 0.7] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
