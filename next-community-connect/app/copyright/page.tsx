'use client'

import { motion } from 'framer-motion'
import { HeroDemo } from '@/components/ui/animated-hero-demo'

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
  { resource: 'Resources page – parallax (heartwithhands6.jpg)', type: 'Photography', license: 'Unsplash License (free)', url: 'unsplash.com/photos/cAtzHUz7Z8g' },
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

const H = '#022747'
const B = '#044069'
const MUTED = '#085D8A'
const LINK = '#2499D6'
const BG = '#F0F9FF'
const CARD = '#F0F9FF'
const INNER = '#ffffff'
const ROW_ALT = '#EBF7FF'
const BORDER = '#BFDBFE'

const h2Style = {
  fontFamily: 'var(--font-syne)',
  fontSize: 'clamp(22px, 3vw, 32px)',
  fontWeight: 700 as const,
  color: H,
  letterSpacing: '0.02em',
  lineHeight: 1.15,
  marginBottom: '16px',
}

const hdStyle = { fontFamily: 'var(--font-syne)', fontWeight: 700 as const, fontSize: '13px', color: H }
const bodyStyle = { fontFamily: 'var(--font-space)', fontSize: '13px', color: B, lineHeight: 1.7 }

export default function DocumentationPage() {
  return (
    <>
      <HeroDemo
        badge="TSA Webmaster - Required Documentation"
        staticTitle="Copyright &amp; References"
        subtitle="Student copyright checklist, work log, and all sources cited for Community Connect.
        * Note: This page does not have dark mode functionality so as to maintain clarity"
        backgroundImage=""
      />

      <section className="py-24" style={{ backgroundColor: BG }}>
        <div className="max-w-4xl mx-auto px-4 space-y-14">

          {/* PROJECT INFO */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={h2Style}>Project Information</h2>
            <div className="rounded-2xl overflow-hidden border p-6" style={{ backgroundColor: CARD, borderColor: BORDER }}>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { label: 'Project Name', value: 'Community Connect' },
                  { label: 'Competition', value: 'TSA Webmaster - State Conference 2026' },
                  { label: 'Technology Stack', value: 'Next.js, React, TypeScript, Tailwind CSS, Framer Motion' },
                  { label: 'Location', value: 'Bothell, Washington' },
                  { label: 'Chapter', value: 'North Creek High School - Chapter 1557-2' },
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
                  Chapter 1557-2 - North Creek High School - State Conference 2026
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
                    Submitted electronically by all team members. North Creek High School Chapter 1557-2, State Conference 2026.
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

          {/* WORK LOG PDF */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={h2Style}>Work Log</h2>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: BORDER }}>
              <iframe
                src="/TSA_Work_Log.pdf"
                title="TSA Work Log"
                className="w-full"
                style={{ height: '860px', border: 'none' }}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <a
                href="/TSA_Work_Log.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-space)', fontSize: '12px', color: LINK }}
              >
                Open PDF in new tab
              </a>
            </div>
          </motion.div>

          {/* SOURCES AND CITATIONS */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={h2Style}>Sources and Citations</h2>
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: BORDER }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: '#DBEAFE', borderColor: BORDER }}>
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
      </section>
    </>
  )
}
