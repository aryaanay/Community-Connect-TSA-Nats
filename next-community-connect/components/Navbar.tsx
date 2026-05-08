'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Menu, X, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'

const SCROLL_LINKS = [
  { label: 'Mission',      id: 'mission' },
  { label: 'Our Story',    id: 'story' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Features',     id: 'features' },
  { label: 'Events',       id: 'events' },
]

// Visible on both dark hero and white content sections
const glass: React.CSSProperties = {
  background: 'rgba(3, 18, 46, 0.68)',
  border: '1px solid rgba(86,187,240,0.24)',
  backdropFilter: 'blur(20px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
}

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

  useEffect(() => {
    const handle = () => {
      const scrolled = window.scrollY > 80
      setIsScrolled(scrolled)
      setExpanded(false) // always collapse on any scroll
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
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl hover:scale-[1.03] transition-transform flex-shrink-0"
            style={glass}
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
              style={{ ...glass, overflow: 'hidden' }}
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
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              style={glass}
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>

          {/* ─── Right: dark mode + settings + auth ──────────────────────── */}
          <div className="pointer-events-auto flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              style={glass}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <Link
              href="/settings"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              style={glass}
              aria-label="Settings"
            >
              <Settings size={14} />
            </Link>

            <Link
              href="/references"
              className="hidden sm:flex font-outfit text-sm px-4 py-2.5 rounded-xl text-white hover:bg-white/10 transition-all whitespace-nowrap"
              style={glass}
            >
              References
            </Link>

            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="hidden sm:flex font-outfit font-semibold text-sm px-4 py-2.5 rounded-xl text-sky-300 hover:text-sky-200 transition-all whitespace-nowrap"
                style={glass}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/signin"
                className="hidden sm:flex font-outfit font-semibold text-sm px-4 py-2.5 rounded-xl text-white hover:-translate-y-0.5 transition-all whitespace-nowrap"
                style={{ background: 'rgba(14,165,233,0.80)', border: '1px solid rgba(86,187,240,0.40)', backdropFilter: 'blur(12px)' }}
              >
                Sign In / Sign Up
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
              className="pointer-events-auto mx-4 mt-2 rounded-2xl overflow-hidden lg:hidden"
              style={{ background: 'rgba(3,18,46,0.88)', border: '1px solid rgba(86,187,240,0.18)', backdropFilter: 'blur(24px)' }}
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
                    References
                  </Link>
                  {isSignedIn ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                        className="flex-1 min-w-[100px] text-center py-2.5 rounded-xl font-outfit text-sm font-semibold text-sky-300 hover:bg-sky-500/15 transition-all">
                        Dashboard
                      </Link>
                      <button onClick={() => { signOut(); setMobileOpen(false) }}
                        className="flex-1 min-w-[100px] py-2.5 rounded-xl font-outfit text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link href="/signin" onClick={() => setMobileOpen(false)}
                      className="flex-1 min-w-[100px] text-center py-2.5 rounded-xl font-outfit text-sm font-semibold text-white bg-sky-500/80 hover:bg-sky-500 transition-all">
                      Sign In / Sign Up
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
