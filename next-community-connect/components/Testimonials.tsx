'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

const testimonials = [
  {
    quote: "Through Community Connect, I found volunteer tutors who helped my daughter excel in math. Weekly sessions became a mentorship that changed her confidence.",
    author: 'Maria Rodriguez',
    role: 'Parent, Eastside Neighborhood',
    initials: 'MR',
    rotate: -4,
    position: 'left-4 top-10 lg:left-12 lg:top-16',
    color: '#FF8C42',
  },
  {
    quote: "I wanted to give back but did not know where to start. Community Connect matched me with our local food bank, and now I volunteer every weekend.",
    author: 'James Chen',
    role: 'Volunteer, 2 years',
    initials: 'JC',
    rotate: 3,
    position: 'right-3 top-2 lg:right-20 lg:top-8',
    color: '#2499D6',
  },
  {
    quote: "We used Community Connect to organize a neighborhood cleanup and over 50 volunteers showed up. A neglected park is now a family gathering space.",
    author: 'Riverside Neighbors',
    role: 'Community Group',
    initials: 'RN',
    rotate: -1,
    position: 'left-1/2 top-52 -translate-x-1/2 lg:top-60',
    color: '#10B981',
  },
  {
    quote: "The resource directory helped me find senior transportation and meal support for my dad in one afternoon.",
    author: 'Aisha Patel',
    role: 'Caregiver',
    initials: 'AP',
    rotate: 5,
    position: 'left-8 bottom-4 lg:left-28 lg:bottom-10',
    color: '#6B3FA0',
  },
  {
    quote: "Our club found three nonprofits that needed student volunteers. It made service hours feel useful instead of random.",
    author: 'Northshore Students',
    role: 'Student Group',
    initials: 'NS',
    rotate: -5,
    position: 'right-6 bottom-8 lg:right-16 lg:bottom-14',
    color: '#E85D26',
  },
]

function FloatingStoryCard({ testimonial, index, constraintsRef }: {
  testimonial: typeof testimonials[0]
  index: number
  constraintsRef: React.RefObject<HTMLDivElement>
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-160, 160], [7, -7])
  const rotateY = useTransform(x, [-160, 160], [-7, 7])

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.16}
      dragMomentum={false}
      style={{ x, y, rotateX, rotateY, zIndex: 10 + index }}
      animate={{
        y: [0, index % 2 === 0 ? -10 : 10, 0],
        rotate: [testimonial.rotate, testimonial.rotate + (index % 2 === 0 ? 1.4 : -1.4), testimonial.rotate],
      }}
      transition={{
        y: { duration: 5.5 + index * 0.6, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 6.5 + index * 0.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.04, zIndex: 60 }}
      whileDrag={{ scale: 1.08, zIndex: 80, cursor: 'grabbing' }}
      className={`story-note absolute ${testimonial.position} w-[min(86vw,330px)] cursor-grab touch-none rounded-[24px] border border-sky-100 bg-white p-6 shadow-2xl shadow-sky-950/12`}
    >
      <div className="story-note-back absolute -inset-1 -z-10 rounded-[26px] bg-sky-100/70 rotate-[-2deg]" />
      <div className="absolute left-1/2 top-3 h-2.5 w-16 -translate-x-1/2 rounded-full bg-sky-100 shadow-inner" />
      <div className="mb-5 flex items-center justify-between pt-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl font-syne text-sm font-black text-white shadow-lg"
            style={{ backgroundColor: testimonial.color }}
          >
            {testimonial.initials}
          </div>
          <div>
            <p className="font-syne text-sm font-bold text-sky-950">{testimonial.author}</p>
            <p className="font-outfit text-xs text-sky-600">{testimonial.role}</p>
          </div>
        </div>
        <span className="font-space text-xs font-bold text-amber-400">★★★★★</span>
      </div>
      <p className="font-dm-sans text-sm leading-relaxed text-sky-800">{testimonial.quote}</p>
      <p className="mt-5 font-space text-[10px] font-bold uppercase tracking-[0.18em] text-sky-400">
        Drag me
      </p>
    </motion.div>
  )
}

export function Testimonials() {
  const constraintsRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-24 glass-bg backdrop-blur" id="stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="section-eyebrow">Community Stories</span>
          <h2 className="section-heading">Move the stories around.</h2>
          <p className="mx-auto max-w-xl font-dm-sans text-sm text-sky-700">
            These cards gently reorganize themselves. Grab any note and place it wherever you want.
          </p>
        </motion.div>

        <div
          ref={constraintsRef}
          className="story-board relative mx-auto h-[720px] max-w-6xl overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-sky-100/60 shadow-inner"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(36,153,214,0.12),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(255,140,66,0.12),transparent_26%)]" />
          {testimonials.map((testimonial, index) => (
            <FloatingStoryCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
              constraintsRef={constraintsRef}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
