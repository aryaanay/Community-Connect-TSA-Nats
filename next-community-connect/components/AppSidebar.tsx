'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, CalendarDays, PlusCircle,
  Heart, Settings, LogOut, ChevronLeft, ChevronRight, Menu, Map,
  HelpCircle, UserCircle, LifeBuoy, Users2, Layers, PackageSearch, X, FileText,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { getT } from '@/lib/translations'
import { TutorialModal } from '@/components/TutorialModal'
import { AchievementPopup } from '@/components/AchievementPopup'
import { useAchievements } from '@/context/AchievementsContext'

const TUTORIAL_SEEN_KEY = 'cc-tutorial-seen'

type NavGroup = {
  label?: string
  items: { href: string; icon: React.ElementType; key: string }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { href: '/dashboard', icon: LayoutDashboard, key: 'nav.dashboard' },
    ],
  },
  {
    label: 'Discover',
    items: [
      { href: '/dashboard/resources', icon: BookOpen,     key: 'nav.resources' },
      { href: '/dashboard/events',    icon: CalendarDays, key: 'nav.events'    },
      { href: '/dashboard/map',       icon: Map,          key: 'nav.map'       },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/dashboard/social',      icon: Users2,        key: 'nav.social'    },
      { href: '/dashboard/groups',      icon: Layers,        key: 'nav.groups'    },
      { href: '/dashboard/lost-found',  icon: PackageSearch, key: 'nav.lostfound' },
    ],
  },
  {
    label: 'Give Back',
    items: [
      { href: '/submit',   icon: PlusCircle, key: 'nav.submit' },
      { href: '/wishlist', icon: Heart,      key: 'nav.donate' },
    ],
  },
]

// Flat list derived from groups — used for active-link matching
const NAV_DEFS = NAV_GROUPS.flatMap(g => g.items)

const BOTTOM_NAV = [
  { href: '/dashboard/profile',    icon: UserCircle, key: 'nav.profile'    },
  { href: '/dashboard/help',       icon: LifeBuoy,   key: 'nav.help'       },
  { href: '/dashboard/settings',   icon: Settings,   key: 'nav.settings'   },
  { href: '/dashboard/references', icon: FileText,   key: 'nav.references' },
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
  onTutorial,
  t,
  isMobile,
}: {
  collapsed: boolean
  setCollapsed: (fn: (v: boolean) => boolean) => void
  pathname: string
  user: { email?: string } | null
  onSignOut: () => void
  onNavClick: () => void
  onTutorial: () => void
  t: (key: string) => string
  isMobile?: boolean
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
              className="overflow-hidden min-w-0 flex-1"
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
        {isMobile && (
          <button
            onClick={onNavClick}
            className="ml-auto flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-sky-300/60 hover:text-sky-200 hover:bg-sky-400/10 transition-all"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-1' : ''}>
            {/* Group label */}
            <AnimatePresence initial={false}>
              {!collapsed && group.label && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-outfit text-[9px] font-bold uppercase tracking-widest px-3 pt-3 pb-1"
                  style={{ color: 'rgba(86,187,240,0.28)' }}
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            {collapsed && group.label && gi > 0 && (
              <div className="mx-auto w-5 h-px my-2" style={{ background: 'rgba(86,187,240,0.12)' }} />
            )}

            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, key }) => {
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
                          : 'text-sky-100/75 hover:text-sky-200 hover:bg-white/8'
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
            </div>
          </div>
        ))}
      </nav>

      {/* Account section — visually separated from main nav tools */}
      <div className="flex-shrink-0 border-t border-sky-400/10 px-2 pt-2 pb-2">
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'rgba(86,187,240,0.045)',
            border: '1px solid rgba(86,187,240,0.1)',
          }}
        >
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-outfit text-[9px] font-bold uppercase tracking-widest px-3 pt-2.5 pb-1"
                style={{ color: 'rgba(86,187,240,0.3)' }}
              >
                Account
              </motion.p>
            )}
          </AnimatePresence>
          <div className={`p-1 space-y-0.5 ${collapsed ? 'pt-2' : ''}`}>
            {BOTTOM_NAV.map(({ href, icon: Icon, key }) => {
              const label = t(key)
              const isActive = pathname === href || pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavClick}
                  title={collapsed ? label : undefined}
                  className={`
                    flex items-center rounded-lg transition-all duration-150
                    ${collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2'}
                    ${isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-400/20'
                      : 'text-sky-200/65 hover:text-sky-100 hover:bg-white/8'
                    }
                  `}
                >
                  <Icon size={15} className={`flex-shrink-0 ${isActive ? 'text-sky-400' : ''}`} />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.15 }}
                        className="font-outfit text-xs whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )
            })}

            <button
              onClick={() => { onNavClick(); onTutorial() }}
              title={collapsed ? 'Site Tutorial' : undefined}
              className={`
                flex items-center w-full rounded-lg transition-all duration-150
                text-sky-200/65 hover:text-sky-100 hover:bg-white/8
                ${collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2'}
              `}
            >
              <HelpCircle size={15} className="flex-shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="font-outfit text-xs whitespace-nowrap">
                    Site Tutorial
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={onSignOut}
              title={collapsed ? t('nav.signout') : undefined}
              className={`
                flex items-center w-full rounded-lg transition-all duration-150
                text-sky-200/65 hover:text-red-300 hover:bg-red-500/10
                ${collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2'}
              `}
            >
              <LogOut size={15} className="flex-shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="font-outfit text-xs whitespace-nowrap">
                    {t('nav.signout')}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
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
  const [showTutorial, setShowTutorial] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { settings } = useSettings()
  const t = getT(settings.language)
  const { unlock } = useAchievements()

  // Reset scroll position of the main content area whenever the route changes
  useEffect(() => {
    const mainEl = document.querySelector<HTMLElement>('main')
    if (mainEl) mainEl.scrollTop = 0
  }, [pathname])

  // Auto-open tutorial on first visit
  useEffect(() => {
    try {
      if (!localStorage.getItem(TUTORIAL_SEEN_KEY)) {
        setShowTutorial(true)
        localStorage.setItem(TUTORIAL_SEEN_KEY, '1')
      }
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
  }, [])

  // Unlock first_login only when the user just signed in (sessionStorage flag set by sign-in page)
  useEffect(() => {
    if (!user) return
    try {
      if (sessionStorage.getItem('cc-just-signed-in')) {
        sessionStorage.removeItem('cc-just-signed-in')
        setTimeout(() => unlock('first_login'), 1200)
      }
    } catch { /* private mode */ }
  }, [user, unlock])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const sidebarProps = {
    pathname,
    user,
    onSignOut: handleSignOut,
    onTutorial: () => setShowTutorial(true),
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
              isMobile
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

      {/* Tutorial modal — rendered at the top level so it overlays everything */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialModal onClose={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>

      {/* Achievement popup queue */}
      <AchievementPopup />
    </div>
  )
}
