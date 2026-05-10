'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import Link from 'next/link'
import { Users, Heart, Shield, Zap } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { useT } from '@/lib/useT'
import { supabase } from '@/lib/supabaseClient'

const timeline = [
  { year: '2019', title: 'The Idea Takes Root', description: 'Two Bothell residents meet at a local hackathon and sketch out the first version of Community Connect. The goal is simple: one searchable list of every resource in town.', icon: 'lightbulb', image: '/img/optimized/library3.jpg' },
  { year: '2020', title: 'Launch & First Resources', description: 'The platform goes live with an initial set of hand-researched Bothell-area resources. During the pandemic, residents search for food assistance and health support.', icon: 'laptop', image: '/img/optimized/foodpantry5.jpg' },
  { year: '2022', title: 'First Nonprofit Partnerships', description: 'The first formal nonprofit partnerships are established. Community Connect begins representing Bothell residents at community meetings and city events.', icon: 'handshake', image: '/img/optimized/heartwithhands6.jpg' },
  { year: '2023', title: 'Growing Directory & First Events', description: 'The directory grows steadily. The first Community Resource Fair brings together local organizations and community members.', icon: 'star', image: '/img/optimized/community7.jpg' },
  { year: '2025', title: 'Volunteer Network Expands', description: 'Community volunteers sign up to help verify listings, run workshops, and support events. The platform becomes genuinely community-run.', icon: 'users', image: '/img/optimized/cleanup4.jpg' },
  { year: '2026', title: '30+ Resources & 10 Partners', description: 'We reach 30+ verified resources and 10 organizational partners, with a growing base of Bothell residents using the platform monthly.', icon: 'rocket', image: '/img/optimized/playground1.jpg' },
]

const partners = [
  'United Way', 'Local School District', 'County Health District', 'Parks & Recreation Dept.',
  'Regional Food Bank', 'Housing Authority', 'Youth Services Bureau', 'Workforce Development',
  'Public Library System', 'Community Clinic Network',
]

type TimelineItem = typeof timeline[0]

function TimelineTile({ item }: { item: TimelineItem }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const blur      = useTransform(p, [0, 0.5, 1], [10, 0, 10])
  const bright    = useTransform(p, [0, 0.5, 1], [0.15, 1, 0.15])
  const imgFilter = useMotionTemplate`blur(${blur}px) brightness(${bright})`
  const ty        = useTransform(p, [0, 0.5, 1], ['90px', '0px', '-90px'])
  const tz        = useTransform(p, [0, 0.5, 1], [280, 0, 280])
  const rx        = useTransform(p, [0, 0.5, 1], [50, 0, -50])
  const opacity   = useTransform(p, [0.08, 0.28, 0.72, 0.92], [0, 1, 1, 0])

  return (
    <motion.article ref={ref} style={{ perspective: 1000 }} className="m-0">
      <motion.div
        style={{ y: ty, z: tz, rotateX: rx, opacity }}
        className="flex overflow-hidden rounded-2xl bg-white border border-sky-100 shadow-sm h-44 sm:h-52"
      >
        <motion.div className="w-2/5 sm:w-1/3 flex-shrink-0 overflow-hidden" style={{ filter: imgFilter }}>
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </motion.div>
        <div className="flex-1 px-6 py-5 flex flex-col justify-center min-w-0">
          <span className="font-space text-xs font-bold text-sky-500 tracking-widest uppercase mb-1">{item.year}</span>
          <h3 className="font-space font-bold text-base sm:text-lg text-[var(--text-dark)] mb-2 leading-snug">{item.title}</h3>
          <p className="font-outfit text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">{item.description}</p>
        </div>
      </motion.div>
    </motion.article>
  )
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
  const t = useT()

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
              <span className="section-eyebrow">{t('about.mission_eyebrow')}</span>
              <h2 className="section-heading mb-4">{t('about.mission_heading')}</h2>
              <p className="font-outfit text-base text-[var(--text-body)] leading-relaxed mb-4">
                {t('about.mission_p1')}
              </p>
              <p className="font-outfit text-base text-[var(--text-body)] leading-relaxed mb-6">
                {t('about.mission_p2')}
              </p>
              <div className="border-l-4 border-sky-400 bg-sky-50 rounded-r-xl p-5 mb-6">
                <p
                  className="font-dm-sans text-base leading-relaxed italic m-0 mb-2"
                  style={{ color: dk ? '#BAE6FD' : '#1e3a5f' }}
                >
                  {t('about.quote')}
                </p>
                <p className="font-outfit text-sm font-semibold m-0" style={{ color: dk ? '#90D4F7' : '#2499D6' }}>
                  {t('about.quote_attr')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Heart, title: t('about.val_inclusive'), desc: t('about.val_inclusive_desc') },
                  { icon: Shield, title: t('about.val_trusted'), desc: t('about.val_trusted_desc') },
                  { icon: Users, title: t('about.val_community'), desc: t('about.val_community_desc') },
                  { icon: Zap, title: t('about.val_impactful'), desc: t('about.val_impactful_desc') },
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
            <span className="font-outfit text-xs font-semibold uppercase tracking-widest text-sky-300/70">{t('about.numbers_eyebrow')}</span>
            <h2 className="font-syne text-3xl sm:text-4xl font-bold text-white mt-2">{t('about.numbers_heading')}</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value: 30, label: t('about.stat_resources') },
              { value: liveSupporters, label: t('about.stat_supporters') },
              { value: liveEventCount, label: t('about.stat_events_org') },
              { value: 10, label: t('about.stat_partners_org') },
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
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-14"
          >
            <span className="section-eyebrow">{t('about.journey_eyebrow')}</span>
            <h2 className="section-heading">{t('about.journey_heading')}</h2>
            <p className="section-subtext mx-auto">{t('about.journey_sub')}</p>
          </motion.div>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <TimelineTile key={i} item={item} />
            ))}
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
            <span className="section-eyebrow">{t('about.partners_eyebrow')}</span>
            <h2 className="section-heading">{t('about.partners_heading')}</h2>
            <p className="section-subtext mx-auto">{t('about.partners_sub')}</p>
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
