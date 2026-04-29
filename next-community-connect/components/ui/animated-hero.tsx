"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, HeartHandshake, MapPin, MoveRight, Search, Sparkles } from "lucide-react"
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
  const floatingCards = [
    { icon: Search, label: 'Food assistance', value: '12 nearby', delay: 0 },
    { icon: CalendarDays, label: 'This weekend', value: '4 events', delay: 0.15 },
    { icon: HeartHandshake, label: 'Volunteer match', value: 'Open now', delay: 0.3 },
    { icon: MapPin, label: 'Bothell hub', value: 'Live guide', delay: 0.45 },
  ]

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
      className="w-full min-h-screen flex items-center justify-center relative overflow-hidden kinetic-gradient"
      style={{
        backgroundColor: '#022747',
        backgroundImage: isHomeHero
          ? "linear-gradient(145deg, rgba(1,22,41,0.86) 0%, rgba(4,64,105,0.76) 45%, rgba(13,123,181,0.48) 78%, rgba(255,140,66,0.22) 140%), url('/img/avess-berge-ua2IF9HNaXs-unsplash.png')"
          : undefined,
        backgroundSize: isHomeHero ? 'cover' : undefined,
        backgroundPosition: isHomeHero ? 'center' : undefined,
        backgroundRepeat: isHomeHero ? 'no-repeat' : undefined,
        ...(backgroundImage !== null && backgroundImage !== undefined && backgroundImage !== '' ? {
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : backgroundImage === undefined && !isHomeHero ? {
          backgroundImage: `url('/img/avess-berge-ua2IF9HNaXs-unsplash.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : {}),
      }}
    >
      {/* Solid blue cover when no image wanted */}
      {backgroundImage === '' && <div className="absolute inset-0" style={{ backgroundColor: '#011629' }} />}
      {/* Dark overlay for readability - skip on homepage (no backgroundImage) */}
      {backgroundImage && <div className="absolute inset-0 bg-sky-950/60" />}
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(36,153,214,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(4,64,105,0.5)_0%,transparent_50%),radial-gradient(ellipse_at_60%_10%,rgba(198,235,255,0.2)_0%,transparent_40%)]" />
      </div>

      {isHomeHero && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute left-[-8%] top-[18%] h-24 w-[46%] rounded-full border border-white/10 bg-white/5 blur-[0.2px]"
            animate={{ x: [0, 34, 0], rotate: [-8, -4, -8] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute right-[-10%] bottom-[22%] h-20 w-[42%] rounded-full border border-sky-100/10 bg-sky-100/5 blur-[0.2px]"
            animate={{ x: [0, -28, 0], rotate: [9, 5, 9] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-sky-400/15 blur-[60px] animate-pulse" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-sky-600/25 blur-[60px] animate-pulse" />
        <div className="absolute top-1/2 left-[20%] w-[200px] h-[200px] rounded-full bg-sky-200/10 blur-[60px] animate-pulse" />
      </div>

      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex flex-col items-center justify-center py-24 lg:py-28">
          <div className="flex gap-8 items-center justify-center flex-col w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -2, scale: 1.03 }}
              className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2"
            >
              <span className="liquid-content flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">{badge}</span>
              </span>
            </motion.div>

          <div className="flex gap-4 flex-col w-full items-center">
            {staticTitle ? (
              <motion.h1
                initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
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
                  <motion.button
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-syne font-bold text-base transition-all liquid-glass"
                    style={{ color: 'white' }}
                  >
                    <span className="liquid-content inline-flex items-center gap-3">{primaryText} <MoveRight className="w-4 h-4" /></span>
                  </motion.button>
                </Link>
              )}
              {secondaryText && secondaryHref && (
                <Link href={secondaryHref}>
                  <motion.button
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-syne font-bold text-base transition-all bg-white/10 border border-white/25 backdrop-blur-xl"
                    style={{ color: 'white' }}
                  >
                    {secondaryText} <MoveRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
            </motion.div>
          )}

          {isHomeHero && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl liquid-glass rounded-[28px] p-3 mt-2"
            >
              <div className="liquid-content flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/14 border border-white/20 flex items-center justify-center">
                  <Search className="w-5 h-5 text-sky-100" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-outfit text-xs uppercase tracking-[0.14em] text-sky-100/55">Try a fast search</p>
                  <motion.p
                    className="font-space text-base sm:text-lg text-white font-semibold"
                    animate={{ opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Find tutoring, food help, events, or volunteers
                  </motion.p>
                </div>
                <Link href="/resources" className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-sky-200 text-sky-950 font-space text-sm font-bold hover:bg-white transition-colors">
                  Go
                </Link>
              </div>
            </motion.div>
          )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center divide-x divide-white/15 mt-12"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center px-8"
                  whileHover={{ y: -5, scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <span className="font-space text-3xl font-bold text-white block">{stat.value}</span>
                  <span className="font-outfit text-xs font-medium text-white/85 uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {isHomeHero && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 hidden xl:grid grid-cols-4 gap-3 w-full max-w-5xl"
            >
              {floatingCards.map(({ icon: Icon, label, value, delay }) => (
                <motion.div
                  key={label}
                  className="liquid-glass rounded-2xl px-4 py-3 glass-float"
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.9 + delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ animationDelay: `${delay * 2.5}s` }}
                >
                  <div className="liquid-content flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/14 border border-white/15 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-sky-100" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-outfit text-[11px] uppercase tracking-[0.12em] text-sky-100/60 truncate">{label}</p>
                      <p className="font-space text-sm font-semibold text-white truncate">{value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
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
