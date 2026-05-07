'use client'

import { motion } from 'framer-motion'
import { TestimonialCarousel } from '@/components/ui/testimonial'

const testimonialData = [
  {
    id: 1,
    name: 'Maria Rodriguez',
    role: 'Parent, Eastside Neighborhood',
    avatar: 'https://i.pravatar.cc/150?img=47',
    description: 'Through Community Connect, I found volunteer tutors who helped my daughter excel in math. Weekly sessions became a mentorship that changed her confidence.',
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Volunteer, 2 years',
    avatar: 'https://i.pravatar.cc/150?img=11',
    description: 'I wanted to give back but did not know where to start. Community Connect matched me with our local food bank, and now I volunteer every weekend.',
  },
  {
    id: 3,
    name: 'Riverside Neighbors',
    role: 'Community Group',
    avatar: 'https://i.pravatar.cc/150?img=32',
    description: 'We used Community Connect to organize a neighborhood cleanup and over 50 volunteers showed up. A neglected park is now a family gathering space.',
  },
  {
    id: 4,
    name: 'Aisha Patel',
    role: 'Caregiver',
    avatar: 'https://i.pravatar.cc/150?img=45',
    description: 'The resource directory helped me find senior transportation and meal support for my dad in one afternoon. Incredibly easy to use.',
  },
  {
    id: 5,
    name: 'Northshore Students',
    role: 'Student Group',
    avatar: 'https://i.pravatar.cc/150?img=13',
    description: 'Our club found three nonprofits that needed student volunteers. It made service hours feel useful instead of random.',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 glass-bg backdrop-blur" id="stories">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-eyebrow">Community Stories</span>
          <h2 className="section-heading">Real people, real impact.</h2>
          <p className="mx-auto max-w-lg font-dm-sans text-sm text-sky-700">
            Drag or tap the dots to explore stories from residents who found connection through our platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          <TestimonialCarousel
            testimonials={testimonialData}
            showArrows
            showDots
            className="max-w-full"
          />
        </motion.div>
      </div>
    </section>
  )
}
