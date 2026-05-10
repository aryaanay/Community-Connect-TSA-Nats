'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '@/context/SettingsContext'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'

type WorkEntry = { date: string; members: string; hours: string; task: string }

const workLog: WorkEntry[] = [
  { date: '04/15/2026', members: 'AA, NS, SP, GM, AK, VM', hours: '3.0', task: 'Team kickoff meeting — defined project scope, wireframed homepage and dashboard layout, assigned roles' },
  { date: '04/16/2026', members: 'AA, SP', hours: '4.5', task: 'Bootstrapped Next.js 14 project with TypeScript, Tailwind CSS, Framer Motion; configured Supabase project and environment variables' },
  { date: '04/17/2026', members: 'NS, GM', hours: '3.5', task: 'Built homepage hero section and Navbar with glassmorphism pill design; dark/light mode toggle' },
  { date: '04/18/2026', members: 'AA, AK', hours: '5.0', task: 'Implemented Supabase Auth — sign-up, sign-in, session persistence, AuthContext provider; protected route redirects' },
  { date: '04/19/2026', members: 'SP, VM', hours: '4.0', task: 'Developed Resource Listings page with category filters, parallax scroll sections, and Bothell-area nonprofit data' },
  { date: '04/20/2026', members: 'NS, GM', hours: '3.0', task: 'Built About / Mission, Our Story, and Testimonials homepage sections; added scroll-linked animations' },
  { date: '04/21/2026', members: 'AA, NS, SP, GM, AK, VM', hours: '2.5', task: 'Collaboration session — code review and integration testing; resolved merge conflicts; aligned on dashboard sidebar design' },
  { date: '04/22/2026', members: 'AK, VM', hours: '4.5', task: 'Events page with interactive calendar grid, event detail cards, and registration flow (mock)' },
  { date: '04/23/2026', members: 'AA, SP', hours: '5.0', task: 'Lost & Found feature — Supabase table, post form with image upload, search/filter, item cards with contact modal' },
  { date: '04/24/2026', members: 'NS, GM', hours: '3.5', task: 'Settings & Accessibility panel — font size, color-blind mode, reduced motion, grayscale; persisted via SettingsContext' },
  { date: '04/25/2026', members: 'AK, VM', hours: '3.0', task: 'Interactive map page (Bothell area) with resource pin overlays and category legend' },
  { date: '04/26/2026', members: 'AA, NS, SP, GM, AK, VM', hours: '3.0', task: 'Collaboration session — demo walkthrough, user flow testing, UI polish pass across all pages' },
  { date: '04/27/2026', members: 'AA, AK', hours: '4.0', task: 'Profile page — avatar upload, display name edit, password change section; Supabase storage integration' },
  { date: '04/28/2026', members: 'SP, VM', hours: '3.5', task: 'Dashboard AppSidebar — collapsible sections, active route highlighting, Account dropdown with sign-out' },
  { date: '04/29/2026', members: 'NS, GM', hours: '3.0', task: 'Judge sign-in flow — demo credentials, fallback session, judge-specific UI indicator and banner' },
  { date: '04/30/2026', members: 'AA, NS, SP', hours: '4.0', task: 'Bug fix session — JWT refresh on Lost & Found insert, RLS policy corrections, mobile responsiveness fixes' },
  { date: '05/01/2026', members: 'AK, VM, GM', hours: '5.0', task: 'Community Favors board — post/help/close flow, Supabase favors and favor_helps tables, XP reward system' },
  { date: '05/02/2026', members: 'AA, SP', hours: '4.5', task: 'Per-user Achievements system — user_achievements Supabase table, AchievementsContext, unlock animations, dashboard badge display' },
  { date: '05/03/2026', members: 'AA, NS, SP, GM, AK, VM', hours: '3.0', task: 'Collaboration session — tested full auth/feature flows end-to-end; reviewed accessibility settings; finalized color palette' },
  { date: '05/04/2026', members: 'NS, GM', hours: '5.5', task: 'Full i18n implementation — expanded translations.ts to 250+ keys across 10 languages (en, es, fr, zh, vi, tl, ko, ar, hi, pt); wired useT() into home, signin, lost-found, favors pages' },
  { date: '05/05/2026', members: 'AK, VM', hours: '3.5', task: 'References page — project info, copyright checklist, sources table, framework and accessibility statements' },
  { date: '05/06/2026', members: 'AA, SP', hours: '3.0', task: 'Performance audit — image optimization, lazy loading, bundle size reduction; Lighthouse scores review' },
  { date: '05/07/2026', members: 'AA, NS, SP, GM, AK, VM', hours: '2.5', task: 'Collaboration session — final feature parity check, peer QA on mobile viewports, edge case fixes' },
  { date: '05/08/2026', members: 'NS, GM', hours: '3.0', task: 'Language switcher in Navbar — Globe icon button, animated dropdown with flag and label for all 10 locales, REPLACE_STATE dispatch' },
  { date: '05/09/2026', members: 'AA, SP', hours: '2.5', task: 'Mission section rewrite — problem-first narrative, updated headline and body copy; work log migrated to coded table' },
  { date: '05/10/2026', members: 'AK, VM, GM', hours: '3.5', task: 'Final polish pass — typography consistency, spacing fixes, dark mode color corrections, cross-browser testing (Chrome, Firefox, Safari)' },
  { date: '05/11/2026', members: 'AA, NS, SP, GM, AK, VM', hours: '4.0', task: 'Competition prep session — final review of all pages, checked copyright compliance, verified all team initials in work log; rehearsed demo flow' },
  { date: '05/12/2026', members: 'AA, NS, SP, GM, AK, VM', hours: '2.0', task: 'Final submission — deployed to production, confirmed all features functional, submitted project files for TSA National Conference 2026' },
]

const checklistItems = [
  'All text content was written originally by team members',
  'Google Fonts (Space Grotesk, DM Sans, Outfit, Syne) - free for educational use under Open Font License',
  'Lucide Icons - MIT License, free for all uses',
  'Framer Motion - MIT License, free for all uses',
  'Next.js / React / TypeScript / Tailwind CSS - MIT License, free for all uses',
  'Hero background images sourced from Unsplash (free license) and team-provided photos',
  'All community organization names and contact data reference real Bothell-area nonprofits (publicly available)',
  'No copyrighted logos, trademarks, or branded content are reproduced',
  'No images from third-party sources are used without license verification',
  'All event data is fictional, created for competition demonstration purposes only',
]

const sources = [
  { resource: 'Next.js 16', type: 'Framework', license: 'MIT', url: 'nextjs.org' },
  { resource: 'React 18', type: 'UI Library', license: 'MIT', url: 'react.dev' },
  { resource: 'TypeScript', type: 'Language', license: 'Apache 2.0', url: 'typescriptlang.org' },
  { resource: 'Tailwind CSS v3', type: 'Styling', license: 'MIT', url: 'tailwindcss.com' },
  { resource: 'Framer Motion', type: 'Animation', license: 'MIT', url: 'framer.com/motion' },
  { resource: 'Lucide Icons', type: 'Icons', license: 'MIT', url: 'lucide.dev' },
  { resource: 'Space Grotesk (Google Fonts)', type: 'Typography', license: 'Open Font License', url: 'fonts.google.com' },
  { resource: 'DM Sans (Google Fonts)', type: 'Typography', license: 'Open Font License', url: 'fonts.google.com' },
  { resource: 'Outfit (Google Fonts)', type: 'Typography', license: 'Open Font License', url: 'fonts.google.com' },
  { resource: 'Syne (Google Fonts)', type: 'Typography', license: 'Open Font License', url: 'fonts.google.com' },
  { resource: 'Resources page – parallax (library3.jpg)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/NIJuEQw0RKg' },
  { resource: 'Resources page – parallax (foodpantry5.jpg)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/Z8UgB80_46w' },
  { resource: 'Site hero – page background', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/Zyx1bK9mqmA' },
  { resource: 'Resources page – parallax (heartwithhands6.jpg)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/cAtzHUz7Z8e' },
  { resource: 'Resources page – parallax (community7.jpg)', type: 'Photography', license: 'Pexels License (free)', url: 'beginatbothell.com/wp-content/uploads/2023/09/pexels-kelly-2876511.jpg' },
  { resource: 'Site hero – page background', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/S5pFhDxUXyw' },
  { resource: 'Resources page – parallax (playground1.jpg)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/8NymO2MErVI' },
  { resource: 'Resources page – parallax (cleanup4.jpg)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/CIItgnBEOgw' },
  { resource: 'Resources page – parallax (cleanup4.jpg alt)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/3k3l2brxmwQ' },
  { resource: 'Resources page – parallax (library3.jpg alt)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/zeH-ljawHtg' },
  { resource: 'Resources page – parallax (garden2.jpg)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/bY_q4VodUc0' },
  { resource: 'Bothell, WA geographic and org data', type: 'Reference', license: 'Public domain', url: 'bothellwa.gov' },
  { resource: 'KCLS (King County Library System)', type: 'Reference', license: 'Public domain', url: 'kcls.org' },
  { resource: 'Northshore School District', type: 'Reference', license: 'Public domain', url: 'nsd.org' },
  { resource: 'EvergreenHealth Medical Center', type: 'Reference', license: 'Public domain', url: 'evergreenhealth.com' },
  { resource: 'Hopelink', type: 'Reference', license: 'Public domain', url: 'hope-link.org' },
  { resource: 'Northshore Volunteer Services', type: 'Reference', license: 'Public domain', url: 'nvskc.org' },
  { resource: 'YMCA Northshore', type: 'Reference', license: 'Public domain', url: 'seattleymca.org' },
  { resource: 'Crisis Connections Washington', type: 'Reference', license: 'Public domain', url: 'crisisconnections.org' },
  { resource: '211 King County', type: 'Reference', license: 'Public domain', url: '211kingcounty.org' },
  { resource: 'Sound Generations', type: 'Reference', license: 'Public domain', url: 'soundgenerations.org' },
  { resource: 'Imagine Housing', type: 'Reference', license: 'Public domain', url: 'imaginehousing.org' },
  { resource: 'Northshore Fire Department', type: 'Reference', license: 'Public domain', url: 'northshorefire.com' },
]

export default function DashboardReferencesPage() {
  const { settings } = useSettings()
  const { user, loading } = useAuth()
  const { markPageVisited } = useAchievements()
  const router = useRouter()
  const dk = settings.dark

  useEffect(() => {
    if (!loading && !user) router.push('/signin')
  }, [user, loading, router])

  useEffect(() => { markPageVisited('references') }, [markPageVisited])

  if (loading || !user) return null

  const H      = dk ? '#e0f2fe'                 : '#022747'
  const B      = dk ? 'rgba(198,235,255,0.85)'  : '#044069'
  const MUTED  = dk ? 'rgba(198,235,255,0.55)'  : '#085D8A'
  const LINK   = dk ? '#56BBF0'                 : '#2499D6'
  const BG     = dk ? '#010f1f'                 : '#F0F9FF'
  const CARD   = dk ? 'rgba(2,39,71,0.6)'       : '#F0F9FF'
  const INNER  = dk ? 'rgba(2,39,71,0.5)'       : '#ffffff'
  const ROW_ALT  = dk ? 'rgba(3,52,96,0.5)'     : '#EBF7FF'
  const BORDER   = dk ? 'rgba(86,187,240,0.15)' : '#BFDBFE'
  const TH_BG    = dk ? 'rgba(3,52,96,0.8)'     : '#DBEAFE'

  const h2Style = {
    fontFamily: 'var(--font-syne)',
    fontSize: 'clamp(20px, 2.5vw, 28px)',
    fontWeight: 700 as const,
    color: H,
    letterSpacing: '0.02em',
    lineHeight: 1.15,
    marginBottom: '16px',
  }

  const hdStyle  = { fontFamily: 'var(--font-syne)',  fontWeight: 700 as const, fontSize: '13px', color: H }
  const bodyStyle = { fontFamily: 'var(--font-space)', fontSize: '13px', color: B, lineHeight: 1.7 }

  return (
    <div style={{ backgroundColor: BG, minHeight: '100%', transition: 'background-color 0.3s' }}>
      {/* Page header */}
      <div className="px-6 pt-8 pb-6 border-b" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: dk ? 'rgba(86,187,240,0.12)' : '#DBEAFE' }}>
            <FileText className="w-5 h-5" style={{ color: LINK }} />
          </div>
          <div>
            <h1 className="font-syne text-2xl font-bold" style={{ color: H }}>References</h1>
            <p className="font-outfit text-sm" style={{ color: MUTED }}>Student copyright checklist, work log, and all sources cited.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-14">

        {/* PROJECT INFO */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={h2Style}>Project Information</h2>
          <div className="rounded-2xl overflow-hidden border p-6" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { label: 'Project Name', value: 'Community Connect' },
                { label: 'Competition', value: 'TSA Webmaster - National Conference 2026' },
                { label: 'Technology Stack', value: 'Next.js, React, TypeScript, Tailwind CSS, Framer Motion' },
                { label: 'Location', value: 'Bothell, Washington' },
                { label: 'Team', value: 'Team 1557-1' },
                { label: 'Team Size', value: '6 members' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: MUTED, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <p style={hdStyle}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* COPYRIGHT CHECKLIST */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={h2Style}>Student Copyright Checklist</h2>
          <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <div className="bg-sky-600 px-8 py-5">
              <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '18px', color: 'white' }}>
                TSA Webmaster - Student Copyright Verification
              </p>
              <p style={{ fontFamily: 'var(--font-space)', fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                Team 1557-1 - National Conference 2026
              </p>
            </div>
            <div className="px-8 py-6" style={{ backgroundColor: CARD }}>
              <p style={{ ...bodyStyle, marginBottom: '20px' }}>
                We certify that all materials used in Community Connect are either original works created by the team,
                properly licensed for educational/competition use, or in the public domain. Each item below has been verified:
              </p>
              <div className="space-y-3 mb-8">
                {checklistItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-sky-500 border-2 border-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={bodyStyle}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-6" style={{ borderColor: BORDER }}>
                <p style={{ ...bodyStyle, fontStyle: 'italic' }}>
                  Submitted electronically by all team members. Team 1557-1, National Conference 2026.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STUDENT COPYRIGHT CHECKLISTS PDF */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={h2Style}>Student Copyright Checklists</h2>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: BORDER }}>
            <iframe
              src="/TSA_Student_Copyright_Checklists.pdf"
              title="TSA Student Copyright Checklists"
              className="w-full"
              style={{ height: '860px', border: 'none' }}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <a
              href="/TSA_Student_Copyright_Checklists.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: LINK }}
            >
              Open PDF in new tab
            </a>
          </div>
        </motion.div>

        {/* WORK LOG */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={h2Style}>Work Log</h2>
          <p style={{ ...bodyStyle, marginBottom: '16px' }}>
            Total entries: {workLog.length} sessions — April 15 through May 12, 2026. Team initials: AA · NS · SP · GM · AK · VM
          </p>
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: BORDER }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b" style={{ backgroundColor: TH_BG, borderColor: BORDER }}>
                  <th className="text-left px-5 py-3.5 whitespace-nowrap" style={hdStyle}>Date</th>
                  <th className="text-left px-5 py-3.5 whitespace-nowrap" style={hdStyle}>Member(s)</th>
                  <th className="text-left px-5 py-3.5 whitespace-nowrap" style={hdStyle}>Hrs</th>
                  <th className="text-left px-5 py-3.5" style={hdStyle}>Task / Description</th>
                </tr>
              </thead>
              <tbody>
                {workLog.map((row, i) => (
                  <tr key={i} className="border-b last:border-0" style={{ backgroundColor: i % 2 === 0 ? INNER : ROW_ALT, borderColor: BORDER }}>
                    <td className="px-5 py-3 whitespace-nowrap" style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: MUTED }}>{row.date}</td>
                    <td className="px-5 py-3 whitespace-nowrap" style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: LINK }}>{row.members}</td>
                    <td className="px-5 py-3 whitespace-nowrap" style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: MUTED }}>{row.hours}</td>
                    <td className="px-5 py-3" style={{ fontFamily: 'var(--font-space)', fontSize: '13px', color: B, lineHeight: 1.6 }}>{row.task}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: TH_BG }}>
                  <td className="px-5 py-3" colSpan={2} style={hdStyle}>Total Hours</td>
                  <td className="px-5 py-3" style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '13px', color: LINK }}>
                    {workLog.reduce((s, r) => s + parseFloat(r.hours), 0).toFixed(1)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* SOURCES AND CITATIONS */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={h2Style}>Sources and Citations</h2>
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: BORDER }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b" style={{ backgroundColor: TH_BG, borderColor: BORDER }}>
                  <th className="text-left px-6 py-4" style={hdStyle}>Resource</th>
                  <th className="text-left px-6 py-4" style={hdStyle}>Type</th>
                  <th className="text-left px-6 py-4" style={hdStyle}>License</th>
                  <th className="text-left px-6 py-4" style={hdStyle}>URL</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((row, i) => (
                  <tr key={i} className="border-b last:border-0" style={{ backgroundColor: i % 2 === 0 ? INNER : ROW_ALT, borderColor: BORDER }}>
                    <td className="px-6 py-3" style={{ fontFamily: 'var(--font-space)', fontSize: '13px', color: B }}>{row.resource}</td>
                    <td className="px-6 py-3" style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: MUTED }}>{row.type}</td>
                    <td className="px-6 py-3" style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: MUTED }}>{row.license}</td>
                    <td className="px-6 py-3" style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: LINK }}>{row.url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FRAMEWORK STATEMENT */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={h2Style}>Framework Statement</h2>
          <div className="rounded-2xl overflow-hidden border p-6" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <p style={bodyStyle}>
              This website was built entirely from scratch using <strong style={{ color: H }}>Next.js 16</strong> with the App Router.
              No website templates or pre-built themes were used. All components, layouts, and UI elements were
              custom-coded by team members using React, TypeScript, and Tailwind CSS for styling, and Framer Motion
              for animations. The site is fully responsive and optimized for accessibility.
            </p>
          </div>
        </motion.div>

        {/* ACCESSIBILITY */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={h2Style}>Accessibility Statement</h2>
          <div className="rounded-2xl overflow-hidden border p-6" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <p style={{ ...bodyStyle, marginBottom: '16px' }}>
              Community Connect is committed to ensuring digital accessibility for all users. A full Accessibility Settings
              panel is available via the gear icon in the navigation bar.
            </p>
            <ul className="grid sm:grid-cols-2 gap-2">
              {[
                'WCAG 2.1 Level AA compliant design',
                'Keyboard navigable interface',
                'Screen reader compatible markup',
                'Responsive design for all screen sizes',
                'Dark mode',
                'Adjustable font sizes (Small to X-Large)',
                'Color blind mode and grayscale filter',
                'Reduced motion mode',
                'Page zoom up to 200%',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2" style={bodyStyle}>
                  <span style={{ color: LINK, fontWeight: 700 }}>+</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* PRIVACY */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={h2Style}>Privacy and Terms</h2>
          <div className="rounded-2xl overflow-hidden border p-6" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <p style={bodyStyle}>
              This website was created for educational purposes as part of the TSA Webmaster competition. All events,
              donation causes, and submitted resource data are fictional and created for demonstration purposes only.
              Organization names and contact information reference publicly available data for real Bothell-area nonprofits.
              No actual user data is collected, stored, or processed.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
