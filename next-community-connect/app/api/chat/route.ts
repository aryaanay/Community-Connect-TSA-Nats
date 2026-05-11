import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return NextResponse.json({ message: getFallbackReply(message), fallback: true })
    }

    // Build messages for Groq
    const systemPrompt = `You are the AI assistant for Community Connect — a free neighborhood platform for the Bothell, WA area, built by students for TSA Nationals 2026. You can help with anything on the website or any general question.

WEBSITE FEATURES:
- Community Resources (/resources): Browse verified local resources by category — food, health, jobs, housing, volunteering, senior services, education, mental health, and more.
- Events (/events): Free upcoming community events — cleanups, workshops, STEM mentorship, health fairs, and more. Users can also create and publish their own events.
- Lost & Found (/dashboard/lost-found): Post lost or found items in the community with AI-assisted moderation.
- Community Favors (/dashboard/favors): Request or offer small favors — rides, grocery runs, pet care, tech help, etc.
- Wishlist / Donate (/wishlist): Donate to community causes including Food Bank, Youth Arts, Housing Assistance, Health Clinic, Environment, and Senior Care (simulated demo).
- Community Map (/dashboard/map): Interactive map of local resources filterable by category.
- Groups (/dashboard/groups): Join community groups by interest area.
- Social (/dashboard/social): Community social feed and activity.
- Dashboard (/dashboard): Personalized hub with quick actions, featured resources, upcoming events, and time-of-day theming.
- Achievements: Earn XP and unlock achievement cards by using platform features. View them on your profile.
- Profile (/dashboard/profile): View your level, XP, achievements, badges, and activity stats.
- Settings (/dashboard/settings): Accessibility options (20+ features), language switching (English, Spanish, French, Chinese, Vietnamese, Tagalog, Korean, Arabic, Hindi, Portuguese), dark mode, privacy controls.
- Submit a Resource (/submit): Add a new local resource for the community to discover.
- Create Event (/dashboard/create-event): Publish a public community event.
- Help Center (/dashboard/help): FAQs and guides for using the platform.
- References (/dashboard/references): Image citations, data sources, and team work log.

LOCAL RESOURCES (Bothell, WA area):
- Northshore Volunteer Services: (425) 485-1112
- Hopelink Bothell (food + housing): (425) 943-6700
- EvergreenHealth: (425) 899-5200
- WorkSource Seattle-King County (jobs): (206) 296-5051
- 211 King County (all services): Dial 2-1-1
- Crisis Connections (mental health): (866) 427-4747
- Northshore Schools Food Pantry: northshoresd.org
- YWCA Seattle (housing + DV): (206) 461-4888

NAVIGATION TIPS:
- Sign in required for: Lost & Found posting, Favors, Events creation, Profile, Settings
- The platform works without an account for browsing Resources, Events, Map, and the main page
- Language can be changed in Settings — all major UI text updates instantly
- Achievements are earned automatically by exploring the site (visiting pages, donating, RSVPing, etc.)
- Dark mode is in Settings and also toggleable in the dashboard

Be concise, direct, and friendly. For how-to questions give step-by-step instructions. For resource questions include contact info. You can also help with general questions unrelated to the site.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6), // Last 3 conversations
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
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      )
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

function getFallbackReply(message: string) {
  const text = (message || '').toLowerCase()

  if (text.includes('event')) {
    return 'You can browse events from the Events page. To create one, sign in, open the dashboard, and choose Create Event.'
  }
  if (text.includes('favor') || text.includes('help')) {
    return 'For community favors, sign in and open Dashboard > Favors. You can post a request or offer to help with an open favor.'
  }
  if (text.includes('resource') || text.includes('food') || text.includes('housing') || text.includes('health')) {
    return 'Use the Resources page to search local support by category. You can also submit a new resource from Submit Resource once signed in.'
  }
  if (text.includes('lost') || text.includes('found')) {
    return 'Lost and Found is available from the dashboard after signing in. You can post an item, add details, and include contact information.'
  }

  return 'I can help with resources, events, favors, lost and found, groups, donations, accessibility settings, and profiles. Try asking about one of those features.'
}
