'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Shield, Users, Zap } from 'lucide-react'

const pillars = [
  { icon: <Heart size={20} />, title: 'Inclusive', description: 'Resources for every age, background, and need. No one in Bothell gets left behind.' },
  { icon: <Shield size={20} />, title: 'Trusted', description: 'Every resource is reviewed and verified by our team before it goes live.' },
  { icon: <Users size={20} />, title: 'Community-Led', description: 'Built by Bothell residents, for Bothell residents. You shape the hub.' },
  { icon: <Zap size={20} />, title: 'Impactful', description: 'We track real-world difference and celebrate every connection made.' },
]

const missionStats = [
  { value: '150+', label: 'Bothell Volunteers', plus: false },
  { value: '30+', label: 'Local Resources Listed', plus: false },
  { value: '6', label: 'Years Serving Bothell', plus: false },
  { value: '4', label: 'Community Events / Year', plus: false },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1600
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

  return <span>{count.toLocaleString()}{suffix}</span>
}

export function AboutSection() {
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
    <section ref={sectionRef} className="py-24 glass-bg-lg backdrop-blur" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <span className="section-eyebrow">Our Mission</span>
          <h2 className="section-heading">Connecting Bothell neighbors<br />with the help they need.</h2>
          <p className="font-dm-sans text-sky-700 leading-relaxed mt-4">
            Community Connect is a volunteer-driven platform that connects Bothell residents with the resources around them, including food pantries, job training, after-school programs, and health clinics.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-0 bg-gradient-to-br from-sky-800 to-sky-600 rounded-3xl p-10 mb-14 shadow-glass-lg"
        >
          {missionStats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center flex-1 min-w-[140px]">
              <div className="font-syne text-5xl font-bold text-white leading-none mb-2" style={{ background: 'linear-gradient(135deg, #fff 0%, #90D4F7 50%, #56BBF0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {isVisible && <AnimatedCounter target={parseInt(stat.value.replace(/\D/g, ''))} />}
                {stat.plus && <span className="text-sky-300 text-2xl">+</span>}
              </div>
              <div className="font-dm-sans text-[11px] font-medium text-white/80 uppercase tracking-wider text-center">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Four Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-8 glass-bg-md rounded-3xl border border-sky-200 shadow-glass hover:-translate-y-1.5 hover:shadow-glass-lg hover:border-sky-300 transition-all backdrop-blur"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white text-xl mx-auto mb-4.5 shadow-md">
                {pillar.icon}
              </div>
              <h3 className="font-syne text-base font-bold text-sky-900 mb-2.5">{pillar.title}</h3>
              <p className="font-dm-sans text-sm text-sky-700 leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

