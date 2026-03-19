'use client'

import { motion } from 'framer-motion'

const audiences = [
  { icon: '👶', label: 'Kids & Families' },
  { icon: '🎓', label: 'Students' },
  { icon: '💼', label: 'Job Seekers' },
  { icon: '🤝', label: 'Volunteers' },
  { icon: '👤', label: 'Seniors' },
  { icon: '🌍', label: 'All Residents' },
]

export function AudienceBadges() {
  return (
    <div className="glass-bg-md border-b border-sky-200 py-5 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="font-dm-sans text-sm font-semibold text-sky-600 uppercase tracking-wider mr-2">For Everyone:</span>
          {audiences.map((item, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-1.5 glass-bg-md border border-sky-200 rounded-full px-4 py-1.5 font-dm-sans text-sm text-sky-700 font-medium transition-all hover:border-sky-400 hover:bg-sky-50 backdrop-blur-sm cursor-default hover:shadow-sm"
            >
              <span>{item.icon}</span>
              {item.label}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

