'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, BookOpen, CalendarDays, Map, PlusCircle, Heart, Settings, UserCircle, HelpCircle, Bot, Shield, Wifi, Moon, Languages } from 'lucide-react'

const SECTIONS = [
  {
    id: 'getting-started',
    icon: BookOpen,
    color: '#56BBF0',
    title: 'Getting Started',
    items: [
      {
        q: 'How do I sign in or create an account?',
        a: 'Go to the Sign In page and enter your email and password. If you don\'t have an account, click "Sign Up" — you\'ll need an email and a password with at least 8 characters, one uppercase letter, one number, and one special character. You can also use the TSA Judge credentials (email: judges@tsa.com, password: judges!) to explore the site without signing up.',
      },
      {
        q: 'What is CommunityConnect?',
        a: 'CommunityConnect is a hub for the Bothell, WA community. It lets you find local resources (food banks, health clinics, youth programs, etc.), browse upcoming events, explore a live community map, donate to local causes, and submit new resources for the directory.',
      },
      {
        q: 'Is my data safe?',
        a: 'Yes. All authentication is handled by Supabase with industry-standard encryption. We never store passwords in plain text, and your email is only used for identification within the platform.',
      },
      {
        q: 'How do I take the site tutorial?',
        a: 'A tutorial pops up automatically on your first visit. You can replay it anytime by clicking the "Site Tutorial" button at the bottom of the sidebar (the ? icon above Sign Out). It walks you through every major feature in 7 steps.',
      },
    ],
  },
  {
    id: 'resources',
    icon: BookOpen,
    color: '#10B981',
    title: 'Community Resources',
    items: [
      {
        q: 'How do I find a specific resource?',
        a: 'On the Resources page, use the search bar at the top to search by name, category, or keyword. You can also filter by category using the pill buttons. Click any resource card to expand it and see full contact details, address, hours, and a description.',
      },
      {
        q: 'How do I submit a new resource?',
        a: 'Click "Submit Resource" in the sidebar or go to the Submit page. Fill in the resource name, category, description, contact email, phone, and address. Our AI moderator reviews submissions instantly — if approved, the resource appears in the directory right away.',
      },
      {
        q: 'Why was my submission rejected by the AI?',
        a: 'The AI moderator checks submissions for content quality, community relevance, and category accuracy. Rejections usually happen if the description is too vague, the name is too short, the email is invalid, or the resource doesn\'t seem relevant to the Bothell community. Try adding more detail and resubmitting.',
      },
      {
        q: 'How often is the directory updated?',
        a: 'The directory updates in real-time. Approved submissions appear immediately, and the page uses a live Supabase subscription to reflect changes without needing a manual refresh.',
      },
    ],
  },
  {
    id: 'events',
    icon: CalendarDays,
    color: '#8B5CF6',
    title: 'Events Calendar',
    items: [
      {
        q: 'How do I see event details?',
        a: 'On the Events page, click any event card to expand a detail panel on the right side. It shows the full description, date, time, location, category, and target audience.',
      },
      {
        q: 'Can I filter events by type?',
        a: 'Yes — use the category filter chips at the top of the Events page to filter by type (Volunteer, Workshop, Health, etc.). You can also switch between list view and calendar view using the toggle in the top-right.',
      },
      {
        q: 'Are the events real?',
        a: 'The events shown are curated examples representing real types of community activities in the Bothell area. This is a demonstration platform for TSA, so exact dates and availability may vary.',
      },
    ],
  },
  {
    id: 'map',
    icon: Map,
    color: '#F59E0B',
    title: 'Community Map',
    items: [
      {
        q: 'Why does the map ask for my location?',
        a: 'The map does not request your location. It loads centered on Bothell, WA by default. All pins represent community events and resources in that area.',
      },
      {
        q: 'How do I use the map filters?',
        a: 'Use the category filter strip above the map to show only certain types of events. Click any pin on the map to see the event name, date, and time in a popup. Click "Show list" to see a sidebar list of all visible events.',
      },
      {
        q: 'The map isn\'t loading — what should I do?',
        a: 'The map uses Leaflet + OpenStreetMap and requires a network connection. If the map appears blank, try refreshing the page. Ad blockers occasionally block map tile requests — try temporarily disabling them if the issue persists.',
      },
    ],
  },
  {
    id: 'donations',
    icon: Heart,
    color: '#EC4899',
    title: 'Donations',
    items: [
      {
        q: 'Are the donations real?',
        a: 'No. All donations on CommunityConnect are simulated for demonstration purposes. No real payment is processed, no real money changes hands, and no payment method is required. The platform shows what a real donation flow would look like.',
      },
      {
        q: 'Why do I see a "Simulated Payment" notice?',
        a: 'We display this notice clearly to make it obvious that no real transaction is occurring. This is a TSA competition demo — the donation UI is functional but does not connect to a real payment processor.',
      },
      {
        q: 'What causes can I support?',
        a: 'There are 6 community causes: Bothell Food Bank, Youth Mentorship, Senior Companions, Parks & Rec Fund, Homeless Outreach, and Animal Rescue Network. Each has a real-time fundraising progress bar that updates as simulated donations are recorded.',
      },
      {
        q: 'Can I donate more than once to the same cause?',
        a: 'Yes — you can donate multiple times to any cause. Each donation is recorded and reflected in the live progress totals.',
      },
    ],
  },
  {
    id: 'ai-review',
    icon: Bot,
    color: '#56BBF0',
    title: 'AI Moderator',
    items: [
      {
        q: 'How does the AI review process work?',
        a: 'When you submit a resource, it goes through a multi-step AI review: the system checks content quality, community relevance, category accuracy, and submission guidelines. You\'ll see a live progress bar with each check as it happens. The AI then delivers an approved or rejected verdict within seconds.',
      },
      {
        q: 'What AI model is used?',
        a: 'The resource moderator uses Groq\'s llama-3.1-8b-instant model — a fast, capable language model that evaluates submissions against a community standards prompt. If the API is unavailable, a rule-based fallback (checking name/description length and email validity) is used automatically.',
      },
      {
        q: 'Can I appeal an AI rejection?',
        a: 'Not in the current version — but you can improve your submission and resubmit. The AI is not perfect, and occasionally valid resources may be flagged. If you believe the rejection was incorrect, try rewriting the description with more specific community-relevant details.',
      },
    ],
  },
  {
    id: 'achievements',
    icon: UserCircle,
    color: '#F59E0B',
    title: 'Achievements & Profile',
    items: [
      {
        q: 'How do I earn achievements?',
        a: 'Achievements unlock automatically as you use the site. Sign in for the first time, complete the tutorial, visit each page, submit a resource, make a donation, enable dark mode, change the language, or enable accessibility features. Each achievement awards XP that contributes to your level.',
      },
      {
        q: 'What are the different rarity levels?',
        a: 'Achievements come in four rarities: Common (easy to get, blue), Uncommon (require more action, green), Rare (significant accomplishments, purple), and Legendary (one-of-a-kind feats, gold). Rarer achievements award more XP.',
      },
      {
        q: 'What do the levels mean?',
        a: 'Your level is based on total XP earned: Level 1 (0–99 XP) "Community Newcomer", Level 2 (100–299 XP) "Active Member", Level 3 (300–599 XP) "Resource Champion", Level 4 (600–999 XP) "Community Hero", and Level 5 (1000+ XP) "Local Legend".',
      },
      {
        q: 'Where do I see my achievements?',
        a: 'Go to your Profile page (My Profile in the sidebar) to see your full achievement collection, XP total, level, and progress bar. Locked achievements are shown greyed out so you know what to aim for.',
      },
      {
        q: 'Why did my achievement popup disappear?',
        a: 'Achievement popups auto-dismiss after 9 seconds. You can also click anywhere to dismiss them manually. Your achievements are permanently saved in your browser\'s localStorage — check your Profile page to see everything you\'ve earned.',
      },
    ],
  },
  {
    id: 'accessibility',
    icon: Settings,
    color: '#6366F1',
    title: 'Accessibility & Settings',
    items: [
      {
        q: 'How do I enable dark mode?',
        a: 'Go to Settings (the gear icon in the sidebar) and toggle "Dark Mode" in the Language & Appearance section. Your preference is saved automatically in your browser.',
      },
      {
        q: 'How do I change the language?',
        a: 'In Settings, the first section is Language. Click any of the 10 supported languages (English, Spanish, French, Chinese, Vietnamese, Tagalog, Korean, Arabic, Hindi, Portuguese) to switch instantly. All nav labels and settings text will update.',
      },
      {
        q: 'What accessibility features are available?',
        a: 'Settings includes: dyslexia-friendly font, increased line/word/letter spacing, reading ruler, text-to-speech, high contrast mode, color-blind friendly mode, large cursor, reduced transparency, reduced motion, enhanced focus indicators, focus spotlight, larger click targets, and one-tap condition presets for ADHD, Parkinson\'s, Epilepsy, Autism, Low Vision, and Motor Impairment.',
      },
      {
        q: 'Do settings persist after I close the browser?',
        a: 'Yes — all settings are stored in your browser\'s localStorage and persist between sessions. Resetting to defaults clears this storage.',
      },
    ],
  },
  {
    id: 'technical',
    icon: Wifi,
    color: '#10B981',
    title: 'Technical Issues',
    items: [
      {
        q: 'The page isn\'t loading properly — what should I do?',
        a: 'Try a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). If issues persist, clear your browser cache or try a different browser. CommunityConnect works best in modern browsers (Chrome, Firefox, Edge, Safari).',
      },
      {
        q: 'I\'m getting a sign-in error — what\'s wrong?',
        a: 'Double-check your email and password. Passwords are case-sensitive. If you just signed up, Supabase may require email confirmation depending on project settings — try the judge credentials (judges@tsa.com / judges!) to verify the platform is working.',
      },
      {
        q: 'The achievements I earned are gone — what happened?',
        a: 'Achievements are stored in your browser\'s localStorage. If you cleared your browser data, switched browsers, or used private/incognito mode, they may be reset. This is a demo platform — persistent cloud storage for achievements is not implemented.',
      },
      {
        q: 'The real-time donation counter isn\'t updating — is that normal?',
        a: 'Real-time updates rely on a Supabase WebSocket connection. If you\'re on a slow connection or behind a restrictive network, updates may be delayed. Try refreshing the page to see the latest totals.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-b last:border-0 transition-colors"
      style={{ borderColor: 'rgba(86,187,240,0.1)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
      >
        <span className="font-outfit text-sm font-semibold text-white group-hover:text-sky-200 transition-colors leading-snug">
          {q}
        </span>
        <ChevronDown
          size={15}
          className="flex-shrink-0 transition-transform duration-200"
          style={{
            color: 'rgba(198,235,255,0.4)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p
              className="font-outfit text-sm leading-relaxed pb-4"
              style={{ color: 'rgba(198,235,255,0.6)' }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const query = search.toLowerCase().trim()
  const filtered = SECTIONS.map(s => ({
    ...s,
    items: s.items.filter(
      i => !query || i.q.toLowerCase().includes(query) || i.a.toLowerCase().includes(query)
    ),
  })).filter(s => s.items.length > 0)

  return (
    <div
      className="min-h-full px-4 sm:px-6 lg:px-8 py-8"
      style={{ background: 'linear-gradient(150deg, #011629 0%, #022747 60%, #011629 100%)' }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(2,39,71,0.6)',
            border: '1px solid rgba(86,187,240,0.18)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 20% 50%, rgba(86,187,240,0.12) 0%, transparent 60%)',
          }} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(86,187,240,0.15)', border: '1px solid rgba(86,187,240,0.3)' }}>
                <HelpCircle size={20} style={{ color: '#56BBF0' }} />
              </div>
              <div>
                <h1 className="font-syne text-2xl font-black text-white">Help & Documentation</h1>
                <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.45)' }}>
                  Answers to common questions about CommunityConnect
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-5">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(198,235,255,0.35)' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search help articles…"
                className="w-full pl-10 pr-4 py-3 rounded-xl font-outfit text-sm outline-none focus:ring-1 focus:ring-sky-400/35 text-white placeholder:text-sky-300/30"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(86,187,240,0.18)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Section nav pills */}
        {!search && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            {SECTIONS.map(s => {
              const Icon = s.icon
              const active = activeSection === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(active ? null : s.id)
                    if (!active) {
                      setTimeout(() => {
                        document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 50)
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-outfit text-xs font-semibold transition-all"
                  style={{
                    background: active ? `${s.color}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${active ? s.color + '55' : 'rgba(86,187,240,0.1)'}`,
                    color: active ? s.color : 'rgba(198,235,255,0.55)',
                  }}
                >
                  <Icon size={11} />
                  {s.title}
                </button>
              )
            })}
          </motion.div>
        )}

        {/* Sections */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-syne text-lg font-bold text-white mb-2">No results found</p>
            <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.45)' }}>
              Try a different search term or browse the sections above.
            </p>
          </div>
        ) : (
          filtered.map((section, si) => {
            const Icon = section.icon
            return (
              <motion.div
                id={section.id}
                key={section.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + si * 0.05 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), rgba(2,39,71,0.5)',
                  border: '1px solid rgba(86,187,240,0.12)',
                }}
              >
                {/* Section header */}
                <div
                  className="flex items-center gap-3 px-5 py-4 border-b"
                  style={{ borderColor: 'rgba(86,187,240,0.08)' }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${section.color}18`, border: `1px solid ${section.color}30` }}
                  >
                    <Icon size={15} style={{ color: section.color }} />
                  </div>
                  <h2 className="font-syne text-sm font-bold text-white">{section.title}</h2>
                  <span
                    className="ml-auto font-outfit text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: `${section.color}15`, color: section.color, border: `1px solid ${section.color}25` }}
                  >
                    {section.items.length} article{section.items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* FAQ items */}
                <div className="px-5">
                  {section.items.map((item, ii) => (
                    <FAQItem key={ii} q={item.q} a={item.a} />
                  ))}
                </div>
              </motion.div>
            )
          })
        )}

        <p className="font-outfit text-xs text-center pb-2" style={{ color: 'rgba(198,235,255,0.2)' }}>
          Community Connect · Bothell, WA · Built for TSA 2025
        </p>
      </div>
    </div>
  )
}
