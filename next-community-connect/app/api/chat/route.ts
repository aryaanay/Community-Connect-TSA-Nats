import { NextRequest, NextResponse } from 'next/server'
import { resources as curatedResources, events as curatedEvents } from '@/data/community-data'
import { staticEvents } from '@/lib/event-data'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type ChatHistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

type PageContext = {
  path?: string
  title?: string
  visibleText?: string
}

type LiveResource = {
  id: string
  name: string
  category: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  hours: string | null
  website_url: string | null
  is_verified: boolean | null
  is_featured: boolean | null
  created_at: string | null
}

type LiveEvent = {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  category: string | null
  created_at: string | null
}

type LiveCause = {
  cause_name: string
  current_amount: number | null
  supporter_count: number | null
  goal_amount: number | null
}

const SITE_FEATURES = [
  'Resource Directory (/resources): browse and search local community resources by category and keyword.',
  'Events (/events): view upcoming community events and public user-created events.',
  'Submit a Resource (/submit): recommend a new resource for the directory.',
  'Wishlist / Donate (/wishlist): donate to community causes with live fundraising totals.',
  'Community Map (/dashboard/map): interactive resource and event map.',
  'Lost & Found (/dashboard/lost-found): signed-in users can post lost or found items.',
  'Community Favors (/dashboard/favors): signed-in users can request or offer small favors.',
  'Groups (/dashboard/groups): signed-in users can manage community groups.',
  'Profile and Achievements (/dashboard/profile): track XP, badges, and activity.',
  'Settings (/dashboard/settings): accessibility, language, dark mode, and privacy controls.',
]

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], pageContext = null } = await request.json() as {
      message?: string
      history?: ChatHistoryMessage[]
      pageContext?: PageContext | null
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }

    const siteContext = await buildSiteContext(pageContext)

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return NextResponse.json({ message: getFallbackReply(message, siteContext), fallback: true })
    }

    const systemPrompt = `You are the AI assistant for Community Connect, a free neighborhood platform for the Bothell, WA area.

Use the CURRENT WEBSITE CONTEXT below as your source of truth for Community Connect features, resources, events, donation totals, and anything visible on the page. This context is rebuilt for each request from live Supabase data, curated site data, and the visitor's current page text.

Rules:
- For website, resource, event, donation, contact, or navigation questions, answer only from the current website context.
- If a requested resource, event, phone number, hour, or total is not in the context, say it is not listed in the current site data and suggest checking the Resources page or submitting an update.
- Prefer specific names, dates, hours, phone numbers, addresses, links, and totals when they are present.
- Do not invent local organizations, contact info, totals, or events.
- Keep answers concise, friendly, and useful. For how-to questions, give short steps.
- You may answer general non-site questions, but keep site facts grounded in the context.

CURRENT WEBSITE CONTEXT:
${siteContext}`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', error)
      return NextResponse.json({ message: getFallbackReply(message, siteContext), fallback: true })
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: aiMessage })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function buildSiteContext(pageContext: PageContext | null) {
  const [liveResources, liveEvents, liveCauses] = await Promise.all([
    fetchLiveResources(),
    fetchLiveEvents(),
    fetchLiveCauses(),
  ])

  const resourceLines = mergeResourceLines(liveResources)
  const eventLines = mergeEventLines(liveEvents)
  const causeLines = liveCauses.map((cause) => {
    const raised = typeof cause.current_amount === 'number' ? `$${cause.current_amount.toLocaleString()}` : 'not listed'
    const goal = typeof cause.goal_amount === 'number' ? `$${cause.goal_amount.toLocaleString()}` : 'not listed'
    const supporters = typeof cause.supporter_count === 'number' ? `${cause.supporter_count} supporters` : 'supporters not listed'
    return `- ${cause.cause_name}: ${raised} raised of ${goal}; ${supporters}.`
  })

  const pageText = pageContext?.visibleText
    ? `\nCURRENT PAGE SNAPSHOT (${pageContext.path || 'unknown path'}; ${pageContext.title || 'untitled'}):\n${pageContext.visibleText}`
    : ''

  return [
    `SITE FEATURES:\n${SITE_FEATURES.map(feature => `- ${feature}`).join('\n')}`,
    `\nLIVE AND CURATED RESOURCES:\n${resourceLines.join('\n') || '- No resources are currently listed.'}`,
    `\nLIVE AND CURATED EVENTS:\n${eventLines.join('\n') || '- No events are currently listed.'}`,
    `\nLIVE DONATION CAUSES:\n${causeLines.join('\n') || '- No donation causes are currently listed.'}`,
    pageText,
  ].join('\n')
}

async function fetchLiveResources(): Promise<LiveResource[]> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('id, name, category, description, address, phone, email, hours, website_url, is_verified, is_featured, created_at')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.warn('Chat live resources unavailable:', error)
      return []
    }

    return (data ?? []) as LiveResource[]
  } catch (error) {
    console.warn('Chat live resources failed:', error)
    return []
  }
}

async function fetchLiveEvents(): Promise<LiveEvent[]> {
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('id, title, description, date, time, location, category, created_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      console.warn('Chat live events unavailable:', error)
      return []
    }

    return (data ?? []) as LiveEvent[]
  } catch (error) {
    console.warn('Chat live events failed:', error)
    return []
  }
}

async function fetchLiveCauses(): Promise<LiveCause[]> {
  try {
    const { data, error } = await supabase
      .from('wishlist_causes')
      .select('cause_name, current_amount, supporter_count, goal_amount')
      .limit(20)

    if (error) {
      console.warn('Chat live causes unavailable:', error)
      return []
    }

    return (data ?? []) as LiveCause[]
  } catch (error) {
    console.warn('Chat live causes failed:', error)
    return []
  }
}

function mergeResourceLines(liveResources: LiveResource[]) {
  const seen = new Set<string>()
  const lines: string[] = []

  for (const resource of liveResources) {
    const key = resource.name.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    lines.push(formatResourceLine({
      name: resource.name,
      category: resource.category,
      description: resource.description ?? '',
      address: resource.address ?? '',
      phone: resource.phone ?? '',
      email: resource.email ?? '',
      hours: resource.hours ?? '',
      website: resource.website_url ?? '',
      source: 'live database',
    }))
  }

  for (const resource of curatedResources) {
    const key = resource.name.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    lines.push(formatResourceLine({
      name: resource.name,
      category: resource.category,
      description: resource.description,
      address: resource.address,
      phone: resource.phone,
      email: resource.email,
      hours: resource.hours,
      website: resource.website,
      source: 'curated site data',
    }))
  }

  return lines.slice(0, 70)
}

function formatResourceLine(resource: {
  name: string
  category: string
  description: string
  address: string
  phone: string
  email: string
  hours: string
  website: string
  source: string
}) {
  const parts = [
    resource.description,
    resource.address && `Address: ${resource.address}`,
    resource.phone && `Phone: ${resource.phone}`,
    resource.email && `Email: ${resource.email}`,
    resource.hours && `Hours: ${resource.hours}`,
    resource.website && `Website: ${resource.website}`,
    `Source: ${resource.source}`,
  ].filter(Boolean)

  return `- ${resource.name} (${resource.category}): ${parts.join('; ')}`
}

function mergeEventLines(liveEvents: LiveEvent[]) {
  const seen = new Set<string>()
  const lines: string[] = []

  for (const event of liveEvents) {
    const key = event.title.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    lines.push(formatEventLine({
      title: event.title,
      date: event.date,
      time: event.time ?? '',
      location: event.location ?? '',
      description: event.description ?? '',
      type: event.category ?? 'Community',
      source: 'live database',
    }))
  }

  for (const event of curatedEvents) {
    const key = event.title.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    lines.push(formatEventLine({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      type: event.type,
      source: 'curated site data',
    }))
  }

  for (const event of staticEvents) {
    const key = event.title.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    lines.push(formatEventLine({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: '',
      type: 'Community',
      source: 'events page fallback data',
    }))
  }

  return lines.slice(0, 60)
}

function formatEventLine(event: {
  title: string
  date: string
  time: string
  location: string
  description: string
  type: string
  source: string
}) {
  const parts = [
    event.date,
    event.time,
    event.location && `Location: ${event.location}`,
    event.description,
    `Source: ${event.source}`,
  ].filter(Boolean)

  return `- ${event.title} (${event.type}): ${parts.join('; ')}`
}

function getFallbackReply(message: string, siteContext: string) {
  const text = (message || '').toLowerCase()
  const lowerContext = siteContext.toLowerCase()

  const matchingLines = siteContext
    .split('\n')
    .filter(line => line.startsWith('- '))
    .filter(line => {
      const lower = line.toLowerCase()
      return text.split(/\W+/).some(word => word.length > 3 && lower.includes(word))
    })
    .slice(0, 3)

  if (matchingLines.length) {
    return `Here is what is listed in the current site data:\n${matchingLines.join('\n')}`
  }

  if (text.includes('event')) {
    return 'You can browse events from the Events page. To create one, sign in, open the dashboard, and choose Create Event.'
  }
  if (text.includes('favor') || text.includes('help')) {
    return 'For community favors, sign in and open Dashboard > Favors. You can post a request or offer to help with an open favor.'
  }
  if (text.includes('resource') || text.includes('food') || text.includes('housing') || text.includes('health')) {
    const hasResources = lowerContext.includes('live and curated resources:\n- ')
    return hasResources
      ? 'Use the Resources page to search the current directory by category or keyword. If a service is not listed in the current site data, use Submit Resource to recommend it.'
      : 'No resources are currently listed in the site data I can access. Try the Resources page or Submit Resource to recommend an update.'
  }
  if (text.includes('lost') || text.includes('found')) {
    return 'Lost and Found is available from the dashboard after signing in. You can post an item, add details, and include contact information.'
  }

  return 'I can help with resources, events, favors, lost and found, groups, donations, accessibility settings, and profiles. Try asking about one of those features.'
}
