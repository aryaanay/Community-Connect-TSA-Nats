"use client"

import { Hero } from "@/components/ui/animated-hero"

function HeroDemo(props: any) {
  return (
    <div className="sticky top-0 z-0">
      <Hero {...props} />
    </div>
  )
}

export { HeroDemo }
