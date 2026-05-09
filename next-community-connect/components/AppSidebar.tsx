'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, CalendarDays, PlusCircle,
  Heart, Settings, LogOut, ChevronLeft, ChevronRight, Menu, ArrowLeft, Map,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { getT } from '@/lib/translations'

const NAV_DEFS = [
  { href: '/dashboard',          icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/dashboard/resources',icon: BookOpen,        key: 'nav.resources' },
  { href: '/dashboard/events',   icon: CalendarDays,    key: 'nav.events' },
  { href: '/submit',             icon: PlusCircle,      key: 'nav.submit' },
  { href: '/wishlist',           icon: Heart,           key: 'nav.donate' },
  { href: '/dashboard/map',      icon: Map,             key: 'nav.map' },
  { href: '/dashboard/settings', icon: Settings,        key: 'nav.settings' },
]

function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="14" cy="14" r="12.5" stroke="#56BBF0" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="3" fill="#56BBF0" />
      <circle cx="14" cy="5.5" r="2" fill="#90D4F7" />
      <circle cx="21.5" cy="18.5" r="2" fill="#90D4F7" />
      <circle cx="6.5" cy="18.5" r="2" fill="#90D4F7" />
      <line x1="14" y1="11" x2="14" y2="7.5" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="16.5" y1="15.5" x2="19.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11.5" y1="15.5" x2="8.5" y2="17" stroke="#90D4F7" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function SidebarInner({
  collapsed,
  setCollapsed,
  pathname,
  user,
  onSignOut,
  onNavClick,
  t,
}: {
  collapsed: boolean
  setCollapsed: (fn: (v: boolean) => boolean) => void
  pathname: string
  user: { email?: string } | null
  onSignOut: () => void
  onNavClick: () => void
  t: (key: string) => string
}) {
  return (
    <div className="flex flex-col h-full relative">
      {/* Logo */}
      <div
        className={`flex items-center border-b border-sky-400/10 flex-shrink-0 ${
          collapsed ? 'justify-center px-4 py-5' : 'gap-3 px-5 py-5'
        }`}
      >
        <Link href="/dashboard" onClick={onNavClick} className="flex-shrink-0">
          <Logo size={26} />
        </Link>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden min-w-0"
            >
              <Link href="/dashboard" onClick={onNavClick} className="block whitespace-nowrap leading-none">
                <span className="font-syne text-sm font-light text-white">Community</span>
                <span className="font-syne text-sm font-black text-sky-400">Connect</span>
              </Link>
              <p className="font-outfit text-[10px] text-sky-300/45 uppercase tracking-widest mt-0.5">
                Bothell, WA
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_DEFS.map(({ href, icon: Icon, key }) => {
          const label = t(key)
          const isActive =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              title={collapsed ? label : undefined}
              className={`
                flex items-center rounded-xl transition-all duration-150 group
                ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}
                ${
                  isActive
                    ? 'bg-sky-500/18 text-sky-300 border border-sky-400/22'
                    : 'text-sky-100/50 hover:text-sky-200 hover:bg-white/5'
                }
              `}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${isActive ? 'text-sky-400' : ''}`}
              />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                    className="font-outfit text-sm whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}

        <div className="pt-3 mt-1 border-t border-sky-400/8">
          <Link
            href="/"
            onClick={onNavClick}
            title={collapsed ? t('nav.back') : undefined}
            className={`
              flex items-center rounded-xl transition-all duration-150
              text-sky-100/30 hover:text-sky-200/60 hover:bg-white/4
              ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}
            `}
          >
            <ArrowLeft size={16} className="flex-shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-outfit text-xs whitespace-nowrap"
                >
                  {t('nav.back')}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </nav>

      {/* User + sign out */}
      <div className="border-t border-sky-400/10 px-2 py-3 space-y-1 flex-shrink-0">
        <AnimatePresence initial={false}>
          {!collapsed && user?.email && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="px-3 py-2 rounded-xl mb-1"
                style={{
                  background: 'rgba(86,187,240,0.06)',
                  border: '1px solid rgba(86,187,240,0.12)',
                }}
              >
                <p className="font-outfit text-[10px] text-sky-300/50 mb-0.5 uppercase tracking-wider">
                  Signed in as
                </p>
                <p className="font-outfit text-xs text-sky-200 truncate">{user.email}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onSignOut}
          title={collapsed ? t('nav.signout') : undefined}
          className={`
            flex items-center w-full rounded-xl transition-all duration-150
            text-sky-100/35 hover:text-red-300 hover:bg-red-500/8
            ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}
          `}
        >
          <LogOut size={16} className="flex-shrink-0" />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-outfit text-sm whitespace-nowrap"
              >
                {t('nav.signout')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-[76px] hidden lg:flex items-center justify-center w-6 h-6 rounded-full border border-sky-400/25 text-sky-400 hover:text-white hover:border-sky-300/50 transition-all z-10"
        style={{ background: 'linear-gradient(135deg, #022747, #033460)' }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </div>
  )
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { settings } = useSettings()
  const t = getT(settings.language)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const sidebarProps = {
    pathname,
    user,
    onSignOut: handleSignOut,
    t,
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #011629 0%, #022747 100%)' }}
    >
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 252 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col flex-shrink-0 relative border-r border-sky-400/12"
        style={{
          background:
            'linear-gradient(180deg, rgba(2,39,71,0.98) 0%, rgba(3,52,96,0.96) 100%)',
        }}
      >
        <SidebarInner
          {...sidebarProps}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onNavClick={() => {}}
        />
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 bottom-0 z-50 w-[252px] flex flex-col lg:hidden border-r border-sky-400/15"
            style={{ background: 'linear-gradient(180deg, #022747 0%, #033460 100%)' }}
          >
            <SidebarInner
              {...sidebarProps}
              collapsed={false}
              setCollapsed={() => {}}
              onNavClick={() => setMobileOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile topbar */}
        <header
          className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-sky-400/12 flex-shrink-0"
          style={{ background: 'rgba(2,39,71,0.97)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="text-sky-300 hover:text-sky-200 transition-colors p-1"
          >
            <Menu size={20} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo size={20} />
            <span className="font-syne text-sm font-bold text-white">CommunityConnect</span>
          </Link>
          <div className="w-7" />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
