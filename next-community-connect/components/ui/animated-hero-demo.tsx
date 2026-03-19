"use client"

import { Hero } from "@/components/ui/animated-hero"

function HeroDemo(props: any) {
  return (
    <div className="block">
      <Hero {...props} />
    </div>
  )
}

export { HeroDemo }
