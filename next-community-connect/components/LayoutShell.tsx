'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { AIChatWidget } from './AIChatWidget'
import { AppSidebar } from './AppSidebar'

const APP_ROUTES = ['/dashboard', '/submit', '/wishlist', '/settings']
const BARE_ROUTES = ['/signin']

function isAppRoute(pathname: string) {
  return APP_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
}

function isBareRoute(pathname: string) {
  return BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (isAppRoute(pathname)) {
    return (
      <>
        <AIChatWidget />
        <AppSidebar>{children}</AppSidebar>
      </>
    )
  }

  if (isBareRoute(pathname)) {
    return <main>{children}</main>
  }

  return (
    <>
      <AIChatWidget />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
