'use client'

import React, { useState, useEffect } from 'react'
import { useSettings } from '@/context/SettingsContext'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, GraduationCap, Users, Briefcase, Heart, Building2,
  Search, Leaf, Flame, ChevronDown, ArrowUp, MapPin, Phone,
  Clock, Mail, ExternalLink, HeartHandshake, Home, Stethoscope,
  Dumbbell, PhoneCall, TreePine, Award, HelpCircle, Bus, Shield,
  AlertCircle, RefreshCw, Loader2, Trash2, Pencil, X, Save,
} from 'lucide-react'
import { HeroDemo } from '@/components/ui/animated-hero-demo'
import TiltCard from '@/components/TiltCard'
import { supabase } from '@/lib/supabaseClient'
import { useT } from '@/lib/useT'

// ─── Images ───────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

type ResourceCard = {
  title: string
  category: string
  description: string
  phone?: string
  email?: string
  hours?: string
  location?: string
  website?: string
  resourceIcon: React.ElementType
  dbId?: string
  contactEmail?: string
  userId?: string
}

type DbResource = {
  id: string
  user_id?: string
  name: string
  category: string
  description: string
  address?: string
  phone?: string
  email?: string
  hours?: string
  website_url?: string
  is_verified: boolean
  is_featured: boolean
  created_at: string
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const categoryIcons: Record<string, React.ElementType> = {
  'Education':          GraduationCap,
  'Career':             Briefcase,
  'Career & Jobs':      Briefcase,
  'Health':             Heart,
  'Health & Wellness':  Heart,
  'Volunteering':       Users,
  'Community Projects': Building2,
  'Events':             Building2,
  'Food & Nutrition':   Leaf,
  'Housing & Shelter':  Home,
  'Legal Services':     Shield,
  'Mental Health':      Heart,
  'Youth Programs':     Award,
  'Senior Services':    Bus,
  'Other':              HelpCircle,
}

const getIcon = (category: string): React.ElementType =>
  categoryIcons[category] ?? Building2

// ─── Static resources ─────────────────────────────────────────────────────────

const hardcodedResources: ResourceCard[] = [
  { title: 'Bothell Regional Library (KCLS)', category: 'Education', resourceIcon: BookOpen, description: 'Free access to books, digital resources, study rooms, homework help, and community programs for all ages. Library cards are free for all King County residents.', phone: '(425) 486-7811', email: 'askus@kcls.org', hours: 'Mon-Thu 10AM-8PM, Fri-Sat 10AM-6PM, Sun 1-5PM', location: 'Bothell Regional Library, 18215 98th Ave NE, Bothell WA 98011' },
  { title: 'Northshore School District', category: 'Education', resourceIcon: GraduationCap, description: 'Serving over 22,000 students across Bothell, Kenmore, and Woodinville. Family engagement programs, multilingual support, special education services, and community partnerships.', phone: '(425) 408-7600', email: 'info@nsd.org', hours: 'Mon-Fri 7:30AM-4:30PM', location: 'Northshore School District, 3330 Monte Villa Pkwy, Bothell WA 98021' },
  { title: 'Northshore Volunteer Services', category: 'Volunteering', resourceIcon: HeartHandshake, description: 'Connecting Bothell-area volunteers with meaningful community opportunities. Place volunteers with nonprofits, schools, and city programs. Free training and orientation.', phone: '(425) 485-1112', email: 'office@nvskc.org', hours: 'Mon-Fri 9AM-5PM', location: 'Northshore Volunteer Services, 6809 228th St SW, Mountlake Terrace WA 98043' },
  { title: 'WorkSource Seattle-King County', category: 'Career & Jobs', resourceIcon: Briefcase, description: 'Free career services including job search assistance, resume workshops, interview prep, and employer connections. Serves all job seekers in King County.', phone: '(206) 296-5051', email: 'worksourceskc@esd.wa.gov', hours: 'Mon-Fri 8AM-5PM', location: 'WorkSource Seattle, 2nd Ave Extension S, Seattle WA 98104 (online services available)' },
  { title: 'Hopelink Bothell', category: 'Community Projects', resourceIcon: Home, description: 'Hopelink provides food, financial assistance, housing, and transportation services to families and individuals in need across the Eastside and North King County.', phone: '(425) 943-6700', email: 'info@hope-link.org', hours: 'Mon-Fri 9AM-4PM', location: 'Hopelink Bothell, 23640 Bothell Everett Hwy, Bothell WA 98021' },
  { title: 'EvergreenHealth Medical Center', category: 'Health & Wellness', resourceIcon: Stethoscope, description: 'Full-service hospital and medical center providing emergency care, primary care, and specialty services. Serving the Northshore community with compassionate, high-quality care.', phone: '(425) 899-5200', email: 'info@evergreenhealth.com', hours: 'Emergency: 24/7 | Clinics: Mon-Fri 8AM-5PM', location: 'EvergreenHealth, 12040 NE 128th St, Kirkland WA 98034' },
  { title: 'Northshore Senior Center', category: 'Senior Services', resourceIcon: Users, description: 'Social, educational, and wellness programs for adults 50+. Fitness classes, lunch program, day trips, arts and crafts, and social events. No membership required.', phone: '(425) 488-1785', email: 'info@northshoresenior.org', hours: 'Mon-Fri 8:30AM-4:30PM', location: 'Northshore Senior Center, 10201 E Riverside Dr, Bothell WA 98011' },
  { title: 'YMCA Northshore', category: 'Health & Wellness', resourceIcon: Dumbbell, description: 'Programs for all ages including fitness, aquatics, youth sports, summer camps, and childcare. Financial assistance available to ensure everyone can participate regardless of income.', phone: '(425) 485-9797', email: 'northshoreymca@seattleymca.org', hours: 'Mon-Fri 5AM-10PM, Sat-Sun 7AM-8PM', location: 'YMCA Northshore, 23401 Lakeview Dr, Mountlake Terrace WA 98043' },
  { title: 'Crisis Connections Washington', category: 'Mental Health', resourceIcon: PhoneCall, description: '24/7 confidential crisis support line. Call or text anytime for mental health crisis support, suicide prevention, emotional support, and connection to local resources.', phone: '(866) 427-4747', email: 'info@crisisconnections.org', hours: 'Available 24/7 by call or text', location: 'Phone and online support (confidential)' },
  { title: 'City of Bothell Parks & Recreation', category: 'Community Projects', resourceIcon: TreePine, description: 'Year-round recreational programs, park rentals, community events, sports leagues, and senior activities. Bothell Landing, Canyon Park, and more are managed by Parks & Rec.', phone: '(425) 806-6700', email: 'parks@bothellwa.gov', hours: 'Mon-Fri 8AM-5PM', location: 'Bothell City Hall, 18415 101st Ave NE, Bothell WA 98011' },
  { title: 'Northshore Schools Foundation', category: 'Education', resourceIcon: Award, description: 'Grants and resources that directly support Northshore School District students and teachers. Funds classroom innovation, student enrichment, and financial assistance for activities.', phone: '(425) 408-6014', email: 'info@northshorefoundation.org', hours: 'Mon-Fri 8AM-4PM', location: 'Northshore Schools Foundation, 3330 Monte Villa Pkwy, Bothell WA 98021' },
  { title: '211 King County', category: 'Career & Jobs', resourceIcon: HelpCircle, description: 'Dial 2-1-1 to connect with a specialist who can help find local health, human services, and social service programs. Free, confidential, available in multiple languages.', phone: 'Dial 2-1-1', email: 'info@211kingcounty.org', hours: 'Available 24/7 online or by phone', location: 'Phone and online service for all of King County' },
  { title: 'Imagine Housing', category: 'Housing & Shelter', resourceIcon: Building2, description: 'Nonprofit providing affordable rental housing and resident services to low-income individuals and families in Eastside King County, including Bothell and Kenmore.', phone: '(425) 576-7000', email: 'info@imaginehousing.org', hours: 'Mon-Fri 9AM-5PM', location: 'Imagine Housing, 1901 Lind Ave SW, Renton WA 98057' },
  { title: 'Kenmore-Bothell Volunteer Fire Dept.', category: 'Volunteering', resourceIcon: Flame, description: 'The Northshore Fire Department welcomes community volunteers for auxiliary support, fire safety education, neighborhood emergency preparedness, and CERT training.', phone: '(425) 354-2700', email: 'info@northshorefire.com', hours: 'Administrative Mon-Fri 8AM-5PM', location: 'Northshore Fire, 6604 228th St SW, Mountlake Terrace WA 98043' },
  { title: 'Sound Generations (Senior Services)', category: 'Senior Services', resourceIcon: Bus, description: 'Transportation, Meals on Wheels, caregiver support, and connection programs for older adults. Hyde Shuttle provides free or low-cost rides to medical appointments and grocery stores.', phone: '(206) 448-3110', email: 'info@soundgenerations.org', hours: 'Mon-Fri 8AM-5PM', location: 'Sound Generations, 2208 2nd Ave, Seattle WA 98121 (serves Northshore area)' },
  { title: 'Eastside Legal Assistance Program', category: 'Legal Services', resourceIcon: Shield, description: 'Free civil legal assistance for low-income individuals on matters including housing, family law, benefits, and immigration. Walk-in clinics and appointment-based services available.', phone: '(425) 747-7274', email: 'info@elap.org', hours: 'Mon-Fri 9AM-5PM', location: 'ELAP, 1400 112th Ave SE, Bellevue WA 98004' },
  { title: 'Kenmore City Library (KCLS)', category: 'Education', resourceIcon: BookOpen, description: 'Branch of King County Library System serving Kenmore and north Bothell residents. Offers children and teen programming, digital literacy classes, job search support, and community meeting spaces.', phone: '(425) 486-7811', email: 'askus@kcls.org', hours: 'Mon-Thu 10AM-8PM, Fri-Sat 10AM-6PM', location: 'Kenmore Library, 6400 NE 181st St, Kenmore WA 98028' },
  { title: 'King County Housing Authority', category: 'Housing & Shelter', resourceIcon: Home, description: 'Administers housing choice vouchers and affordable housing programs in King County. KCHA assists low-income families, seniors, and individuals with disabilities in securing stable housing.', phone: '(206) 574-1100', email: 'info@kcha.org', hours: 'Mon-Fri 8AM-5PM', location: 'KCHA, 600 Andover Park W, Tukwila WA 98188' },
  { title: 'Treehouse (Foster Youth Support)', category: 'Youth Programs', resourceIcon: Award, description: 'Ensures foster youth have the essentials to succeed in school and life. Provides free school supplies, clothing, tutoring, scholarships, and mentorship for young people in foster care.', phone: '(206) 767-7000', email: 'info@treehouseforyouth.org', hours: 'Mon-Fri 8:30AM-4:30PM', location: 'Treehouse, 2100 24th Ave S, Seattle WA 98144' },
  { title: 'Friends of Youth', category: 'Youth Programs', resourceIcon: Users, description: 'Provides shelter, housing, and supportive services for homeless and at-risk youth ages 12-24. Volunteer mentors and life-skills coaches help young people build a stable future.', phone: '(425) 869-2650', email: 'info@friendsofyouth.org', hours: 'Mon-Fri 8:30AM-5PM', location: 'Friends of Youth, 16225 NE 87th St, Redmond WA 98052' },
  { title: 'NAMI Greater Seattle', category: 'Mental Health', resourceIcon: Heart, description: 'National Alliance on Mental Illness chapter offering free support groups, education programs, and mental health advocacy. Family and peer support for anyone affected by mental illness.', phone: '(206) 783-1536', email: 'info@namigreaterseattle.org', hours: 'Mon-Fri 9AM-5PM | Helpline: Mon-Fri 10AM-6PM', location: 'NAMI Greater Seattle, 4110 Roosevelt Way NE, Seattle WA 98105' },
  { title: 'Sea Mar Community Health Centers', category: 'Health & Wellness', resourceIcon: Stethoscope, description: 'Federally qualified health center offering medical, dental, and behavioral health services on a sliding-scale fee. Committed to serving Latino and underserved communities throughout Washington.', phone: '(206) 764-4700', email: 'info@seamar.org', hours: 'Mon-Fri 8AM-6PM | Selected sites Sat 8AM-4PM', location: 'Sea Mar, 1040 S Henderson St, Seattle WA 98108 (multiple Eastside locations)' },
  { title: 'Compass Health', category: 'Mental Health', resourceIcon: PhoneCall, description: 'Behavioral health services across northwest Washington including outpatient therapy, crisis services, residential treatment, and school-based support. No one is turned away for inability to pay.', phone: '(800) 584-3578', email: 'info@compasshealth.org', hours: 'Mon-Fri 8AM-5PM | Crisis line 24/7', location: 'Compass Health, 1631 Michigan Ave, Everett WA 98201 (regional offices)' },
  { title: 'Washington STEM', category: 'Education', resourceIcon: GraduationCap, description: 'Statewide nonprofit expanding STEM education access for underserved students. Partners with schools, educators, and employers to build science, tech, engineering, and math pathways.', phone: '(360) 534-2355', email: 'info@washingtonstem.org', hours: 'Mon-Fri 8AM-5PM', location: 'Washington STEM, 1215 4th Ave Suite 1200, Seattle WA 98161' },
  { title: 'Workforce Development Council of Seattle-King County', category: 'Career & Jobs', resourceIcon: Briefcase, description: 'Connects job seekers with training, certifications, and employment services. Funds programs in healthcare, tech, construction, and other in-demand industries across King County.', phone: '(206) 448-0474', email: 'contact@seakingwdc.org', hours: 'Mon-Fri 8AM-5PM', location: 'WDC, 2003 Western Ave, Seattle WA 98121' },
  { title: 'Bellevue College Continuing Education', category: 'Education', resourceIcon: GraduationCap, description: 'Non-credit and professional development courses open to the public. Offerings include business skills, technology, healthcare, language learning, and personal enrichment programs.', phone: '(425) 564-2263', email: 'continuinged@bellevuecollege.edu', hours: 'Mon-Fri 8AM-5PM', location: 'Bellevue College, 3000 Landerholm Circle SE, Bellevue WA 98007' },
  { title: 'YWCA of Seattle-King County', category: 'Community Projects', resourceIcon: HeartHandshake, description: 'Empowers women, children, and families through domestic violence services, affordable housing, childcare, employment training, and racial justice programming across the region.', phone: '(206) 461-4888', email: 'info@ywcaworks.org', hours: 'Mon-Fri 8AM-5PM | Crisis line 24/7', location: 'YWCA, 1118 5th Ave, Seattle WA 98101' },
  { title: 'Habitat for Humanity Seattle-King County', category: 'Housing & Shelter', resourceIcon: Home, description: 'Build and repair homes alongside families in need. Volunteer opportunities every weekend including framing, painting, landscaping, and ReStore donation center operations.', phone: '(206) 453-2037', email: 'volunteer@habitatskc.org', hours: 'Build sites: Sat-Sun 8AM-4PM | ReStore: Mon-Sat 9AM-6PM', location: 'Habitat SKC, 560 Naches Ave SW, Renton WA 98057' },
  { title: 'Refugee & Immigrant Services Northwest', category: 'Community Projects', resourceIcon: Users, description: 'Provides case management, English language classes, employment support, and legal advocacy for refugees and immigrants resettling in Snohomish and King County.', phone: '(425) 347-9471', email: 'info@risn.org', hours: 'Mon-Fri 9AM-5PM', location: 'RISN, 3320 Lombard Ave, Everett WA 98201' },
  { title: 'Denali Center Adult Day Program', category: 'Senior Services', resourceIcon: Bus, description: 'Structured daytime support for seniors and adults with disabilities. Provides socialization, health monitoring, meals, and therapeutic activities to help participants live at home longer.', phone: '(425) 823-2700', email: 'info@denalicenter.org', hours: 'Mon-Fri 7:30AM-5:30PM', location: 'Denali Center, 15901 Bothell-Everett Hwy, Mill Creek WA 98012' },
  { title: 'Eastside Baby Corner', category: 'Community Projects', resourceIcon: HeartHandshake, description: 'Provides infant and toddler essentials including clothing, diapers, and gear to families in need. Volunteers sort donations and host drives to keep the community stocked year-round.', phone: '(425) 746-5282', email: 'info@eastsidebabycorner.org', hours: 'Mon-Fri 9AM-3PM | Volunteer Thu-Fri only', location: 'Eastside Baby Corner, 515 116th Ave NE, Bellevue WA 98004' },
  { title: 'Northshore Utility District', category: 'Community Projects', resourceIcon: Building2, description: 'Provides water and sewer services to the Northshore area. Offers water-saving rebates, free conservation kits, and low-income assistance programs for qualifying residents.', phone: '(425) 487-1234', email: 'info@nud.net', hours: 'Mon-Fri 7:30AM-5PM', location: 'Northshore Utility District, 6830 NE 185th St, Kenmore WA 98028' },
  { title: 'Eastside Adult Day Health', category: 'Senior Services', resourceIcon: Stethoscope, description: 'Medical adult day services providing nursing care, therapy, personal care, and social programs for adults with complex health needs. Supports family caregivers with respite.', phone: '(425) 455-1936', email: 'info@eastsideadultday.com', hours: 'Mon-Fri 7AM-5:30PM', location: 'Eastside Adult Day Health, 1400 164th Ave SE, Bellevue WA 98008' },
  { title: 'King County Metro Transit', category: 'Community Projects', resourceIcon: Bus, description: 'Public bus service connecting Bothell, Kenmore, and Woodinville to the greater Seattle area. ORCA card access, reduced fares for seniors and low-income riders, and paratransit services.', phone: '(206) 553-3000', email: 'kcmetro@kingcounty.gov', hours: 'Service 24/7 | Customer service Mon-Fri 8AM-5PM', location: 'Metro Transit, 201 S Jackson St, Seattle WA 98104' },
  { title: 'Northshore Churches Food Pantry', category: 'Food & Nutrition', resourceIcon: Leaf, description: 'Collaborative food distribution by local faith communities providing fresh produce, canned goods, and pantry staples to families experiencing food insecurity in the Northshore area.', phone: '(425) 481-7653', email: 'pantry@northshorechurches.org', hours: 'Tue & Thu 10AM-12PM, Sat 9AM-11AM', location: 'Bothell United Methodist Church, 9915 NE 180th St, Bothell WA 98011' },
]

// ─── DB → card mapper ─────────────────────────────────────────────────────────

function dbToCard(r: DbResource): ResourceCard {
  return {
    title:        r.name        ?? 'Untitled Resource',
    category:     r.category    ?? 'Other',
    description:  r.description ?? '',
    phone:        r.phone       ?? undefined,
    email:        r.email       ?? undefined,
    hours:        r.hours       ?? undefined,
    location:     r.address     ?? undefined,
    website:      r.website_url ?? undefined,
    resourceIcon: getIcon(r.category ?? ''),
    dbId:         r.id,
    contactEmail: r.email       ?? undefined,
    userId:       r.user_id     ?? undefined,
  }
}

// ─── Merge helper (dedupes by lowercase title, excludes test/demo entries) ────

const EXCLUDED_TITLES = new Set(['test', 'test 2', 'fsd'])

function mergeAll(dbCards: ResourceCard[]): ResourceCard[] {
  const seen = new Set<string>()
  const result: ResourceCard[] = []
  for (const r of dbCards) {
    const lower = r.title.toLowerCase()
    if (!seen.has(lower) && !EXCLUDED_TITLES.has(lower)) {
      seen.add(lower)
      result.push(r)
    }
  }
  for (const r of hardcodedResources) {
    const lower = r.title.toLowerCase()
    if (!seen.has(lower)) {
      seen.add(lower)
      result.push(r)
    }
  }
  return result
}

// ─── Category filter list ─────────────────────────────────────────────────────

const categoryFilters = [
  { id: 'all',              label: 'All Resources' },
  { id: 'Education',        label: 'Education' },
  { id: 'Health & Wellness', label: 'Health & Wellness' },
  { id: 'Career & Jobs',    label: 'Career & Jobs' },
  { id: 'Volunteering',     label: 'Volunteering' },
  { id: 'Community Projects', label: 'Community Projects' },
  { id: 'Food & Nutrition', label: 'Food & Nutrition' },
  { id: 'Housing & Shelter', label: 'Housing & Shelter' },
  { id: 'Legal Services',   label: 'Legal Services' },
  { id: 'Mental Health',    label: 'Mental Health' },
  { id: 'Youth Programs',   label: 'Youth Programs' },
  { id: 'Senior Services',  label: 'Senior Services' },
  { id: 'Other',            label: 'Other' },
]

// ─── Edit Resource Modal ──────────────────────────────────────────────────────

function EditResourceModal({ resource, onClose, onSaved }: {
  resource: ResourceCard & { dbId: string }
  onClose: () => void
  onSaved: (updates: Partial<ResourceCard>) => void
}) {
  const t = useT()
  const [name,    setName]    = useState(resource.title)
  const [desc,    setDesc]    = useState(resource.description)
  const [phone,   setPhone]   = useState(resource.phone    || '')
  const [email,   setEmail]   = useState(resource.email    || '')
  const [address, setAddress] = useState(resource.location || '')
  const [hours,   setHours]   = useState(resource.hours    || '')
  const [website, setWebsite] = useState(resource.website  || '')
  const [saving,  setSaving]  = useState(false)
  const [err,     setErr]     = useState('')

  const inp = "w-full px-3 py-2 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-sky-400/40"
  const inpStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(86,187,240,0.2)' }

  const save = async () => {
    if (!name.trim()) { setErr('Name is required'); return }
    setSaving(true); setErr('')
    const { error } = await supabase.from('resources').update({
      name, description: desc,
      phone:       phone   || null,
      email:       email   || null,
      address:     address || null,
      hours:       hours   || null,
      website_url: website || null,
    }).eq('id', resource.dbId)
    if (error) { setErr('Save failed. Try again.'); setSaving(false); return }
    onSaved({ title: name, description: desc, phone: phone || undefined, email: email || undefined, location: address || undefined, hours: hours || undefined, website: website || undefined })
    onClose()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(1,22,41,0.85)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #022747 0%, #033460 100%)', border: '1px solid rgba(86,187,240,0.22)', boxShadow: '0 40px 100px rgba(1,22,41,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-sky-400/10">
          <h3 className="font-syne text-lg font-bold text-white">Edit Resource</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ color: 'rgba(198,235,255,0.5)', background: 'rgba(255,255,255,0.05)' }}><X size={14} /></button>
        </div>
        <div className="px-6 py-5 space-y-3 max-h-[65vh] overflow-y-auto">
          {err && <p className="text-xs font-outfit text-red-400 px-1">{err}</p>}
          {[
            { label: 'Name *', val: name, set: setName },
            { label: 'Email', val: email, set: setEmail },
            { label: 'Phone', val: phone, set: setPhone },
            { label: 'Address', val: address, set: setAddress },
            { label: 'Hours', val: hours, set: setHours },
            { label: 'Website', val: website, set: setWebsite },
          ].map(f => (
            <div key={f.label}>
              <label className="block font-outfit text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(198,235,255,0.45)' }}>{f.label}</label>
              <input value={f.val} onChange={e => f.set(e.target.value)} className={inp} style={inpStyle} />
            </div>
          ))}
          <div>
            <label className="block font-outfit text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(198,235,255,0.45)' }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={`${inp} resize-none`} style={inpStyle} />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl font-outfit text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(198,235,255,0.6)' }}>Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-2xl font-outfit text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#0857A0,#2499D6)' }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const { settings } = useSettings()
  const dk = settings.dark
  const { user } = useAuth()

  // Dark-mode colour tokens (used in inline styles below)
  const d = {
    sectionBg:   dk ? '#011629'                : 'linear-gradient(160deg, #EBF7FF 0%, #F0F9FF 50%, #E0F2FE 100%)',
    controlsBg:  dk ? 'rgba(2,39,71,0.92)'    : 'rgba(255,255,255,0.75)',
    border:      dk ? 'rgba(36,153,214,0.3)'  : '#BFDBFE',
    inputBg:     dk ? 'rgba(2,39,71,0.9)'     : '#ffffff',
    textDark:    dk ? '#C6EBFF'               : '#022747',
    textBody:    dk ? '#90D4F7'               : '#044069',
    textLink:    dk ? '#90D4F7'               : '#085D8A',
    sortLabel:   dk ? '#90D4F7'               : '#044069',
    cardBg:      dk ? '#022747'               : 'rgba(255,255,255,0.82)',
    cardBorder:  dk ? 'rgba(36,153,214,0.25)' : '#BFDBFE',
    detailsBg:   dk ? 'rgba(1,22,41,0.6)'     : '#EBF7FF',
    detailsBdr:  dk ? 'rgba(36,153,214,0.2)'  : '#BFDBFE',
    btnBg:       dk ? '#022747'               : '#ffffff',
    btnColor:    dk ? '#C6EBFF'               : '#044069',
    toggleBdr:   dk ? 'rgba(36,153,214,0.2)'  : '#BFDBFE',
  }

  const DARK_CARD = {
    bg:            '#022747',
    border:        'rgba(36,153,214,0.25)',
    textPrimary:   '#008fb5',
    textSecondary: '#008fb5',
    textLink:      '#008fb5',
    detailsBg:     'rgba(1,22,41,0.6)',
    detailsBorder: 'rgba(36,153,214,0.2)',
    toggleBorder:  'rgba(36,153,214,0.2)',
  }

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery]       = useState('')
  const [sortBy, setSortBy]                 = useState('default')
  const [expandedCard, setExpandedCard]     = useState<number | null>(null)
  const [showBackToTop, setShowBackToTop]   = useState(false)
  const [showAll, setShowAll]               = useState(false)
  const [allResources, setAllResources]     = useState<ResourceCard[]>(hardcodedResources)
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState<string | null>(null)
  const [ownedIds, setOwnedIds]             = useState<Set<string>>(new Set())
  const [deletingId, setDeletingId]         = useState<string | null>(null)
  const [editingResource, setEditingResource] = useState<(ResourceCard & { dbId: string }) | null>(null)

  useEffect(() => {
    if (!user) return
    try {
      const key = `cc-my-resources-${user.id}`
      const ids: string[] = JSON.parse(localStorage.getItem(key) || '[]')
      setOwnedIds(new Set(ids))
    } catch { /* ignore */ }
  }, [user])

  const isOwned = (r: ResourceCard) =>
    !!(user && r.dbId && r.userId === user.id)

  const handleDeleteResource = async (dbId: string) => {
    setDeletingId(dbId)
    const { error: delErr } = await supabase.from('resources').delete().eq('id', dbId)
    if (!delErr) {
      setAllResources(prev => prev.filter(r => r.dbId !== dbId))
      if (user) {
        try {
          const key = `cc-my-resources-${user.id}`
          const ids: string[] = JSON.parse(localStorage.getItem(key) || '[]')
          localStorage.setItem(key, JSON.stringify(ids.filter(id => id !== dbId)))
          setOwnedIds(prev => { const s = new Set(prev); s.delete(dbId); return s })
        } catch { /* ignore */ }
      }
    }
    setDeletingId(null)
  }

  // scroll watcher
  useEffect(() => {
    const handler = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // initial load
  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: dbError } = await supabase
          .from('resources')
          .select('id, user_id, name, category, description, address, phone, email, hours, website_url, is_verified, is_featured, created_at')
          .order('created_at', { ascending: false })

        const dbCards = data ? (data as DbResource[]).map(r => dbToCard(r)) : []
        setAllResources(mergeAll(dbCards))

        if (dbError) setError('Some live data could not be loaded.')
      } catch (err: unknown) {
        console.error('Resources load error:', JSON.stringify(err, null, 2))
        setError('Could not load live resources. Showing static content.')
        setAllResources(hardcodedResources)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // real-time: new row in resources → add card instantly
  useEffect(() => {
    const channel = supabase
      .channel('resources-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'resources' }, payload => {
        const r = payload.new as DbResource
        const card = dbToCard(r)
        setAllResources(prev => {
          if (prev.some(p => p.title.toLowerCase() === card.title.toLowerCase())) return prev
          return [...prev, card]
        })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  // filter + sort
  const filtered = allResources
    .filter(r => activeCategory === 'all' || r.category === activeCategory)
    .filter(r => {
      const q = searchQuery.toLowerCase()
      return (
        (r.title       ?? '').toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        (r.category    ?? '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'az')       return a.title.localeCompare(b.title)
      if (sortBy === 'za')       return b.title.localeCompare(a.title)
      if (sortBy === 'category') return a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
      return 0
    })

  const INITIAL_SHOW = 9
  const visibleResources = showAll ? filtered : filtered.slice(0, INITIAL_SHOW)
  const hasMore = !showAll && filtered.length > INITIAL_SHOW

  return (
    <>
      <AnimatePresence>
        {editingResource && (
          <EditResourceModal
            resource={editingResource}
            onClose={() => setEditingResource(null)}
            onSaved={updates => {
              setAllResources(prev => prev.map(r => r.dbId === editingResource.dbId ? { ...r, ...updates } : r))
              setEditingResource(null)
            }}
          />
        )}
      </AnimatePresence>
      <HeroDemo
        badge="30+ Resources Listed"
        staticTitle="Community Resource Hub"
        subtitle="Find nonprofits, support services, health programs, and opportunities. All verified and free to access."
        backgroundImage="/img/page-4.jpg"
      />

      <div className="relative z-10">
      <section className="py-24 resources-section" id="directory"
        style={{ background: 'linear-gradient(160deg, #EBF7FF 0%, #F0F9FF 50%, #E0F2FE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-orange-200 bg-orange-50 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-sm font-dm-sans text-orange-800">
                  <AlertCircle size={15} className="flex-shrink-0" /> {error}
                </div>
                <button onClick={() => window.location.reload()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 hover:text-orange-900 transition-colors flex-shrink-0">
                  <RefreshCw size={12} /> Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-8 lg:p-10 mb-12 border shadow-xl"
            style={{ backgroundColor: d.controlsBg, backdropFilter: 'blur(16px)', borderColor: d.border }}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by name, description, or category..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowAll(false) }}
                  className="w-full px-5 py-4 rounded-2xl border font-dm-sans text-sm outline-none focus:border-sky-400 transition-all shadow-sm focus:shadow-md"
                  style={{ backgroundColor: d.inputBg, color: d.textDark, borderColor: d.border }}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
              </div>
              <div className="flex items-center gap-3">
                <label className="font-dm-sans text-sm font-semibold" style={{ color: d.sortLabel }}>Sort:</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-xl border font-dm-sans text-sm cursor-pointer focus:border-sky-400 outline-none shadow-sm"
                  style={{ backgroundColor: d.inputBg, color: d.textDark, borderColor: d.border }}>
                  <option value="default">Default</option>
                  <option value="az">A to Z</option>
                  <option value="za">Z to A</option>
                  <option value="category">By Category</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {categoryFilters.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setShowAll(false) }}
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-md ${
                    activeCategory === cat.id
                      ? 'bg-sky-500 text-white shadow-sky-500/25 border border-sky-400'
                      : 'border hover:border-sky-300 hover:shadow-lg'
                  }`}
                  style={activeCategory !== cat.id ? { backgroundColor: d.btnBg, color: d.btnColor, borderColor: d.border } : {}}>
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <div className="flex justify-between items-center mb-8">
            <p className="font-dm-sans text-base font-semibold" style={{ color: d.textDark }}>
              Showing <strong>{filtered.length}</strong> of <strong>{allResources.length}</strong> resources
            </p>
            {loading && (
              <div className="flex items-center gap-2 text-sm font-dm-sans" style={{ color: d.textLink }}>
                <Loader2 size={14} className="animate-spin" /> Loading live data…
              </div>
            )}
          </div>

          {/* Cards */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl overflow-hidden border" style={{ borderColor: '#BFDBFE' }}>
                  <div className="h-40 bg-sky-200/50" />
                  <div className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-sky-200/50 rounded-2xl" />
                    <div className="h-8 bg-sky-200/50 rounded-lg w-3/4" />
                    <div className="h-4 bg-sky-200/30 rounded w-full" />
                    <div className="h-4 bg-sky-200/30 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
              <Search size={64} className="text-sky-300 mx-auto mb-6" />
              <h3 className="font-syne text-3xl font-bold mb-3" style={{ color: d.textDark }}>No resources found</h3>
              <p className="font-dm-sans text-lg max-w-md mx-auto" style={{ color: d.textBody }}>
                Try a different keyword or category filter.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleResources.map((resource, i) => {
                const Icon = resource.resourceIcon

                return (
                  <motion.div
                    key={`${resource.title}-${i}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (i % 6) * 0.1 }}
                    className="h-full"
                  >
                    <TiltCard className="h-full" intensity={12} glareOpacity={0.16}>
                      <div
                        className="group rounded-3xl overflow-hidden h-full min-h-[380px] flex flex-col transition-all duration-500 shadow-2xl resource-card-outer"
                        style={{
                          backdropFilter: 'blur(12px)',
                          backgroundColor: 'rgba(255,255,255,0.82)',
                          borderColor: '#BFDBFE',
                        }}
                      >
                        {/* Accent strip */}
                        <div
                          className="h-2 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'linear-gradient(to right, #38BDF8, #0EA5E9)' }}
                        />

                        {/* Body */}
                        <div className="p-8 resource-card-body flex flex-col flex-1">
                      <div className="flex-1">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-5 -mt-7 border-2 border-white"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
                        <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                      </div>

                      <h3 className="font-syne text-2xl font-bold mb-3 leading-tight" style={{ color: DARK_CARD.textPrimary }}>
                        {resource.title}
                      </h3>
                      <p className="font-dm-sans text-base leading-relaxed mb-6 line-clamp-3" style={{ color: DARK_CARD.textSecondary }}>
                        {resource.description}
                      </p>
                      </div>

                      {/* Expandable details */}
                      <div className={`overflow-hidden transition-all duration-500 ${expandedCard === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="rounded-2xl p-6 mb-4 border resource-card-details">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                            {resource.location && (
                              <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-sky-400 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold mb-1" style={{ color: DARK_CARD.textPrimary }}>Location</div>
                                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.location)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="hover:underline" style={{ color: DARK_CARD.textLink }}>
                                    {resource.location}
                                  </a>
                                </div>
                              </div>
                            )}

                            {resource.phone && (
                              <div className="flex items-start gap-3">
                                <Phone size={16} className="text-sky-400 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold mb-1" style={{ color: DARK_CARD.textPrimary }}>Phone</div>
                                  <a href={`tel:${resource.phone.replace(/\D/g, '')}`}
                                    className="hover:underline" style={{ color: DARK_CARD.textLink }}>
                                    {resource.phone}
                                  </a>
                                </div>
                              </div>
                            )}

                            {resource.hours && (
                              <div className="flex items-start gap-3">
                                <Clock size={16} className="text-sky-400 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold mb-1" style={{ color: DARK_CARD.textPrimary }}>Hours</div>
                                  <div style={{ color: DARK_CARD.textSecondary }}>{resource.hours}</div>
                                </div>
                              </div>
                            )}

                            {resource.email && (
                              <div className="flex items-start gap-3">
                                <Mail size={16} className="text-sky-400 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold mb-1" style={{ color: DARK_CARD.textPrimary }}>Email</div>
                                  <a href={`mailto:${resource.email}`}
                                    className="hover:underline break-all" style={{ color: DARK_CARD.textLink }}>
                                    {resource.email}
                                  </a>
                                </div>
                              </div>
                            )}

                            {resource.website && (
                              <div className="flex items-start gap-3 md:col-span-2">
                                <ExternalLink size={16} className="text-sky-400 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold mb-1" style={{ color: DARK_CARD.textPrimary }}>Website</div>
                                  <a href={resource.website} target="_blank" rel="noopener noreferrer"
                                    className="hover:underline break-all" style={{ color: DARK_CARD.textLink }}>
                                    {resource.website}
                                  </a>
                                </div>
                              </div>
                            )}

                          </div>

                        </div>
                      </div>

                      {/* Owner actions */}
                      {isOwned(resource) && resource.dbId && expandedCard === i && (
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={e => { e.stopPropagation(); setEditingResource(resource as ResourceCard & { dbId: string }) }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-outfit text-xs font-semibold transition-all"
                            style={{ background: 'rgba(86,187,240,0.1)', border: '1px solid rgba(86,187,240,0.25)', color: '#56BBF0' }}
                          >
                            <Pencil size={11} /> Edit
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); if (resource.dbId) handleDeleteResource(resource.dbId) }}
                            disabled={deletingId === resource.dbId}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-outfit text-xs font-semibold transition-all disabled:opacity-50"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
                          >
                            {deletingId === resource.dbId ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                            {deletingId === resource.dbId ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      )}

                      {/* Toggle */}
                      <button
                        onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                        className="flex items-center justify-between w-full pt-4 border-t cursor-pointer font-dm-sans text-base font-semibold transition-all group-hover:scale-[1.02]"
                        style={{ borderColor: DARK_CARD.toggleBorder, color: DARK_CARD.textSecondary, background: 'none' }}
                      >
                        <span>{expandedCard === i ? 'Hide Details' : 'View Full Details'}</span>
                        <ChevronDown size={20} className={`transition-transform duration-300 ${expandedCard === i ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </TiltCard>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* View More */}
          {!loading && hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 mt-10"
            >
              <p className="font-dm-sans text-sm" style={{ color: d.textBody }}>
                Showing {INITIAL_SHOW} of {filtered.length} resources
              </p>
              <button
                onClick={() => setShowAll(true)}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl font-outfit font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: 'white', boxShadow: '0 8px 24px rgba(14,165,233,0.35)' }}
              >
                View All {filtered.length} Resources
                <ChevronDown size={16} />
              </button>
            </motion.div>
          )}

          {!loading && showAll && filtered.length > INITIAL_SHOW && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => { setShowAll(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-outfit font-semibold text-sm transition-all"
                style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', color: '#0ea5e9' }}
              >
                Show Fewer
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Back to Top */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={showBackToTop ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 left-8 w-14 h-14 rounded-3xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 z-50 hover:-translate-y-1 active:scale-95"
      >
        <ArrowUp size={20} />
      </motion.button>
      </div>
    </>
  )
}