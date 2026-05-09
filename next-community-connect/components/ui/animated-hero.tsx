"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MoveRight, Sparkles } from "lucide-react"
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
  const isHomeHero = backgroundImage === undefined
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])

  // Always start at the top of the page when this hero mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])
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
      ref={containerRef}
      className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#022747' }}
    >
      {/* Parallax background image */}
      {isHomeHero ? (
        <motion.div
          className="absolute -top-[15%] -bottom-[15%] -left-[20%] -right-[20%]"
          style={{
            backgroundImage: "linear-gradient(145deg, rgba(1,22,41,0.86) 0%, rgba(4,64,105,0.76) 45%, rgba(13,123,181,0.48) 78%, rgba(255,140,66,0.22) 140%), url('/img/avess-berge-ua2IF9HNaXs-unsplash.png')",
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            y: bgY,
          }}
          animate={{ x: [-60, 60] }}
          transition={{ duration: 38, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
        />
      ) : backgroundImage ? (
        <motion.div className="absolute inset-0 -top-[15%] -bottom-[15%]"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            y: bgY,
          }}
        />
      ) : backgroundImage === '' ? (
        <div className="absolute inset-0" style={{ backgroundColor: '#011629' }} />
      ) : null}
      {/* Dark overlay for readability on pages with a photo background */}
      {backgroundImage && backgroundImage !== '' && <div className="absolute inset-0 bg-sky-950/60" />}
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

      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
        {/* Centered main content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2"
          >
            <span className="liquid-content flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">{badge}</span>
            </span>
          </motion.div>

          <div className="flex gap-3 flex-col w-full items-center">
            {staticTitle ? (
              <motion.h1
                initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-6xl lg:text-7xl max-w-4xl w-full tracking-tighter text-center font-bold font-space text-white mx-auto"
                dangerouslySetInnerHTML={{ __html: staticTitle }}
              />
            ) : (
              <h1 className="text-5xl md:text-6xl lg:text-7xl max-w-4xl w-full tracking-tighter text-center font-bold font-space text-white mx-auto">
                <span className="text-white">Your Community is</span>
                <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-3 md:pt-1">
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
              className="text-base md:text-lg leading-relaxed tracking-tight text-white/75 max-w-2xl w-full text-center font-outfit mx-auto"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          </div>

          {(primaryText || secondaryText) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-row gap-4"
            >
              {primaryText && primaryHref && (
                <Link href={primaryHref}>
                  <motion.button
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="liquid-glass inline-flex items-center px-8 py-3.5 rounded-2xl font-syne font-bold text-base transition-all"
                  >
                    <span className="liquid-content flex items-center gap-3 text-white">
                      {primaryText} <MoveRight className="w-4 h-4" />
                    </span>
                  </motion.button>
                </Link>
              )}
              {secondaryText && secondaryHref && (
                <Link href={secondaryHref}>
                  <motion.button
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-syne font-bold text-base transition-all border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    {secondaryText} <MoveRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
            </motion.div>
          )}
        </div>

        {/* Stats anchored at bottom, above scroll indicator */}
        {isHomeHero && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center divide-x divide-white/15 pb-20"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center px-8">
                <span className="font-space text-3xl font-bold text-white block">{stat.value}</span>
                <span className="font-outfit text-xs font-medium text-white/85 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/50"
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
