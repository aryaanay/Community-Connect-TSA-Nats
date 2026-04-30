import {
  BookOpen,
  Briefcase,
  Bus,
  CalendarHeart,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home,
  Landmark,
  Leaf,
  type LucideIcon,
  Shield,
  Soup,
  Sparkles,
  Users,
} from 'lucide-react'

export type ResourceCategory =
  | 'Education'
  | 'Health & Wellness'
  | 'Food & Essentials'
  | 'Housing & Support'
  | 'Career & Jobs'
  | 'Youth & Family'
  | 'Volunteer Opportunities'
  | 'Transportation'

export type CommunityResource = {
  id: string
  name: string
  category: ResourceCategory
  organization: string
  description: string
  audience: string
  address: string
  hours: string
  phone: string
  email: string
  website: string
  tags: string[]
  featured?: boolean
}

export type SpotlightResource = {
  resourceId: string
  label: string
  highlight: string
  impact: string
  callout: string
}

export type CommunityEvent = {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: string
  description: string
}

export type ResearchPoint = {
  title: string
  body: string
}

export type JudgeStop = {
  title: string
  href: string
  note: string
}

export const categoryIcons: Record<ResourceCategory, LucideIcon> = {
  Education: GraduationCap,
  'Health & Wellness': HeartPulse,
  'Food & Essentials': Soup,
  'Housing & Support': Home,
  'Career & Jobs': Briefcase,
  'Youth & Family': Users,
  'Volunteer Opportunities': HandHeart,
  Transportation: Bus,
}

export const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/resources', label: 'Directory' },
  { href: '/events', label: 'Programs' },
  { href: '/about', label: 'Research' },
  { href: '/submit', label: 'Submit' },
  { href: '/judges', label: 'Judges' },
]

export const communityStats = [
  { value: '18', label: 'Curated resources' },
  { value: '8', label: 'Filter categories' },
  { value: '6', label: 'Community programs' },
  { value: '3', label: 'Featured spotlights' },
]

export const marqueeItems = [
  'Searchable directory',
  'Verified contact information',
  'Community highlights',
  'Upcoming programs',
  'Resident submissions',
  'Mobile-friendly design',
  'Accessibility controls',
  'Research-backed content',
]

export const resources: CommunityResource[] = [
  {
    id: 'bothell-library',
    name: 'Bothell Library Learning Hub',
    category: 'Education',
    organization: 'Bothell Regional Library',
    description:
      'Free tutoring referrals, digital literacy workshops, study rooms, and library card access for students, adults, and multilingual families.',
    audience: 'Students, job seekers, families, older adults',
    address: '18215 98th Ave NE, Bothell, WA 98011',
    hours: 'Mon-Thu 10 AM-8 PM, Fri-Sat 10 AM-6 PM, Sun 1 PM-5 PM',
    phone: '(425) 486-7811',
    email: 'ask@kcls.org',
    website: 'https://kcls.org/locations/bothell/',
    tags: ['Tutoring', 'Technology help', 'Study space'],
    featured: true,
  },
  {
    id: 'northshore-school-support',
    name: 'Northshore Family Resource Support',
    category: 'Youth & Family',
    organization: 'Northshore School District',
    description:
      'Connects students and caregivers to counseling, meal support, translated resources, school supplies, and family engagement services.',
    audience: 'K-12 students, caregivers, multilingual households',
    address: '3330 Monte Villa Pkwy, Bothell, WA 98021',
    hours: 'Mon-Fri 7:30 AM-4:30 PM',
    phone: '(425) 408-6000',
    email: 'communications@nsd.org',
    website: 'https://www.nsd.org/',
    tags: ['Student support', 'Family outreach', 'Multilingual services'],
    featured: true,
  },
  {
    id: 'hopelink',
    name: 'Hopelink Food and Financial Assistance',
    category: 'Food & Essentials',
    organization: 'Hopelink',
    description:
      'Offers groceries, emergency financial assistance, diaper supplies, and connections to housing stabilization for residents facing hardship.',
    audience: 'Residents experiencing financial stress',
    address: '18414 103rd Ave NE, Bothell, WA 98011',
    hours: 'Mon-Fri 9 AM-5 PM',
    phone: '(425) 869-6000',
    email: 'info@hopelink.org',
    website: 'https://www.hopelink.org/',
    tags: ['Food bank', 'Emergency help', 'Diapers'],
    featured: true,
  },
  {
    id: 'evergreen-health',
    name: 'EvergreenHealth Community Wellness Access',
    category: 'Health & Wellness',
    organization: 'EvergreenHealth',
    description:
      'Community care navigation, preventive screenings, behavioral health referrals, and wellness education for Northshore residents.',
    audience: 'Adults, seniors, caregivers',
    address: '12040 NE 128th St, Kirkland, WA 98034',
    hours: 'Mon-Fri 8 AM-5 PM',
    phone: '(425) 899-3000',
    email: 'communityoutreach@evergreenhealth.com',
    website: 'https://www.evergreenhealth.com/',
    tags: ['Screenings', 'Behavioral health', 'Care navigation'],
  },
  {
    id: 'ymca-northshore',
    name: 'Northshore YMCA Programs',
    category: 'Youth & Family',
    organization: 'YMCA of Greater Seattle',
    description:
      'Affordable fitness, youth sports, after-school programs, camps, and financial assistance that helps families stay active and connected.',
    audience: 'Youth, teens, families, older adults',
    address: '11811 NE 195th St, Bothell, WA 98011',
    hours: 'Mon-Fri 5 AM-9 PM, Sat-Sun 7 AM-6 PM',
    phone: '(425) 485-9797',
    email: 'northshore@seattleymca.org',
    website: 'https://www.seattleymca.org/locations/northshore-family-ymca',
    tags: ['After school', 'Fitness', 'Financial aid'],
  },
  {
    id: 'worksource',
    name: 'WorkSource Career Launch Point',
    category: 'Career & Jobs',
    organization: 'WorkSource Seattle-King County',
    description:
      'Resume support, hiring events, interview coaching, apprenticeship guidance, and career pathway advising for teens and adults.',
    audience: 'Job seekers, career changers, young adults',
    address: '9600 College Way N, Seattle, WA 98103',
    hours: 'Mon-Fri 8 AM-5 PM',
    phone: '(206) 934-7000',
    email: 'info@worksourceskc.org',
    website: 'https://worksourceskc.org/',
    tags: ['Resume help', 'Hiring events', 'Career coaching'],
  },
  {
    id: 'sound-transit',
    name: 'Community Transit and Travel Training',
    category: 'Transportation',
    organization: 'Community Transit',
    description:
      'Transit education, reduced fare information, route planning support, and travel training for riders who need mobility confidence.',
    audience: 'Students, commuters, seniors, new riders',
    address: '7100 Hardeson Rd, Everett, WA 98203',
    hours: 'Mon-Fri 6:30 AM-6:30 PM',
    phone: '(800) 562-1375',
    email: 'customerservice@commtrans.org',
    website: 'https://www.communitytransit.org/',
    tags: ['Reduced fares', 'Bus routes', 'Travel training'],
  },
  {
    id: 'crisis-connections',
    name: 'Crisis Connections 24/7 Help Line',
    category: 'Health & Wellness',
    organization: 'Crisis Connections',
    description:
      'Confidential crisis response, suicide prevention, emotional support, and referral guidance available every hour of every day.',
    audience: 'Anyone needing urgent support',
    address: 'Remote phone and text support',
    hours: '24/7',
    phone: '(866) 427-4747',
    email: 'info@crisisconnections.org',
    website: 'https://www.crisisconnections.org/',
    tags: ['24/7', 'Mental health', 'Crisis response'],
  },
  {
    id: 'northshore-senior-center',
    name: 'Northshore Senior Center Connections',
    category: 'Health & Wellness',
    organization: 'Northshore Senior Center',
    description:
      'Provides meals, wellness classes, social programs, transportation support, and community belonging for older adults.',
    audience: 'Older adults and caregivers',
    address: '10201 E Riverside Dr, Bothell, WA 98011',
    hours: 'Mon-Fri 8:30 AM-4:30 PM',
    phone: '(425) 487-2441',
    email: 'info@northshoreseniorcenter.org',
    website: 'https://northshoreseniorcenter.org/',
    tags: ['Meals', 'Classes', 'Social support'],
  },
  {
    id: 'imagine-housing',
    name: 'Imagine Housing Stability Services',
    category: 'Housing & Support',
    organization: 'Imagine Housing',
    description:
      'Affordable housing support, resident services, and stability programs for households working toward long-term security.',
    audience: 'Low-income individuals and families',
    address: '1301 100th Ave NE, Bellevue, WA 98004',
    hours: 'Mon-Fri 9 AM-5 PM',
    phone: '(425) 576-5190',
    email: 'info@imaginehousing.org',
    website: 'https://imaginehousing.org/',
    tags: ['Affordable housing', 'Resident support', 'Stability'],
  },
  {
    id: 'northshore-volunteer',
    name: 'Northshore Volunteer Match',
    category: 'Volunteer Opportunities',
    organization: 'Northshore Senior Center and Community Partners',
    description:
      'Helps residents find service projects, food drives, tutoring roles, event help, and ongoing volunteer placements.',
    audience: 'Teens, adults, service clubs, families',
    address: '10201 E Riverside Dr, Bothell, WA 98011',
    hours: 'Mon-Fri 9 AM-4 PM',
    phone: '(425) 286-1025',
    email: 'volunteer@northshorecommunity.org',
    website: 'https://www.volunteer.wa.gov/',
    tags: ['Service hours', 'Civic engagement', 'Mentoring'],
  },
  {
    id: 'wa-211',
    name: 'Washington 2-1-1 Resource Referral',
    category: 'Housing & Support',
    organization: '211 King County',
    description:
      'A broad referral service that connects callers with housing, legal, utility, food, and counseling support across the region.',
    audience: 'Residents seeking quick referrals',
    address: 'Phone and web-based support',
    hours: '24/7 online, phone support available daily',
    phone: '211',
    email: 'help@wa211.org',
    website: 'https://wa211.org/',
    tags: ['Referrals', 'Housing', 'Legal support'],
  },
]

export const spotlightResources: SpotlightResource[] = [
  {
    resourceId: 'hopelink',
    label: 'Food security spotlight',
    highlight: 'Hopelink layers food assistance with emergency financial support, which makes it more practical than a one-time pantry listing.',
    impact: 'Families can address groceries, diapers, and urgent bills in one place.',
    callout: 'Why it matters: resource hubs are strongest when they connect needs, not just names.',
  },
  {
    resourceId: 'bothell-library',
    label: 'Digital access spotlight',
    highlight: 'The library is more than books. It supports internet access, job searching, tutoring, and self-guided learning.',
    impact: 'Students and adults can build skills without cost barriers.',
    callout: 'Why it matters: education resources often unlock every other category on the site.',
  },
  {
    resourceId: 'northshore-school-support',
    label: 'Family support spotlight',
    highlight: 'School-based support is often the first place families turn when they do not know which service they need.',
    impact: 'Trusted school channels make resource discovery faster and less intimidating.',
    callout: 'Why it matters: a community hub should meet people where they already are.',
  },
]

export const events: CommunityEvent[] = [
  {
    id: 'resource-fair',
    title: 'Community Resource Fair',
    date: 'May 10, 2026',
    time: '11:00 AM-2:00 PM',
    location: 'Bothell Landing Park',
    type: 'Information fair',
    description: 'Residents can meet nonprofit representatives, compare services, and get help using the resource hub on mobile devices.',
  },
  {
    id: 'career-clinic',
    title: 'Resume and Interview Clinic',
    date: 'May 18, 2026',
    time: '4:00 PM-6:00 PM',
    location: 'Bothell Library Learning Hub',
    type: 'Career support',
    description: 'A drop-in clinic for resumes, interview practice, and job board navigation led by volunteers and WorkSource staff.',
  },
  {
    id: 'summer-meals',
    title: 'Summer Meals and Essentials Drive',
    date: 'June 6, 2026',
    time: '10:00 AM-1:00 PM',
    location: 'Hopelink Bothell',
    type: 'Food access',
    description: 'Collecting pantry staples, hygiene kits, and family essentials ahead of the summer months when school-based meals pause.',
  },
  {
    id: 'wellness-day',
    title: 'Senior Wellness Day',
    date: 'June 20, 2026',
    time: '9:30 AM-12:30 PM',
    location: 'Northshore Senior Center',
    type: 'Health and wellness',
    description: 'A welcoming program with screenings, movement classes, and transportation guidance for older adults.',
  },
  {
    id: 'volunteer-night',
    title: 'Volunteer Match Night',
    date: 'July 9, 2026',
    time: '5:00 PM-7:00 PM',
    location: 'North Creek High School Commons',
    type: 'Volunteer opportunities',
    description: 'Students and adults can compare service roles, civic projects, and nonprofit volunteer pathways in one place.',
  },
  {
    id: 'family-tech',
    title: 'Family Tech Basics Workshop',
    date: 'July 23, 2026',
    time: '3:30 PM-5:00 PM',
    location: 'Bothell Library Learning Hub',
    type: 'Digital literacy',
    description: 'Hands-on help with email, school portals, web safety, and resource navigation for families who need a technology confidence boost.',
  },
]

export const designPillars: ResearchPoint[] = [
  {
    title: 'Research first',
    body: 'We prioritized real community needs: food access, health support, housing stability, youth programs, and transportation. The site structure reflects how residents actually search for help.',
  },
  {
    title: 'Fast navigation',
    body: 'The interface puts the directory, highlights, events, and submission flow in the main path so the most important tasks are never buried.',
  },
  {
    title: 'Accessible presentation',
    body: 'Liquid-glass visuals were kept, but contrast, spacing, readable typography, and clear labels were tightened so the design stays expressive without hurting usability.',
  },
  {
    title: 'Interview-ready details',
    body: 'Supporting pages explain content decisions, research methodology, and judging checkpoints so the team can speak clearly about both design practice and topic expertise.',
  },
]

export const researchTimeline: ResearchPoint[] = [
  {
    title: 'Identify community categories',
    body: 'We grouped support into categories residents would naturally search: education, health, housing, food, jobs, youth support, transit, and volunteering.',
  },
  {
    title: 'Gather public information',
    body: 'We collected publicly available names, hours, addresses, and service descriptions from local organizations and cross-checked them for clarity.',
  },
  {
    title: 'Design for discovery',
    body: 'The resource hub was built around search, filtering, and scannable cards so users can go from broad need to specific contact information quickly.',
  },
  {
    title: 'Add supporting content',
    body: 'Spotlights, program listings, research notes, and a submission form were added to make the site useful beyond the directory itself.',
  },
]

export const judgeStops: JudgeStop[] = [
  {
    title: 'Interactive directory',
    href: '/resources',
    note: 'Search and filter the resource hub by category or keyword.',
  },
  {
    title: 'Resource spotlights',
    href: '/#spotlights',
    note: 'Three featured organizations are highlighted with added context and impact.',
  },
  {
    title: 'Submission form',
    href: '/submit',
    note: 'Residents can recommend new resources for the hub.',
  },
  {
    title: 'Research and design',
    href: '/about',
    note: 'Explains the team process, structure decisions, and community-focus strategy.',
  },
  {
    title: 'Documentation',
    href: '/copyright',
    note: 'Includes copyright materials, work log access, and references.',
  },
]

export const footerReferences = [
  { label: 'Copyright and Sources', href: '/copyright' },
  { label: 'Judge Quick Guide', href: '/judges' },
  { label: 'Accessibility Settings', href: '/settings' },
]

export const homeFeatureCards = [
  {
    title: 'Find help quickly',
    description: 'Search and filter by need, not just by organization name.',
    icon: Sparkles,
  },
  {
    title: 'Spotlight trusted resources',
    description: 'Three featured listings show why each service matters in the community.',
    icon: Landmark,
  },
  {
    title: 'Keep the hub growing',
    description: 'Residents can recommend new organizations through a dedicated submission form.',
    icon: Leaf,
  },
]

export const categoryHighlights = [
  {
    title: 'Essential support',
    description: 'Food, housing, transportation, and urgent referral services help residents respond to immediate needs.',
    icon: Shield,
  },
  {
    title: 'Long-term opportunity',
    description: 'Education, careers, and wellness programs support growth beyond short-term relief.',
    icon: BookOpen,
  },
  {
    title: 'Belonging and service',
    description: 'Family programming and volunteer opportunities strengthen the social fabric of the community.',
    icon: CalendarHeart,
  },
]
