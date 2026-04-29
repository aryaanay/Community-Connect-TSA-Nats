'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Search, Calendar, Heart, Plus, BarChart3, MapPin } from 'lucide-react'

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
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ rotateX: y * -8, rotateY: x * 8 })
  }

  return (
    <Link href={service.href}>
      <motion.div
        className="note-card group relative min-h-64 cursor-pointer rounded-[26px] border border-sky-100 bg-[#fbfdff] p-7 shadow-xl shadow-sky-950/10 transition-shadow hover:shadow-2xl hover:shadow-sky-950/20"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
        animate={tilt}
        whileHover={{ y: -8, scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="note-card-back-one absolute -inset-1 -z-10 rotate-[-2deg] rounded-[28px] bg-sky-100/70 transition-transform group-hover:rotate-[-4deg]" />
        <div className="note-card-back-two absolute -inset-1 -z-20 rotate-[2deg] rounded-[28px] bg-sky-200/50 transition-transform group-hover:rotate-[4deg]" />
        <span className="absolute left-1/2 top-3 h-3 w-16 -translate-x-1/2 rounded-full bg-sky-200/80 shadow-inner" />
        <span className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-600 transition-all group-hover:rotate-12 group-hover:bg-sky-500 group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <div className="relative z-10 flex h-full flex-col pt-4" style={{ transform: 'translateZ(26px)' }}>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25">
            <service.icon className="h-7 w-7" strokeWidth={1.6} />
          </div>

          <h3 className="mb-3 font-syne text-2xl font-black leading-tight text-sky-950">{service.title}</h3>
          <p className="font-dm-sans text-sm leading-relaxed text-sky-700">{service.description}</p>

          <div className="mt-auto pt-6">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
            <p className="mt-4 font-space text-xs font-bold uppercase tracking-[0.16em] text-sky-500">
              Open note
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(86,187,240,0.18),transparent_40%)] opacity-0 transition-opacity group-hover:opacity-100" />
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
