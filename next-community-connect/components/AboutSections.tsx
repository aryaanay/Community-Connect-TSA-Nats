'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Lightbulb, Laptop, Handshake, Star, Users, Rocket, Heart, Shield, Zap } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { supabase } from '@/lib/supabaseClient'

const timeline = [
  { year: '2019', title: 'The Idea Takes Root', description: 'Two Washington residents meet at a local hackathon and sketch out the first version of Community Connect. The goal is simple: one searchable list of every resource in town.', icon: 'lightbulb', image: '/img/optimized/library3.jpg' },
  { year: '2020', title: 'Launch & First Resources', description: 'The platform goes live with an initial set of hand-researched Washington-area resources. During the pandemic, residents search for food assistance and health support.', icon: 'laptop', image: '/img/optimized/foodpantry5.jpg' },
  { year: '2022', title: 'First Nonprofit Partnerships', description: 'The first formal nonprofit partnerships are established. Community Connect begins representing Washington residents at community meetings and city events.', icon: 'handshake', image: '/img/optimized/heartwithhands6.jpg' },
  { year: '2023', title: 'Growing Directory & First Events', description: 'The directory grows steadily. The first Community Resource Fair brings together local organizations and community members.', icon: 'star', image: '/img/optimized/community7.jpg' },
  { year: '2025', title: 'Volunteer Network Expands', description: 'Community volunteers sign up to help verify listings, run workshops, and support events. The platform becomes genuinely community-run.', icon: 'users', image: '/img/optimized/cleanup4.jpg' },
  { year: '2026', title: '30+ Resources & 10 Partners', description: 'We reach 30+ verified resources and 10 organizational partners, with a growing base of Washington residents using the platform monthly.', icon: 'rocket', image: '/img/optimized/playground1.jpg' },
]

const partners = [
  'United Way', 'Local School District', 'County Health District', 'Parks & Recreation Dept.',
  'Regional Food Bank', 'Housing Authority', 'Youth Services Bureau', 'Workforce Development',
  'Public Library System', 'Community Clinic Network',
]

const timelineIconMap: Record<string, React.ElementType> = {
  lightbulb: Lightbulb, laptop: Laptop, handshake: Handshake, star: Star, users: Users, rocket: Rocket,
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (2000 / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else { setCount(Math.floor(start)) }
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count.toLocaleString()}+</span>
}

export function AboutSections() {
  const { settings } = useSettings()
  const dk = settings.dark

  const statsRef = useRef<HTMLElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  // Parallax on stats section background
  const { scrollYProgress: statsScroll } = useScroll({ target: statsRef, offset: ['start end', 'end start'] })
  const statsParallaxY = useTransform(statsScroll, [0, 1], [70, -70])

  // Live stats from Supabase
  const [liveEventCount, setLiveEventCount] = useState(8)
  const [liveSupporters, setLiveSupporters] = useState(150)
  const [liveDonated, setLiveDonated] = useState(0)

  useEffect(() => {
    supabase.from('events').select('id', { count: 'exact', head: true })
      .then(({ count }) => { if (count) setLiveEventCount(Math.max(8, count)) })

    supabase.from('wishlist_causes').select('supporter_count, current_amount')
      .then(({ data }) => {
        if (!data) return
        const supporters = data.reduce((s, r) => s + (r.supporter_count ?? 0), 0)
        const donated = data.reduce((s, r) => s + (r.current_amount ?? 0), 0)
        if (supporters > 0) setLiveSupporters(supporters)
        if (donated > 0) setLiveDonated(donated)
      })

    const channel = supabase.channel('about-stats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wishlist_causes' }, () => {
        supabase.from('wishlist_causes').select('supporter_count, current_amount').then(({ data }) => {
          if (!data) return
          const supporters = data.reduce((s, r) => s + (r.supporter_count ?? 0), 0)
          const donated = data.reduce((s, r) => s + (r.current_amount ?? 0), 0)
          setLiveSupporters(supporters)
          setLiveDonated(donated)
        })
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, () => {
        supabase.from('events').select('id', { count: 'exact', head: true })
          .then(({ count }) => { if (count) setLiveEventCount(Math.max(8, count)) })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* ── Mission ─────────────────────────────────────────────────────────── */}
      <section id="mission" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Visual side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl relative overflow-hidden">
                <img src="/img/optimized/garden2.jpg" alt="Community garden in Bothell, WA" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/50 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20, y: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                animate={{ y: [0, -6, 0] }}
                className="absolute bottom-7 right-[-20px] bg-white rounded-xl p-4 shadow-lg flex items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-300 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-space font-bold text-lg text-[var(--text-dark)]">150+</div>
                  <div className="font-outfit text-xs text-[var(--text-muted)]">Volunteers</div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20, y: -10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                animate={{ y: [0, 6, 0] }}
                className="absolute top-7 left-[-20px] bg-white rounded-xl p-4 shadow-lg flex items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-space font-bold text-lg text-[var(--text-dark)]">Bothell, WA</div>
                  <div className="font-outfit text-xs text-[var(--text-muted)]">Est. 2019</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="section-eyebrow">Our Mission</span>
              <h2 className="section-heading mb-4">Connecting people to the help they need</h2>
              <p className="font-outfit text-base text-[var(--text-body)] leading-relaxed mb-4">
                Community Connect is a free, volunteer-powered platform that makes it easy to find, share, and promote local services, programs, and organizations that uplift residents of all backgrounds.
              </p>
              <p className="font-outfit text-base text-[var(--text-body)] leading-relaxed mb-6">
                We saw firsthand how many people had no idea about the resources right here in the Pacific Northwest: food banks, free tutoring, mental health support, and volunteer programs. The reason was simple. There was no single place to look. We built that place.
              </p>
              <div className="border-l-4 border-sky-400 bg-sky-50 rounded-r-xl p-5 mb-6">
                <p
                  className="font-dm-sans text-base leading-relaxed italic m-0"
                  style={{ color: dk ? '#BAE6FD' : '#1e3a5f' }}
                >
                  &ldquo;No one should fall through the cracks just because they didn&apos;t know where to look. That&apos;s why Community Connect exists.&rdquo;
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Heart, title: 'Inclusive', desc: 'Resources for every age, background, and need.' },
                  { icon: Shield, title: 'Trusted', desc: 'Every resource is reviewed before listing.' },
                  { icon: Users, title: 'Community-Led', desc: 'Built by volunteers, sustained by neighbors.' },
                  { icon: Zap, title: 'Impactful', desc: 'Thousands connected to support every month.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-sky-50 border border-sky-100 rounded-xl hover:border-sky-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-400 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-space font-bold text-sm text-[var(--text-dark)]">{item.title}</div>
                      <div className="font-outfit text-xs text-[var(--text-muted)]">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Impact Stats ─────────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="py-24 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-400 relative overflow-hidden"
      >
        {/* Parallax background orbs */}
        <motion.div
          style={{ y: statsParallaxY }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(36,153,214,0.2)_0%,transparent_55%),radial-gradient(ellipse_at_80%_50%,rgba(4,64,105,0.4)_0%,transparent_50%)]"
        />
        {/* Floating orbs */}
        <motion.div
          className="pointer-events-none absolute w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(86,187,240,0.15) 0%, transparent 70%)', top: '-10%', right: '10%' }}
          animate={{ y: [0, -25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(4,64,105,0.3) 0%, transparent 70%)', bottom: '-5%', left: '5%' }}
          animate={{ y: [0, 20, 0], scale: [1, 0.92, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="font-outfit text-xs font-semibold uppercase tracking-widest text-sky-300/70">By the Numbers</span>
            <h2 className="font-syne text-3xl sm:text-4xl font-bold text-white mt-2">Our Impact in Washington</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value: 30, label: 'Resources Listed' },
              { value: liveSupporters, label: 'Active Supporters' },
              { value: liveEventCount, label: 'Events Organized' },
              { value: 10, label: 'Partner Organizations' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-12 px-6"
              >
                <div className="font-space text-4xl lg:text-5xl font-bold text-white mb-2">
                  {statsVisible ? <AnimatedCounter target={item.value} /> : '0+'}
                </div>
                <div className="font-outfit text-sm font-medium text-white/80">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--section-bg)] overflow-hidden" id="story">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-14"
          >
            <span className="section-eyebrow">Our Journey</span>
            <h2 className="section-heading">How We Got Here</h2>
            <p className="section-subtext mx-auto">From a weekend project to a Washington institution, here is the story of Community Connect.</p>
          </motion.div>

          <div className="relative">
            {/* Animated vertical center line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ originY: 0 }}
              className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-200 via-sky-400 to-sky-200 -translate-x-1/2 hidden lg:block"
            />

            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0
              const Icon = timelineIconMap[item.icon] ?? Lightbulb
              return (
                <div key={i} className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                  {/* Card — slides in from the side it lands on */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -70 : 70 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={isLeft ? 'lg:text-right' : 'lg:order-2'}
                  >
                    <div className="bg-white border border-sky-100 rounded-xl overflow-hidden hover:border-sky-300 hover:shadow-xl transition-all duration-300 group">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                      )}
                      <div className="p-5">
                        <h3 className="font-space font-bold text-base text-[var(--text-dark)] mb-2 group-hover:text-sky-700 transition-colors">{item.title}</h3>
                        <p className="font-outfit text-sm text-[var(--text-muted)] leading-relaxed m-0">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Icon + year — scale-bounce in */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.175, 0.885, 0.32, 1.275] }}
                    className="hidden lg:flex lg:flex-col lg:items-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-600 to-sky-400 border-4 border-white shadow-md flex items-center justify-center mb-2 cursor-default"
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.45 }}
                      className="font-space text-sm font-bold text-amber-400"
                    >
                      {item.year}
                    </motion.div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Partners ─────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white" id="partners">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-12"
          >
            <span className="section-eyebrow">Our Partners</span>
            <h2 className="section-heading">Organizations We Work With</h2>
            <p className="section-subtext mx-auto">Community Connect is proud to partner with these local organizations who share our commitment to accessible, equitable community support.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {partners.map((partner, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, ease: [0.175, 0.885, 0.32, 1.275] }}
                whileHover={{ y: -4, scale: 1.04 }}
                className="flex items-center gap-2 bg-white border border-sky-100 rounded-full px-5 py-3 font-outfit text-sm font-medium text-[var(--text-body)] hover:border-sky-300 hover:text-sky-600 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />
                {partner}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

    </>
  )
}
