'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Resource {
  title: string
  category: string
  icon: string
  description: string
  phone: string
  email: string
  hours: string
  location: string
}

const resources: Resource[] = [
  { title: 'Scholarship Discovery Program', category: 'Education', icon: 'fa-graduation-cap', description: 'Find and apply for local and national scholarships. Free guidance on application essays, financial aid, and deadline tracking.', phone: '(555) 234-5678', email: 'scholarships@communityconnect.org', hours: 'Mon–Fri 9AM–6PM, Sat 10AM–2PM', location: 'Bothell Community Center, 9919 NE 180th St' },
  { title: 'After-School Tutoring Network', category: 'Education', icon: 'fa-book-reader', description: 'Free K–12 tutoring in math, science, reading, and writing. Volunteer tutors available weekdays 3–6PM.', phone: '(555) 234-5679', email: 'tutoring@communityconnect.org', hours: 'Mon–Fri 3PM–6PM', location: 'Various Bothell sites' },
  { title: 'Youth Career Internship Portal', category: 'Career', icon: 'fa-briefcase', description: 'Connect high school and college students with paid internships at local businesses. Earn real-world experience.', phone: '(555) 345-6789', email: 'internships@communityconnect.org', hours: 'Mon–Fri 9AM–5PM', location: 'Bothell Workforce Dev. Center' },
  { title: 'Job Search Workshop Series', category: 'Career', icon: 'fa-search-dollar', description: 'Monthly workshops covering resume building, interview techniques, LinkedIn, and networking.', phone: '(555) 345-6790', email: 'workshops@communityconnect.org', hours: '2nd & 4th Tuesday 6PM–8PM', location: 'Bothell Regional Library' },
  { title: 'Community Health Clinic', category: 'Health', icon: 'fa-medkit', description: 'Affordable medical and dental services with sliding-scale fees. Walk-in hours Monday–Friday.', phone: '(555) 456-7890', email: 'clinic@healthcenter.org', hours: 'Mon–Fri 9AM–5PM', location: 'EvergreenHealth Bothell' },
  { title: 'Mental Wellness Support Line', category: 'Health', icon: 'fa-phone-volume', description: '24/7 confidential crisis support and counseling. Connect with trained professionals.', phone: '(555) 911-HELP', email: 'support@mentalhealthline.org', hours: '24/7 — Call anytime', location: 'Confidential — phone & online' },
  { title: 'Neighborhood Cleanup Initiative', category: 'Volunteering', icon: 'fa-hands-helping', description: 'Join monthly community cleanups in local parks. Tools and supplies provided.', phone: '(555) 567-8901', email: 'cleanup@communityconnect.org', hours: '1st Saturday monthly 9AM–12PM', location: 'Bothell Landing Park' },
  { title: 'Senior Companion Program', category: 'Volunteering', icon: 'fa-user-friends', description: 'Match with local seniors for weekly visits, companionship, and light assistance.', phone: '(555) 567-8902', email: 'companions@seniorcare.org', hours: 'Flexible', location: 'Senior Center, 234 Elder St' },
  { title: 'Community Garden Collective', category: 'Community', icon: 'fa-seedling', description: 'Rent a plot and grow your own vegetables. Workshops on sustainable gardening.', phone: '(555) 678-9012', email: 'garden@greengrow.org', hours: 'Open daily dawn to dusk', location: 'Community Garden, Corner of 5th & Maple' },
  { title: 'Little Free Library Network', category: 'Community', icon: 'fa-book', description: 'Build and maintain Little Free Libraries in neighborhoods. Free books for all ages.', phone: '(555) 678-9013', email: 'books@littlefreelibrary.org', hours: 'Workshop 2nd Sat 10AM–2PM', location: 'Bothell Makerspace' },
  { title: 'Monthly Town Hall Meetings', category: 'Events', icon: 'fa-comments', description: 'Monthly forums to discuss community issues, meet local leaders, and voice concerns.', phone: '(555) 789-0123', email: 'townhall@citygovernment.gov', hours: '1st Thursday monthly 7PM–9PM', location: 'City Hall Council Chambers' },
  { title: 'Community Resource Fair', category: 'Events', icon: 'fa-calendar-alt', description: 'Annual event connecting residents with local services, nonprofits, and health providers.', phone: '(555) 789-0124', email: 'fair@communityconnect.org', hours: 'Annual — 3rd Sat in Sept', location: 'Central Park Main Field' },
  { title: 'Financial Literacy Workshops', category: 'Career', icon: 'fa-dollar-sign', description: 'Learn budgeting, saving, investing, and credit management. Free evening workshops.', phone: '(555) 890-1234', email: 'finance@moneywise.org', hours: 'Wednesdays 6PM–8PM', location: 'Credit Union Community Room' },
  { title: 'Youth Mentorship Network', category: 'Education', icon: 'fa-child', description: 'Pair young people ages 12–18 with vetted adult mentors for guidance and support.', phone: '(555) 901-2345', email: 'mentors@youthprogram.org', hours: 'Match meetings flexible', location: 'Youth Services Office' },
  { title: 'Fitness in the Park', category: 'Health', icon: 'fa-heartbeat', description: 'Free outdoor fitness classes every weekend! Yoga, Zumba, bootcamp, and tai chi.', phone: '(555) 012-3456', email: 'fitness@parksprogram.org', hours: 'Sat–Sun 8AM, 10AM, 4PM', location: 'Riverside Park Pavilion' },
]

const categories = [
  { id: 'all', label: 'All Resources', icon: 'fa-th-large' },
  { id: 'Education', label: 'Education', icon: 'fa-graduation-cap' },
  { id: 'Career', label: 'Career', icon: 'fa-briefcase' },
  { id: 'Health', label: 'Health', icon: 'fa-heartbeat' },
  { id: 'Volunteering', label: 'Volunteering', icon: 'fa-hands-helping' },
  { id: 'Community', label: 'Community', icon: 'fa-seedling' },
  { id: 'Events', label: 'Events', icon: 'fa-calendar-alt' },
]

const categoryGradients: Record<string, string> = {
  Education: 'from-blue-700 to-blue-500',
  Career: 'from-purple-700 to-purple-500',
  Health: 'from-green-700 to-green-500',
  Volunteering: 'from-green-600 to-green-400',
  Community: 'from-orange-700 to-orange-500',
  Events: 'from-cyan-700 to-cyan-500',
}

export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('default')
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const filteredResources = useMemo(() => {
    let result = resources

    if (category !== 'all') {
      result = result.filter(r => r.category === category)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      )
    }

    if (sort === 'az') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sort === 'za') {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title))
    } else if (sort === 'category') {
      result = [...result].sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
    }

    return result
  }, [search, category, sort])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-deep via-green-mid to-green-light">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(145,176,138,0.3)_0%,transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(45,74,40,0.6)_0%,transparent_50%)]" />
        </div>

        {/* Animated nodes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[5%] w-[320px] h-[320px] rounded-full bg-white/6 animate-orb-float" style={{ animationDuration: '14s' }} />
          <div className="absolute bottom-[-40px] left-[5%] w-[180px] h-[180px] rounded-full bg-white/6 animate-orb-float" style={{ animationDuration: '10s', animationDelay: '-4s' }} />
          <div className="absolute top-[40%] left-[22%] w-[100px] h-[100px] rounded-full bg-green-pale/10 animate-orb-float" style={{ animationDuration: '8s', animationDelay: '-2s' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-pale animate-pulse-slow" />
            <span className="text-xs font-bold text-white/90 tracking-widest uppercase">500+ Resources Listed</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-space text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4"
            style={{ letterSpacing: '-2px' }}
          >
            Community Resource Hub
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-outfit text-base sm:text-lg text-white/75 max-w-md mx-auto mb-10"
          >
            Find non-profits, support services, health programs, and opportunities — all verified, all free to access.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-lg mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, or keyword…"
                className="w-full px-6 py-4 pl-12 text-base font-outfit rounded-full bg-white/95 text-[var(--text-dark)] shadow-lg outline-none focus:ring-4 focus:ring-accent-gold/20"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-green-mid">🔍</span>
            </div>
          </motion.div>

          {/* Stats pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <span className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm font-semibold text-white/85">
              📋 {resources.length} Resources Listed
            </span>
            <span className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm font-semibold text-white/85">
              🏷️ {categories.length - 1} Categories
            </span>
            <span className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm font-semibold text-white/85">
              ✅ All Verified
            </span>
          </motion.div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="py-24 bg-white" id="directory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-green-wash rounded-[var(--radius-lg)] p-6 mb-10 shadow-card"
          >
            <div className="flex flex-col lg:flex-row gap-4 mb-5">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, description, or category…"
                  className="w-full px-5 py-3 pl-11 text-sm font-outfit rounded-full bg-green-mist border-2 border-green-wash outline-none focus:border-green-light"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-light">🔍</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Sort:</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2 text-sm font-outfit rounded-full border-2 border-green-wash bg-white outline-none cursor-pointer focus:border-green-light"
                >
                  <option value="default">Default</option>
                  <option value="az">A → Z</option>
                  <option value="za">Z → A</option>
                  <option value="category">By Category</option>
                </select>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    category === cat.id
                      ? 'bg-gradient-to-r from-accent-gold to-accent-gold-light text-[#1a2718]'
                      : 'border-2 border-green-wash bg-white text-[var(--text-muted)] hover:border-green-light'
                  }`}
                >
                  <span>📋</span> {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <div className="mb-6 text-sm text-[var(--text-muted)]">
            Showing <strong className="text-green-mid">{filteredResources.length}</strong> of {resources.length} resources
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[var(--radius-md)] border border-green-wash overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                {/* Card header */}
                <div className={`h-36 flex items-center justify-center bg-gradient-to-br ${categoryGradients[resource.category] || 'from-green-700 to-green-500'} relative overflow-hidden`}>
                  <span className="text-5xl text-white/25">📋</span>
                  <span className="absolute bottom-3 left-3 bg-white/90 text-[var(--text-dark)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {resource.category}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-space font-bold text-base text-[var(--text-dark)] mb-2">{resource.title}</h3>
                  <p className="font-outfit text-xs text-[var(--text-muted)] leading-relaxed mb-4">{resource.description}</p>

                  {/* Expandable details */}
                  <div className={`overflow-hidden transition-all duration-300 ${expandedCard === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-green-mist border border-green-wash rounded-[var(--radius-md)] p-3.5 mb-3">
                      <div className="flex items-start gap-2 text-xs text-[var(--text-body)] mb-1.5">
                        <span className="text-green-light">📍</span>
                        <span><strong className="text-green-mid">Location:</strong> {resource.location}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-[var(--text-body)] mb-1.5">
                        <span className="text-green-light">📞</span>
                        <span><strong className="text-green-mid">Phone:</strong> {resource.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-[var(--text-body)] mb-1.5">
                        <span className="text-green-light">🕐</span>
                        <span><strong className="text-green-mid">Hours:</strong> {resource.hours}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-[var(--text-body)]">
                        <span className="text-green-light">✉️</span>
                        <span><strong className="text-green-mid">Email:</strong> {resource.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                    className="flex items-center justify-between w-full pt-3 border-t border-green-wash bg-none cursor-pointer font-outfit text-sm font-semibold text-green-mid transition-colors hover:text-green-deep"
                  >
                    <span>{expandedCard === i ? 'Hide Details' : 'View Details'}</span>
                    <span className={`w-6 h-6 rounded-full bg-green-mist border border-green-wash flex items-center justify-center text-[10px] transition-transform ${expandedCard === i ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No results */}
          {filteredResources.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="font-space text-2xl font-bold text-[var(--text-dark)] mb-2">No resources found</h3>
              <p className="font-outfit text-[var(--text-muted)]">Try a different keyword or category filter.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

