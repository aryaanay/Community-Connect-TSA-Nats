'use client'

import { useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'

const testimonials = [
  {
    quote: "Through Community Connect, I found volunteer tutors who helped my daughter excel in math. Weekly sessions became a mentorship that changed her confidence.",
    author: 'Maria Rodriguez',
    role: 'Parent, Eastside Neighborhood',
    initials: 'MR',
    color: '#FF8C42',
  },
  {
    quote: "I wanted to give back but did not know where to start. Community Connect matched me with our local food bank, and now I volunteer every weekend.",
    author: 'James Chen',
    role: 'Volunteer, 2 years',
    initials: 'JC',
    color: '#2499D6',
  },
  {
    quote: "We used Community Connect to organize a neighborhood cleanup and over 50 volunteers showed up. A neglected park is now a family gathering space.",
    author: 'Riverside Neighbors',
    role: 'Community Group',
    initials: 'RN',
    color: '#10B981',
  },
  {
    quote: "The resource directory helped me find senior transportation and meal support for my dad in one afternoon.",
    author: 'Aisha Patel',
    role: 'Caregiver',
    initials: 'AP',
    color: '#6B3FA0',
  },
  {
    quote: "Our club found three nonprofits that needed student volunteers. It made service hours feel useful instead of random.",
    author: 'Northshore Students',
    role: 'Student Group',
    initials: 'NS',
    color: '#E85D26',
  },
]

export function Testimonials() {
  // Deck is ordered so `deck[0]` is always the top/active card.
  const [deck, setDeck] = useState(testimonials)
  const x = useMotionValue(0)

  const activeIndex = testimonials.findIndex((t) => t.author === deck[0]?.author)

  const handleDragEnd = (info: { offset: { x: number } }) => {
    const dx = info.offset.x
    const threshold = 90

    // Always snap card back; if threshold met, we rotate the deck first.
    animate(x, 0, { type: 'spring', stiffness: 320, damping: 28 })

    if (dx < -threshold) {
      // Drag left -> reveal next, and the card you dragged goes to the back.
      setDeck((prev) => (prev.length <= 1 ? prev : [...prev.slice(1), prev[0]]))
    } else if (dx > threshold) {
      // Drag right -> reveal previous (optional, but feels natural).
      setDeck((prev) => (prev.length <= 1 ? prev : [prev[prev.length - 1], ...prev.slice(0, -1)]))
    }
  }

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
            Drag the top card left to reveal the next testimonial. It loops automatically.
          </p>
        </motion.div>

        <div className="story-board relative mx-auto h-[720px] max-w-6xl overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-sky-100/60 shadow-inner">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(36,153,214,0.12),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(255,140,66,0.12),transparent_26%)]" />

          {/* Right-side label + dot bar */}
          <div className="pointer-events-none absolute right-8 top-10 z-30 flex flex-col items-end gap-3">
            <div className="font-space text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300/90">
              testimonials
            </div>
            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => {
                const isActive = i === activeIndex
                return (
                  <span
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${t.author}-${i}`}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      isActive ? 'bg-sky-300 shadow-[0_0_12px_rgba(86,187,240,0.7)]' : 'bg-white/20'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          {/* Deck of cards (assembled on top of each other) */}
          {deck.map((testimonial, index) => {
            const isTop = index === 0
            const pointerClass = isTop ? 'pointer-events-auto cursor-grab' : 'pointer-events-none cursor-default'

            return (
              <motion.div
                key={testimonial.author}
                drag={isTop ? 'x' : false}
                dragConstraints={{ left: -170, right: 70 }}
                dragElastic={0.16}
                dragMomentum={false}
                onDragEnd={(e, info) => {
                  if (!isTop) return
                  handleDragEnd({ offset: { x: info.offset.x } })
                }}
                style={{ x: isTop ? x : 0, zIndex: 100 - index }}
                animate={{
                  scale: 1 - index * 0.04,
                  y: index * 8,
                  opacity: 1 - index * 0.1,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                whileDrag={{ cursor: 'grabbing' }}
                className={`story-note absolute top-1/2 right-6 -translate-y-1/2 w-[min(86vw,330px)] ${pointerClass} touch-none select-none rounded-[24px] border border-sky-100 bg-white p-6 shadow-2xl shadow-sky-950/12`}
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
                  Drag left
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
