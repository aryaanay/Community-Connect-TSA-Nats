'use client'

import { motion } from 'framer-motion'

const tickerItems = [
  'Education Support',
  'Health & Wellness',
  'Career Resources',
  'Community Events',
  'Volunteer Matching',
  'Non-Profit Directory',
  'Crisis Services',
  'Youth Programs',
]

export function MissionTicker() {
  return (
    <div className="bg-sky-600 overflow-hidden py-5">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-[60px] font-dm-sans text-sm font-medium text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

