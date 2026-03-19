'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const impactItems = [
  { value: 500, label: 'Resources Listed' },
  { value: 1200, label: 'Active Volunteers' },
  { value: 320, label: 'Events Organized' },
  { value: 48, label: 'Partner Organizations' },
]

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target])

  return <span>{count.toLocaleString()}+</span>
}

export function ImpactStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-400 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(36,153,214,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_70%_20%,rgba(236,248,255,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-eyebrow !text-sky-200">Our Impact</span>
          <h2 className="section-heading text-white">Real numbers. Real change.</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {impactItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center py-12 px-6"
            >
              <div className="font-syne text-5xl font-bold text-white mb-2" style={{ background: 'linear-gradient(135deg, #fff 0%, #90D4F7 50%, #56BBF0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {isVisible && <AnimatedCounter target={item.value} />}
              </div>
              <div className="font-dm-sans text-sm font-medium text-white/90">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

