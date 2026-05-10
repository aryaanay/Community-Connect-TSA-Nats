'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Menu, X, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { useT } from '@/lib/useT'


const SCROLL_IDS = [
  { key: 'nav.mission',      id: 'mission' },
  { key: 'nav.story',        id: 'story' },
  { key: 'nav.testimonials', id: 'testimonials' },
  { key: 'nav.how',          id: 'how-it-works' },
  { key: 'nav.features',     id: 'features' },
  { key: 'nav.events',       id: 'events' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)   // user manually re-opened pill
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { isSignedIn, signOut } = useAuth()
  const { settings, dispatch } = useSettings()
  const isDark = settings.dark
  const isHome = pathname === '/'
  const t = useT()

  const SCROLL_LINKS = SCROLL_IDS.map(({ key, id }) => ({ label: t(key), id }))

  useEffect(() => {
    const handle = () => {
      // Collapse only once the hero image is fully scrolled past
      const scrolled = window.scrollY > window.innerHeight * 0.88
      setIsScrolled(scrolled)
      if (scrolled) setExpanded(false)
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setExpanded(false)
    setMobileOpen(false)
  }

  // Show the full link pill when: at top of page, OR user manually expanded
  const showPill = isHome && (!isScrolled || expanded)

  return (
    <LayoutGroup>
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none">
        <div className="flex items-start justify-between px-4 sm:px-6 pt-5 gap-3">

          {/* ─── Logo pill ───────────────────────────────────────────────── */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="liquid-glass pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl hover:scale-[1.03] transition-transform flex-shrink-0"
          >
            <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
              <circle cx="17" cy="17" r="15.5" stroke="#2499D6" strokeWidth="1.5"/>
              <circle cx="17" cy="17" r="3.5" fill="#2499D6"/>
              <circle cx="17" cy="7" r="2.5" fill="#56BBF0"/>
              <circle cx="26" cy="22" r="2.5" fill="#56BBF0"/>
              <circle cx="8" cy="22" r="2.5" fill="#56BBF0"/>
              <line x1="17" y1="13.5" x2="17" y2="9.5" stroke="#56BBF0" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="19.8" y1="18.5" x2="23.8" y2="20.5" stroke="#56BBF0" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14.2" y1="18.5" x2="10.2" y2="20.5" stroke="#56BBF0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-syne text-sm font-light text-white whitespace-nowrap">
              Community<strong className="font-bold">Connect</strong>
            </span>
          </Link>

          {/* ─── Center — collapsing pill (desktop only) ─────────────────── */}
          <div className="hidden lg:flex flex-1 justify-center pointer-events-auto">
            <motion.div
              layout
              className="liquid-glass"
              style={{ overflow: 'hidden' }}
              animate={{ borderRadius: showPill ? 16 : 20 }}
              transition={{ layout: { duration: 0.38, ease: EASE }, borderRadius: { duration: 0.38, ease: EASE } }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {showPill ? (
                  <motion.div
                    key="pill"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    className="flex items-center gap-0.5 px-3 py-2.5"
                  >
                    {SCROLL_LINKS.map(({ label, id }) => (
                      <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className="px-3 py-1.5 rounded-xl font-outfit text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.button
                    key="hamburger"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    onClick={() => setExpanded(true)}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <Menu size={15} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ─── Mobile hamburger (always visible on small screens) ───────── */}
          <div className="lg:hidden flex-1 flex justify-center pointer-events-auto">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>

          {/* ─── Right: dark mode + lang + settings + auth ──────────────── */}
          <div className="pointer-events-auto flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
              className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <Link
              href="/settings"
              className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Settings"
            >
              <Settings size={14} />
            </Link>

            <Link
              href="/references"
              className="liquid-glass hidden sm:flex font-outfit text-sm px-4 py-2.5 rounded-xl text-white transition-all whitespace-nowrap"
            >
              {t('nav.references')}
            </Link>

            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="liquid-glass hidden sm:flex font-outfit font-semibold text-sm px-4 py-2.5 rounded-xl text-sky-300 hover:text-sky-200 transition-all whitespace-nowrap"
              >
                {t('nav.dashboard')}
              </Link>
            ) : (
              <Link
                href="/signin"
                className="hidden sm:flex font-outfit font-semibold text-sm px-4 py-2.5 rounded-xl text-white hover:-translate-y-0.5 transition-all whitespace-nowrap"
                style={{ background: 'rgba(14,165,233,0.85)', border: '1px solid rgba(86,187,240,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 4px 20px rgba(14,165,233,0.35)' }}
              >
                {t('nav.signin')}
              </Link>
            )}
          </div>
        </div>

        {/* ─── Mobile dropdown ──────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="liquid-glass pointer-events-auto mx-4 mt-2 rounded-2xl overflow-hidden lg:hidden"
            >
              <div className="p-3">
                {isHome && (
                  <div className="grid grid-cols-2 gap-1 mb-3">
                    {SCROLL_LINKS.map(({ label, id }) => (
                      <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className="text-left px-4 py-2.5 rounded-xl font-outfit text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex flex-wrap gap-2">
                  <Link
                    href="/references"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 min-w-[100px] text-center py-2.5 rounded-xl font-outfit text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all"
                  >
                    {t('nav.references')}
                  </Link>
                  {isSignedIn ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                        className="flex-1 min-w-[100px] text-center py-2.5 rounded-xl font-outfit text-sm font-semibold text-sky-300 hover:bg-sky-500/15 transition-all">
                        {t('nav.dashboard')}
                      </Link>
                      <button onClick={() => { signOut(); setMobileOpen(false) }}
                        className="flex-1 min-w-[100px] py-2.5 rounded-xl font-outfit text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all">
                        {t('nav.signout')}
                      </button>
                    </>
                  ) : (
                    <Link href="/signin" onClick={() => setMobileOpen(false)}
                      className="flex-1 min-w-[100px] text-center py-2.5 rounded-xl font-outfit text-sm font-semibold text-white bg-sky-500/80 hover:bg-sky-500 transition-all">
                      {t('nav.signin')}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
