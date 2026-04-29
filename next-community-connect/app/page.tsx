'use client'

import { HeroDemo } from '@/components/ui/animated-hero-demo'
import { MissionTicker } from '@/components/MissionTicker'
import { AboutSection } from '@/components/AboutSection'
import { Services } from '@/components/Services'
import { Spotlights } from '@/components/Spotlights'
import { Testimonials } from '@/components/Testimonials'
import { Founders } from '@/components/Founders'

export default function HomePage() {
  return (
    <>
<HeroDemo
  primaryHref="/resources"
  primaryText="Explore Resources"
  secondaryHref="/events"
  secondaryText="Upcoming Events"
/>
      <MissionTicker />
      <AboutSection />
      <Services />
      <Spotlights />
      <Testimonials />
      <Founders />

    </>
  )
}

