'use client'

import { motion } from 'framer-motion'
import { Search, Users, Heart } from 'lucide-react'
import { GlowCard } from '@/components/ui/spotlight-card'
import { useSettings } from '@/context/SettingsContext'

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Discover',
    description:
      'Browse local resources, upcoming events, and volunteer opportunities curated for your neighborhood — all in one place.',
    color: 'blue' as const,
    iconColor: '#56BBF0',
    accent: 'rgba(86,187,240,0.15)',
    accentBorder: 'rgba(86,187,240,0.25)',
  },
  {
    step: '02',
    icon: Users,
    title: 'Connect',
    description:
      'Join community events, RSVP with a single tap, and meet neighbors who share your values and passions.',
    color: 'purple' as const,
    iconColor: '#A78BFA',
    accent: 'rgba(167,139,250,0.15)',
    accentBorder: 'rgba(167,139,250,0.25)',
  },
  {
    step: '03',
    icon: Heart,
    title: 'Give Back',
    description:
      'Donate items from your wishlist, contribute volunteer hours, and create lasting impact right where you live.',
    color: 'green' as const,
    iconColor: '#34D399',
    accent: 'rgba(52,211,153,0.15)',
    accentBorder: 'rgba(52,211,153,0.25)',
  },
]

export function HowItWorks() {
  const { settings } = useSettings()
  const dk = settings.dark

  return (
    <section className="py-20 px-4" style={{ background: 'transparent' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <span className="section-eyebrow">Simple Steps</span>
          <h2
            className="font-syne text-3xl sm:text-4xl font-bold mt-2 mb-3"
            style={{ color: dk ? '#E0F2FE' : '#0B2A44' }}
          >
            Find.{' '}
            <span style={{ color: '#56BBF0' }}>Connect.</span>{' '}
            Give Back.
          </h2>
          <p
            className="font-outfit text-sm max-w-md mx-auto"
            style={{ color: dk ? 'rgba(186,230,253,0.65)' : 'rgba(8,93,138,0.7)' }}
          >
            CommunityConnect makes it effortless to engage with the people and causes around you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map(({ step, icon: Icon, title, description, color, iconColor, accent, accentBorder }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex"
            >
              <GlowCard
                glowColor={color}
                dark={dk}
                customSize
                className="w-full p-7 flex flex-col gap-5"
              >
                {/* Step badge + icon row */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-syne text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: accent,
                      border: `1px solid ${accentBorder}`,
                      color: iconColor,
                    }}
                  >
                    Step {step}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: accent, border: `1px solid ${accentBorder}` }}
                  >
                    <Icon size={18} style={{ color: iconColor }} />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="font-syne text-lg font-bold mb-2"
                    style={{ color: dk ? '#E0F2FE' : '#0B2A44' }}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-outfit text-sm leading-relaxed"
                    style={{ color: dk ? 'rgba(186,230,253,0.6)' : 'rgba(8,93,138,0.65)' }}
                  >
                    {description}
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
