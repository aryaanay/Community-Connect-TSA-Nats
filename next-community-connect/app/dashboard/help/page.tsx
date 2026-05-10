'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Search, BookOpen, CalendarDays, Map, PlusCircle,
  Heart, Settings, UserCircle, HelpCircle, Bot, Shield, Wifi,
  Users2, Layers, PackageSearch, Sparkles, Loader2,
} from 'lucide-react'

const SECTIONS = [
  {
    id: 'getting-started',
    icon: BookOpen,
    color: '#56BBF0',
    title: 'Getting Started',
    items: [
      {
        q: 'How do I sign in or create an account?',
        a: 'Go to the Sign In page and enter your email and password. If you don\'t have an account, click "Sign Up". You\'ll need an email and a password with at least 8 characters, one uppercase letter, one number, and one special character. You can also use the TSA Judge credentials (email: judges@tsa.com, password: judges!) to explore the site without signing up.',
      },
      {
        q: 'What is CommunityConnect?',
        a: 'CommunityConnect is a hub for the Bothell, WA community. It lets you find local resources (food banks, health clinics, youth programs, etc.), browse upcoming events, explore a live community map, donate to local causes, submit new resources, create events, connect with other community members, form groups, and report lost & found items.',
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
        a: 'Click "Submit Resource" in the sidebar or go to the Submit page. Fill in the resource name, category, description, contact email, phone, and address. Our AI moderator reviews submissions instantly. If approved, the resource appears in the directory right away.',
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
        a: 'On the Events page, click any event card to expand a detail panel. It shows the full description, date, time, location, category, and target audience. You can also add the event to Google Calendar or get directions.',
      },
      {
        q: 'Can I filter events by type?',
        a: 'Yes, use the category filter chips at the top of the Events page to filter by type (Volunteer, Workshop, Health, etc.). You can also switch between bento grid view and calendar view using the toggle in the top-right.',
      },
      {
        q: 'How do I create my own event?',
        a: 'Click "Create Event" on the Events page or find it in the sidebar. Choose public (visible to all community members on the Events page and map) or private (invite specific people by email). Fill in the title, description, date, time, location, category, and emoji. Private events automatically draft an email invitation to your specified addresses.',
      },
      {
        q: 'Why don\'t I see past events?',
        a: 'The platform automatically filters out past events so you always see what\'s coming up. Both the Events page and Community Map only show upcoming events in real time.',
      },
    ],
  },
  {
    id: 'create-event',
    icon: PlusCircle,
    color: '#7C3AED',
    title: 'Creating Events',
    items: [
      {
        q: 'What\'s the difference between public and private events?',
        a: 'Public events are visible to all signed-in community members on the Events page, the bento grid, and the Community Map (shown as purple markers). Private events are not listed publicly. Instead, you provide a list of email addresses and the platform drafts an email invitation for you to send.',
      },
      {
        q: 'Can I pick a custom emoji for my event?',
        a: 'Yes! The Create Event form has an emoji picker with 15 options. Your chosen emoji appears on the event card and, for public events, on the map marker popup.',
      },
      {
        q: 'What categories can I use for my event?',
        a: 'You can choose from: Community, Volunteer, Education, Health, Donation, Social, Sports, Arts, and Other. The category determines how the event is tagged and filtered across the site.',
      },
      {
        q: 'Where does my public event appear?',
        a: 'Public events appear on the main Events page bento grid (merged with community events), in the calendar view, and on the Community Map as purple markers near the Bothell area. They\'re also included in event count stats.',
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
        q: 'I see purple markers. What are those?',
        a: 'Purple markers represent user-created public events. They\'re placed near the center of Bothell since exact geocoding isn\'t available for user events. Click them to see full details in the side panel.',
      },
      {
        q: 'The map isn\'t loading. What should I do?',
        a: 'The map uses Leaflet + OpenStreetMap and requires a network connection. If the map appears blank, try refreshing the page. Ad blockers occasionally block map tile requests. Try temporarily disabling them if the issue persists.',
      },
    ],
  },
  {
    id: 'social',
    icon: Users2,
    color: '#56BBF0',
    title: 'Social & Directory',
    items: [
      {
        q: 'How do I appear in the Community Directory?',
        a: 'Go to the Social page and click "Create Profile" in the "Your Community Profile" section. Enter your display name, an optional bio, and toggle your profile to "Visible in directory". Once saved, your profile appears to other signed-in community members.',
      },
      {
        q: 'How do I connect with someone?',
        a: 'On the Social page under the Community Directory tab, browse or search for profiles by name or email. Click "Connect" on any profile card. They\'ll appear under "My Connections" for quick access later.',
      },
      {
        q: 'How do I contact a community member?',
        a: 'Each profile card has a mail icon that opens a pre-addressed email (mailto: link) in your default email client. Your connections tab shows the same email button for all your connected members.',
      },
      {
        q: 'Where are my connections stored?',
        a: 'Connections are stored in your browser\'s localStorage. They\'re private to your device. If you clear your browser data or switch devices, your connection list will be reset. This is a demo platform; cloud-synced connections aren\'t implemented.',
      },
    ],
  },
  {
    id: 'groups',
    icon: Layers,
    color: '#EC4899',
    title: 'Community Groups',
    items: [
      {
        q: 'How do I create a community group?',
        a: 'Go to the Groups page and click "Create Group". Enter a group name, optional description, and the email addresses of members you\'d like to invite (comma or newline separated). You become the group admin (creator).',
      },
      {
        q: 'What can group admins do?',
        a: 'As the group creator (admin), you can add or remove members, delete the group, and email all members at once. Regular members can view the group and leave it, but cannot modify membership or delete the group.',
      },
      {
        q: 'How does "Email All Members" work?',
        a: '"Email All Members" opens a draft in your default email client with all member emails pre-filled in the BCC field. This lets you send one message to the entire group without revealing individual addresses to each other.',
      },
      {
        q: 'Where is group data stored?',
        a: 'Groups are stored in the Supabase database (community_groups and group_members tables). They persist across sessions and are visible to all members who are signed in. See supabase/community_features.sql for the required migration.',
      },
    ],
  },
  {
    id: 'lost-found',
    icon: PackageSearch,
    color: '#F59E0B',
    title: 'Lost & Found',
    items: [
      {
        q: 'How do I post a lost or found item?',
        a: 'Go to the Lost & Found page and click "Report Item". Toggle between "Lost" and "Found", then fill in the item title, description, location, date, and your contact info (email and/or phone). Click Post to publish it to the community board.',
      },
      {
        q: 'How do I contact someone about an item?',
        a: 'Click on any item card to expand it and see full contact details. You\'ll see email and phone buttons that open your mail client or phone dialer respectively. All contact is handled directly between community members.',
      },
      {
        q: 'How do I mark an item as resolved?',
        a: 'Only the person who posted the item can resolve it. If you\'re the owner, expand your item card and click "Mark Resolved". Resolved items are hidden from the active listing but remain in the database.',
      },
      {
        q: 'Can I filter to see only lost or only found items?',
        a: 'Yes, use the filter pills at the top of the Lost & Found page to view All, Lost only, or Found only. There\'s also a search bar to find items by title or description.',
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
        a: 'We display this notice clearly to make it obvious that no real transaction is occurring. This is a TSA competition demo. The donation UI is functional but does not connect to a real payment processor.',
      },
      {
        q: 'What causes can I support?',
        a: 'There are 6 community causes: Bothell Food Bank, Youth Mentorship, Senior Companions, Parks & Rec Fund, Homeless Outreach, and Animal Rescue Network. Each has a real-time fundraising progress bar that updates as simulated donations are recorded.',
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
        a: 'The resource moderator uses Groq\'s llama-3.1-8b-instant model, a fast and capable language model that evaluates submissions against a community standards prompt. If the API is unavailable, a rule-based fallback (checking name/description length and email validity) is used automatically.',
      },
      {
        q: 'Can I appeal an AI rejection?',
        a: 'Not in the current version, but you can improve your submission and resubmit. The AI is not perfect, and occasionally valid resources may be flagged. If you believe the rejection was incorrect, try rewriting the description with more specific community-relevant details.',
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
        a: 'Achievements unlock automatically as you use the site. Sign in for the first time, complete the tutorial, visit each page, submit a resource, make a donation, create an event, connect with someone, create a group, enable dark mode, change the language, or enable accessibility features. Each achievement awards XP that contributes to your level.',
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
        q: 'Why does the achievement card spin?',
        a: 'Achievement cards auto-rotate around their vertical axis to show off the holographic sheen. Hover over the card to take control of the rotation with your mouse. Click to flip the card and see the back side with your XP total.',
      },
      {
        q: 'Where do I see my achievements?',
        a: 'Go to your Profile page (My Profile in the sidebar) to see your full achievement collection, XP total, level, and progress bar. Locked achievements are shown greyed out so you know what to aim for.',
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
        a: 'Go to Settings (the gear icon in the sidebar) and toggle "Dark Mode" in the Appearance section. Your preference is saved automatically in your browser.',
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
        a: 'Yes, all settings are stored in your browser\'s localStorage and persist between sessions. Resetting to defaults clears this storage.',
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
        q: 'The page isn\'t loading properly. What should I do?',
        a: 'Try a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). If issues persist, clear your browser cache or try a different browser. CommunityConnect works best in modern browsers (Chrome, Firefox, Edge, Safari).',
      },
      {
        q: 'I\'m getting a sign-in error. What\'s wrong?',
        a: 'Double-check your email and password. Passwords are case-sensitive. If you just signed up, Supabase may require email confirmation depending on project settings. Try the judge credentials (judges@tsa.com / judges!) to verify the platform is working.',
      },
      {
        q: 'The achievements I earned are gone. What happened?',
        a: 'Achievements are stored in your browser\'s localStorage. If you cleared your browser data, switched browsers, or used private/incognito mode, they may be reset. This is a demo platform. Persistent cloud storage for achievements is not implemented.',
      },
      {
        q: 'Why aren\'t my Supabase features (Groups, Social, Lost & Found) working?',
        a: 'These features require the database tables to be created. Run the SQL migration at supabase/community_features.sql in your Supabase project SQL editor. If the tables don\'t exist, pages will gracefully show empty states without crashing.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b last:border-0 transition-colors" style={{ borderColor: 'rgba(86,187,240,0.1)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 py-4 text-left group">
        <span className="font-outfit text-sm font-semibold text-white group-hover:text-sky-200 transition-colors leading-snug">{q}</span>
        <ChevronDown size={15} className="flex-shrink-0 transition-transform duration-200"
          style={{ color: 'rgba(198,235,255,0.4)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <p className="font-outfit text-sm leading-relaxed pb-4" style={{ color: 'rgba(198,235,255,0.6)' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpPage() {
  const [search, setSearch]         = useState('')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [aiAnswer, setAiAnswer]     = useState<string | null>(null)
  const [aiLoading, setAiLoading]   = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const query = search.toLowerCase().trim()
  const filtered = SECTIONS.map(s => ({
    ...s,
    items: s.items.filter(i => !query || i.q.toLowerCase().includes(query) || i.a.toLowerCase().includes(query)),
  })).filter(s => s.items.length > 0)

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setAiAnswer(null)
    clearTimeout(debounceRef.current)
    if (val.trim().length < 6) return
    debounceRef.current = setTimeout(async () => {
      setAiLoading(true)
      try {
        const res = await fetch('/api/help-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: val.trim() }),
        })
        const data = await res.json()
        if (data.answer) setAiAnswer(data.answer)
      } catch { /* ignore */ } finally {
        setAiLoading(false)
      }
    }, 700)
  }

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-8 py-8"
      style={{ background: 'linear-gradient(150deg, #011629 0%, #022747 60%, #011629 100%)' }}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), rgba(2,39,71,0.6)', border: '1px solid rgba(86,187,240,0.18)', backdropFilter: 'blur(20px)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(86,187,240,0.12) 0%, transparent 60%)' }} />
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
              <input type="text" value={search} onChange={e => handleSearchChange(e.target.value)}
                placeholder="Ask anything about CommunityConnect…"
                className="w-full pl-10 pr-4 py-3 rounded-xl font-outfit text-sm outline-none focus:ring-1 focus:ring-sky-400/35 text-white placeholder:text-sky-300/30"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.18)' }} />
              {aiLoading && <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" style={{ color: 'rgba(198,235,255,0.4)' }} />}
            </div>

            {/* AI Answer */}
            <AnimatePresence>
              {(aiAnswer || aiLoading) && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  className="mt-3 rounded-xl p-4 flex gap-3"
                  style={{ background: 'rgba(86,187,240,0.08)', border: '1px solid rgba(86,187,240,0.2)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(86,187,240,0.15)', border: '1px solid rgba(86,187,240,0.25)' }}>
                    <Sparkles size={13} style={{ color: '#56BBF0' }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-outfit text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#56BBF0' }}>AI Answer</p>
                    {aiLoading
                      ? <p className="font-outfit text-sm" style={{ color: 'rgba(198,235,255,0.4)' }}>Thinking…</p>
                      : <p className="font-outfit text-sm leading-relaxed" style={{ color: 'rgba(198,235,255,0.75)' }}>{aiAnswer}</p>
                    }
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Section nav pills */}
        {!search && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2">
            {SECTIONS.map(s => {
              const Icon = s.icon
              const active = activeSection === s.id
              return (
                <button key={s.id}
                  onClick={() => {
                    setActiveSection(active ? null : s.id)
                    if (!active) setTimeout(() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-outfit text-xs font-semibold transition-all"
                  style={{ background: active ? `${s.color}22` : 'rgba(255,255,255,0.05)', border: `1px solid ${active ? s.color + '55' : 'rgba(86,187,240,0.1)'}`, color: active ? s.color : 'rgba(198,235,255,0.55)' }}>
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
              <motion.div id={section.id} key={section.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + si * 0.04 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), rgba(2,39,71,0.5)', border: '1px solid rgba(86,187,240,0.12)' }}>
                <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(86,187,240,0.08)' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${section.color}18`, border: `1px solid ${section.color}30` }}>
                    <Icon size={15} style={{ color: section.color }} />
                  </div>
                  <h2 className="font-syne text-sm font-bold text-white">{section.title}</h2>
                  <span className="ml-auto font-outfit text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: `${section.color}15`, color: section.color, border: `1px solid ${section.color}25` }}>
                    {section.items.length} article{section.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="px-5">
                  {section.items.map((item, ii) => <FAQItem key={ii} q={item.q} a={item.a} />)}
                </div>
              </motion.div>
            )
          })
        )}

        <p className="font-outfit text-xs text-center pb-2" style={{ color: 'rgba(198,235,255,0.2)' }}>
          Community Connect · Built for TSA Nationals 2026
        </p>
      </div>
    </div>
  )
}
