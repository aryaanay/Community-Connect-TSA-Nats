'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, ArrowRight, BookOpen, Stethoscope, Home } from 'lucide-react'
import Link from 'next/link'
import TiltCard from '@/components/TiltCard'

const spotlights = [
  {
    title: 'Bothell Regional Library',
    category: 'Education',
    description: 'Free books, digital resources, study rooms, and homework help for all ages. Library cards are free for all King County residents.',
    location: '18215 98th Ave NE, Bothell',
    hours: 'Mon-Thu 10AM-8PM',
    badge: 'Featured',
    Icon: BookOpen,
  },
  {
    title: 'EvergreenHealth Medical Center',
    category: 'Health & Wellness',
    description: 'Full-service hospital with 24/7 emergency care, primary care, and specialty services. Serving the Northshore community with high-quality care.',
    location: '12040 NE 128th St, Kirkland',
    hours: 'Emergency: 24/7',
    badge: 'Essential',
    Icon: Stethoscope,
  },
  {
    title: 'Hopelink Bothell',
    category: 'Community Support',
    description: 'Food, financial assistance, housing, and transportation services for families and individuals in need across Eastside and North King County.',
    location: '23640 Bothell Everett Hwy',
    hours: 'Mon-Fri 9AM-4PM',
    badge: 'Local',
    Icon: Home,
  },
]

const gradients = [
  'from-sky-700 to-sky-500',
  'from-sky-600 to-sky-400',
  'from-sky-800 to-sky-600',
]

export function Spotlights() {
  return (
    <section className="py-24 glass-bg backdrop-blur" id="spotlight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-eyebrow">Featured Resources</span>
          <h2 className="section-heading">Three resources making a difference right now.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {spotlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <TiltCard className="rounded-xl h-full" intensity={10} glareOpacity={0.16}>
                <div className={`group glass-bg-md rounded-xl border border-sky-200 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-glass-lg hover:border-sky-300 h-full`}>
                  <div className={`h-52 bg-gradient-to-br ${gradients[i]} relative flex items-center justify-center`}>
                <item.Icon className="w-20 h-20 text-white/20" strokeWidth={1} />
                <span className="absolute top-3.5 left-3.5 glass-bg-md text-sky-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
                  {item.category}
                </span>
                <span className="absolute top-3.5 right-3.5 bg-gradient-to-r from-sky-500 to-sky-400 text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-sm">
                  {item.badge}
                </span>
              </div>

              <div className="p-6">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mb-2 block">{item.category}</span>
                <h3 className="font-syne text-xl font-semibold text-sky-900 mb-2 leading-tight">{item.title}</h3>
                <p className="font-dm-sans text-sm text-sky-600 leading-relaxed mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-4 font-dm-sans text-xs text-sky-600">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-sky-500" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-sky-500" />
                    {item.hours}
                  </span>
                </div>
              </div>
            </div>
            </TiltCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-400 text-white font-dm-sans text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-500/30"
          >
            <ArrowRight size={16} /> View All Resources
          </Link>
        </div>
      </div>
    </section>
  )
}
