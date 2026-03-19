"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MoveRight, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroProps {
  badge?: string;
  staticTitle?: string;
  rotatingTitles?: string[];
  subtitle?: string;
  primaryHref?: string;
  primaryText?: string;
  secondaryHref?: string;
  secondaryText?: string;
  stats?: Array<{value: string; label: string}>;
  backgroundImage?: string;
}

function Hero({
  badge = 'Serving Our Community Since 2020',
  staticTitle,
  rotatingTitles = ["amazing", "wonderful", "strong", "united", "connected"],
  subtitle = 'Find nonprofits, support services, events, and volunteers. All in one place, built for every resident.',
  primaryHref,
  primaryText,
  secondaryHref,
  secondaryText,
  stats = [
    {value: '30+', label: 'Resources Listed'},
    {value: '150+', label: 'Volunteers'},
    {value: '10', label: 'Partner Orgs'}
  ],
  backgroundImage,
}: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === rotatingTitles.length - 1) {
        setTitleNumber(0)
      } else {
        setTitleNumber(titleNumber + 1)
      }
    }, 2500)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, rotatingTitles])

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#022747',
        backgroundImage: `url('${backgroundImage ?? '/img/avess-berge-ua2IF9HNaXs-unsplash.png'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for readability - skip on homepage (no backgroundImage) */}
      {backgroundImage && <div className="absolute inset-0 bg-sky-950/60" />}
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(36,153,214,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(4,64,105,0.5)_0%,transparent_50%),radial-gradient(ellipse_at_60%_10%,rgba(198,235,255,0.2)_0%,transparent_40%)]" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-sky-400/15 blur-[60px] animate-pulse" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-sky-600/25 blur-[60px] animate-pulse" />
        <div className="absolute top-1/2 left-[20%] w-[200px] h-[200px] rounded-full bg-sky-200/10 blur-[60px] animate-pulse" />
      </div>

      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-sky-800/80 border border-sky-400/50 rounded-full px-4 py-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
              <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">{badge}</span>
            </motion.div>

          <div className="flex gap-4 flex-col w-full items-center">
            {staticTitle ? (
              <h1
                className="text-5xl md:text-7xl lg:text-8xl max-w-4xl w-full tracking-tighter text-center font-bold font-space text-white mx-auto"
                dangerouslySetInnerHTML={{ __html: staticTitle }}
              />
            ) : (
              <h1 className="text-5xl md:text-7xl lg:text-8xl max-w-4xl w-full tracking-tighter text-center font-bold font-space text-white mx-auto">
                <span className="text-white">Your Community is</span>
                <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-2">
                  &nbsp;
                {rotatingTitles.map((title: string, index: number) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold text-sky-200"
                    initial={{ opacity: 0, y: "-100%" }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
                </span>
              </h1>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl leading-relaxed tracking-tight text-white/75 max-w-2xl w-full text-center font-outfit mx-auto"
            >
              {subtitle}
            </motion.p>
          </div>

          {(primaryText || secondaryText) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-row gap-4 mt-4"
            >
              {primaryText && primaryHref && (
                <Link href={primaryHref}>
                  <button
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-syne font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.35)' }}
                  >
                    {primaryText} <MoveRight className="w-4 h-4" />
                  </button>
                </Link>
              )}
              {secondaryText && secondaryHref && (
                <Link href={secondaryHref}>
                  <button
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-syne font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.35)' }}
                  >
                    {secondaryText} <MoveRight className="w-4 h-4" />
                  </button>
                </Link>
              )}
            </motion.div>
          )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center divide-x divide-white/15 mt-12"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center px-8">
                  <span className="font-space text-3xl font-bold text-white block">{stat.value}</span>
                  <span className="font-outfit text-xs font-medium text-white/85 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/50"
      >
        <div className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center">
          <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <span className="text-[11px] uppercase tracking-[1.5px]">Scroll</span>
      </motion.div>
    </div>
  )
}

export { Hero }