'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
{ href: '/resources', label: 'Resources' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/submit', label: 'Submit' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isSignedIn, user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDark])

  return (
    <div
      className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{
        top: 0,
        paddingTop: isScrolled ? '0px' : '24px',
        transition: 'padding 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <motion.nav
        animate={{
          borderRadius: isScrolled ? '0px' : '20px',
          maxWidth: isScrolled ? '100vw' : '90vw',
          backgroundColor: isScrolled ? 'rgba(2,39,71,0.97)' : 'rgba(255,255,255,0.10)',
          borderColor: isScrolled ? 'rgba(36,153,214,0.3)' : 'rgba(255,255,255,0.20)',
          boxShadow: isScrolled
            ? '0 4px 32px rgba(2,39,71,0.5), 0 1px 0 rgba(36,153,214,0.25)'
            : '0 8px 32px rgba(4,64,105,0.18)',
          paddingLeft: isScrolled ? '2.5rem' : '2rem',
          paddingRight: isScrolled ? '2.5rem' : '2rem',
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={`w-full border backdrop-blur-xl pointer-events-auto overflow-hidden ${isSignedIn ? 'py-5' : 'py-4'}`}
      >
        <div className="flex items-center justify-between w-full">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 hover:scale-105 transition-transform">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="17" cy="17" r="15.5" stroke="#2499D6" strokeWidth="1.5"/>
              <circle cx="17" cy="17" r="3.5" fill="#2499D6"/>
              <circle cx="17" cy="7" r="2.5" fill="#56BBF0"/>
              <circle cx="26" cy="22" r="2.5" fill="#56BBF0"/>
              <circle cx="8" cy="22" r="2.5" fill="#56BBF0"/>
              <line x1="17" y1="13.5" x2="17" y2="9.5" stroke="#56BBF0" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="19.8" y1="18.5" x2="23.8" y2="20.5" stroke="#56BBF0" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14.2" y1="18.5" x2="10.2" y2="20.5" stroke="#56BBF0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-syne text-lg font-light text-white tracking-tight whitespace-nowrap drop-shadow-sm">
              Community<strong className="font-bold">Connect</strong>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Link
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative block ${
                    pathname === link.href
                      ? 'text-white bg-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-300 rounded-full" />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 flex-shrink-0">

            {/* Settings / Accessibility */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/settings"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                aria-label="Accessibility settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </motion.div>

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </motion.button>

            {/* Auth */}
            <div className="hidden sm:flex items-center gap-1">
              {isSignedIn ? (
                <>
                  <span className="font-outfit text-xs text-white/60 px-2">{user?.email ?? 'User'}</span>
                  <button
                    onClick={signOut}
                    className="text-white/75 hover:text-white font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* CTA Links */}
            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/copyright"
                className="text-white/75 hover:text-white font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
              >
                Copyright
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 rounded-full p-2 transition-all"
              aria-label="Menu"
            >
              <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center block ${isMobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 block ${isMobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center block ${isMobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 border-t border-white/10 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block py-3 px-4 rounded-xl text-base font-medium text-white/90 hover:text-white hover:bg-white/20 transition-all mb-1 ${
                      pathname === link.href ? 'bg-white/20' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-2 mt-3">
                  <Link
                    href="/copyright"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex-1 flex items-center justify-center bg-white/10 border border-white/20 text-white font-semibold px-4 py-3 rounded-2xl hover:bg-white/20 transition-all text-sm"
                  >
                    Copyright
                  </Link>
                  {isSignedIn ? (
                    <button
                      onClick={() => { signOut(); setIsMobileOpen(false) }}
                      className="flex-1 flex items-center justify-center bg-white/10 border border-white/20 text-white font-semibold px-4 py-3 rounded-2xl hover:bg-white/20 transition-all text-sm"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      href="/signin"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex-1 flex items-center justify-center bg-sky-500 text-white font-semibold px-4 py-3 rounded-2xl hover:bg-sky-400 transition-all text-sm"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  )
}
