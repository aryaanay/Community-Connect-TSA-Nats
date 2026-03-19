'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Calendar, Heart, Plus, BarChart3, MapPin } from 'lucide-react'

const services = [
  {
    icon: Search,
    title: "Resource Directory",
    description: "Search and filter hundreds of verified local resources by category, location, and availability.",
    href: '/resources',
  },
  {
    icon: Calendar,
    title: 'Community Events',
    description: "Discover upcoming cleanups, food drives, workshops, and neighborhood events near you.",
    href: '/events',
  },
  {
    icon: Heart,
    title: 'Volunteer Matching',
    description: "Share your skills and we will connect you with organizations that need what you offer.",
    href: '/resources',
  },
  {
    icon: Plus,
    title: 'Submit a Resource',
    description: "Know a great program? Add it so others can benefit. All submissions reviewed.",
    href: '/submit',
  },
  {
    icon: BarChart3,
    title: 'Accessibility',
    description: "Customize your experience with font size, contrast, dark mode, and more.",
    href: '/settings',
  },
  {
    icon: MapPin,
    title: 'Interactive Map',
    description: "Find resources near you with directions and contact info built in.",
    href: '/resources',
  },
]

function ServiceCard({ service }: { service: typeof services[0] }) {
  return (
    <Link href={service.href}>
        <motion.div
          className="group relative rounded-3xl border border-white/95 bg-white/80 backdrop-blur-xl p-8 lg:p-10 overflow-hidden cursor-pointer min-h-48 lg:min-h-56 shadow-lg hover:shadow-2xl"
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.18)' }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Default state - icon + title */}
        <div className="flex items-center gap-4 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
            <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-sky-500/40 border border-sky-400/60 flex items-center justify-center shadow-md">
              <service.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="font-syne text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">{service.title}</h3>
        </div>

        {/* Hover state - description */}
        <div className="absolute inset-0 p-6 flex flex-col justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <service.icon className="w-4 h-4 text-sky-600 flex-shrink-0" strokeWidth={1.5} />
            <h3 className="font-syne text-sm font-bold text-gray-800 uppercase tracking-wider">{service.title}</h3>
          </div>
          <p className="font-dm-sans text-sm text-gray-700 leading-relaxed">{service.description}</p>
        </div>

        {/* Bottom border glow on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    </Link>
  )
}

export function Services() {
  return (
    <section className="py-24 lg:py-32 bg-sky-900" id="services">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-sky-400/20 border border-sky-400/40 px-4 py-1.5 rounded-full text-sky-200 font-syne font-semibold tracking-widest text-xs uppercase mb-6">
            What We Offer
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-syne text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-xl">
              Everything your<br />community needs
            </h2>
            <p className="font-dm-sans text-base text-white/60 max-w-sm leading-relaxed lg:text-right">
              From finding volunteers to discovering local programs, all in one place.
            </p>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}