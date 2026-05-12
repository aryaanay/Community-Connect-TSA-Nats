'use client'

import { motion } from 'framer-motion'
import { TestimonialCarousel } from '@/components/ui/testimonial'

const testimonialData = [
  {
    id: 1,
    name: 'Maria Rodriguez',
    role: 'Parent, Eastside Neighborhood',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    description: 'Through Community Connect, I found volunteer tutors who helped my daughter excel in math. Weekly sessions became a mentorship that changed her confidence.',
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Volunteer, 2 years',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    description: 'I wanted to give back but did not know where to start. Community Connect matched me with our local food bank, and now I volunteer every weekend.',
  },
  {
    id: 3,
    name: 'Riverside Neighbors',
    role: 'Community Group',
    avatarColor: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    description: 'We used Community Connect to organize a neighborhood cleanup and over 50 volunteers showed up. A neglected park is now a family gathering space.',
  },
  {
    id: 4,
    name: 'Aisha Patel',
    role: 'Caregiver',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: 'The resource directory helped me find senior transportation and meal support for my dad in one afternoon. Incredibly easy to use.',
  },
  {
    id: 5,
    name: 'Northshore Students',
    role: 'Student Group',
    avatarColor: 'linear-gradient(135deg, #be185d 0%, #f472b6 100%)',
    description: 'Our club found three nonprofits that needed student volunteers. It made service hours feel useful instead of random.',
  },
  {
    id: 6,
    name: 'Derek Osei',
    role: 'Job Seeker',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    description: 'I found a resume workshop and interview coaching sessions listed on Community Connect. Two months later I had a job offer. Cannot thank this platform enough.',
  },
  {
    id: 7,
    name: 'Linda Nakamura',
    role: 'Senior Resident',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    description: 'At 74, navigating city services felt overwhelming. Community Connect gave me a simple list of what is available near me and who to call. Life-changing.',
  },
]

export function Testimonials() {
  return (
    <section className="pt-10 pb-20 glass-bg backdrop-blur" id="stories">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="section-eyebrow">Community Stories</span>
          <h2 className="section-heading">Real people, real impact.</h2>
          <p className="mx-auto max-w-lg font-dm-sans text-sm text-sky-700">
            Drag or tap the dots to explore stories from residents who found connection through our platform.
          </p>
          <p className="mx-auto mt-4 max-w-md font-dm-sans text-xs text-sky-600 leading-relaxed">
            Names are fictional and used for competition purposes only. Any resemblance to real persons is coincidental.
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
