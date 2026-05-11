'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import Link from 'next/link'
import { HeroDemo } from '@/components/ui/animated-hero-demo'
import { Heart, Shield, Users, Zap } from 'lucide-react'

const timeline = [
  { year: '2019', title: 'The Idea Takes Root', description: 'Two Bothell residents meet at a local hackathon and sketch out the first version of Community Connect. The goal is simple: one searchable list of every resource in town.', icon: 'lightbulb', image: '/img/optimized/library3.jpg' },
  { year: '2020', title: 'Launch & First Resources', description: 'The platform goes live with an initial set of hand-researched Bothell-area resources. During the pandemic, residents search for food assistance and health support.', icon: 'laptop', image: '/img/optimized/foodpantry5.jpg' },
  { year: '2022', title: 'First Nonprofit Partnerships', description: 'The first formal nonprofit partnerships are established. Community Connect begins representing Bothell residents at community meetings and city events.', icon: 'handshake', image: '/img/optimized/heartwithhands6.jpg' },
  { year: '2023', title: 'Growing Directory & First Events', description: 'The directory grows steadily. The first Community Resource Fair brings together local organizations and community members.', icon: 'star', image: '/img/optimized/community7.jpg' },
  { year: '2025', title: 'Volunteer Network Expands', description: 'Community volunteers sign up to help verify listings, run workshops, and support events. The platform becomes genuinely community-run.', icon: 'users', image: '/img/optimized/cleanup4.jpg' },
  { year: '2026', title: '30+ Resources & 10 Partners', description: 'We reach 30+ verified resources and 10 organizational partners, with a growing base of residents using the platform monthly.', icon: 'rocket', image: '/img/optimized/playground1.jpg' },
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

  const blur    = useTransform(p, [0, 0.5, 1], [10, 0, 10])
  const bright  = useTransform(p, [0, 0.5, 1], [0.15, 1, 0.15])
  const imgFilter = useMotionTemplate`blur(${blur}px) brightness(${bright})`

  const ty      = useTransform(p, [0, 0.5, 1], ['90px', '0px', '-90px'])
  const tz      = useTransform(p, [0, 0.5, 1], [280, 0, 280])
  const rx      = useTransform(p, [0, 0.5, 1], [50, 0, -50])
  const opacity = useTransform(p, [0.08, 0.28, 0.72, 0.92], [0, 1, 1, 0])

  return (
    <motion.article ref={ref} style={{ perspective: 1000 }} className="m-0">
      <motion.div
        style={{ y: ty, z: tz, rotateX: rx, opacity }}
        className="flex overflow-hidden rounded-2xl bg-white border border-sky-100 shadow-sm h-44 sm:h-52"
      >
        <motion.div
          className="w-2/5 sm:w-1/3 flex-shrink-0 overflow-hidden"
          style={{ filter: imgFilter }}
        >
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
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else { setCount(Math.floor(start)) }
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count.toLocaleString()}+</span>
}

export default function AboutPage() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <HeroDemo
        badge="Our Story"
        staticTitle="Built by the Community,<br />for the Community"
        subtitle="Community Connect started with one simple belief: everyone deserves to know what support exists in the community. We built that place."
        stats={[
          { value: '2019', label: 'Founded' },
          { value: '30+', label: 'Resources' },
          { value: '10', label: 'Partners' },
        ]}
        backgroundImage="/img/page-2.jpg"
      />

      <div className="relative z-10">
      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[var(--radius-lg)] relative overflow-hidden">
                <img src="/img/optimized/garden2.jpg" alt="Community garden in Bothell, WA" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/50 to-transparent" />
              </div>
              <div className="absolute bottom-7 right-[-20px] bg-white rounded-[var(--radius-md)] p-4 shadow-lg flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-300 flex items-center justify-center text-white">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-space font-bold text-lg text-[var(--text-dark)]">150+</div>
                  <div className="font-outfit text-xs text-[var(--text-muted)]">Volunteers</div>
                </div>
              </div>
              <div className="absolute top-7 left-[-20px] bg-white rounded-[var(--radius-md)] p-4 shadow-lg flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center text-white">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-space font-bold text-lg text-[var(--text-dark)]">Bothell, WA</div>
                  <div className="font-outfit text-xs text-[var(--text-muted)]">Est. 2019</div>
                </div>
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              <span className="section-eyebrow">Our Mission</span>
              <h2 className="section-heading mb-4">Connecting people to the help they need</h2>
              <p className="font-outfit text-base text-[var(--text-body)] leading-relaxed mb-4">
                Community Connect is a free, volunteer-powered platform that makes it easy to find, share, and promote local services, programs, and organizations that uplift residents of all backgrounds.
              </p>
              <p className="font-outfit text-base text-[var(--text-body)] leading-relaxed mb-6">
                We saw firsthand how many people had no idea about the resources right here in Bothell: food banks, free tutoring, mental health support, and volunteer programs. The reason was simple. There was no single place to look. We built that place.
              </p>
              <div className="border-l-4 border-sky-400 bg-sky-50 rounded-r-[var(--radius-md)] p-5 mb-6">
                <p className="font-dm-sans text-base text-sky-800 leading-relaxed italic m-0">
                  "No one should fall through the cracks just because they didn't know where to look. That's why Community Connect exists."
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
                    className="flex items-start gap-3 p-4 bg-sky-50 border border-sky-100 rounded-[var(--radius-md)] hover:border-sky-300 transition-colors"
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

      {/* Impact Stats */}
      <section ref={sectionRef} className="py-24 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-400 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(36,153,214,0.2)_0%,transparent_55%),radial-gradient(ellipse_at_80%_50%,rgba(4,64,105,0.4)_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              { value: 30, label: 'Resources Listed' },
              { value: 150, label: 'Active Volunteers' },
              { value: 25, label: 'Events Organized' },
              { value: 10, label: 'Partner Organizations' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center py-12 px-6"
              >
                <div className="font-space text-4xl lg:text-5xl font-bold text-white mb-2">
                  {isVisible && <AnimatedCounter target={item.value} />}
                </div>
                <div className="font-outfit text-sm font-medium text-white/90">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[var(--section-bg)]" id="story">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-14"
          >
            <span className="section-eyebrow">Our Journey</span>
            <h2 className="section-heading">How We Got Here</h2>
            <p className="section-subtext mx-auto">From a weekend project to a Washington institution, here is the story of Community Connect.</p>
          </motion.div>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <TimelineTile key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
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
              <span
                key={i}
                className="flex items-center gap-2 bg-white border border-sky-100 rounded-full px-5 py-3 font-outfit text-sm font-medium text-[var(--text-body)] hover:border-sky-300 hover:text-sky-600 hover:-translate-y-1 hover:shadow-card transition-all select-none"
                style={{ cursor: 'default' }}
              >
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                {partner}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-sky-900 to-sky-700 rounded-[var(--radius-lg)] p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(36,153,214,0.2)_0%,transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="font-space text-3xl font-bold text-white mb-4">Ready to Get Involved?</h2>
              <p className="font-outfit text-base text-white/80 max-w-md mx-auto mb-8">
                Browse our full directory of community resources, submit a resource you know about, or come to an upcoming event.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/resources" className="px-6 py-3 rounded-xl font-outfit font-semibold border-2 border-white/60 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center gap-2">
                  Browse Resources
                </Link>
                <Link href="/events" className="px-6 py-3 rounded-xl font-outfit font-semibold border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all flex items-center gap-2">
                  Upcoming Events
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  )
}
