import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a concise help assistant for CommunityConnect, a community platform for Bothell, WA.

The app includes the following features:
- Resource Directory: browse and search local community resources (food, health, housing, jobs, etc.)
- Events Calendar: view and filter upcoming community events; users can also create their own events
- Community Map: an interactive map showing nearby resources and points of interest
- Donations & Wishlist: donate items or money to local causes; view community wishlists
- AI-Moderated Resource Submission: submit new resources that are reviewed by AI before publishing
- Achievements & Profile: earn badges and track contributions through a personal profile
- Settings & Accessibility: customize display preferences, language, and accessibility options
- Social Directory: connect with other community members
- Community Groups: join or create groups around shared interests or neighborhoods
- Lost & Found: post and browse lost or found items in the community
- Event Creation: create and publish your own events for the community calendar

Answer the user's question about how to use CommunityConnect in 2-4 sentences. Be friendly, specific, and direct. If the question is unrelated to the app, politely redirect to app-related help.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body as { query: string }

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ answer: null })
    }

    const groqApiKey = process.env.GROQ_API_KEY

    if (groqApiKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: query },
          ],
          temperature: 0.4,
          max_tokens: 200,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const answer: string = data.choices[0]?.message?.content?.trim() ?? ''
        if (answer) {
          return NextResponse.json({ answer })
        }
      }
    }

    // Groq unavailable or key missing — return null answer gracefully
    return NextResponse.json({ answer: getFallbackAnswer(query), fallback: true })
  } catch (err) {
    console.error('help-search API error:', err)
    return NextResponse.json({ answer: getFallbackAnswer(''), fallback: true })
  }
}

function getFallbackAnswer(query: string) {
  const text = (query || '').toLowerCase()

  if (text.includes('event')) {
    return 'To create an event, sign in, go to Dashboard, then open Create Event. Add the title, date, time, location, and choose whether it is public or private.'
  }
  if (text.includes('favor')) {
    return 'To ask for or help with a favor, sign in and go to Dashboard > Favors. Use Ask a Favor to post a request, or open an existing favor to contact the poster.'
  }
  if (text.includes('resource')) {
    return 'Use Resources to browse support services. To add one, sign in and use Submit Resource so it can be reviewed and added to the directory.'
  }
  if (text.includes('group')) {
    return 'Groups are available from Dashboard > Groups after signing in. You can create a group, add member emails, and send an email to everyone in the group.'
  }
  if (text.includes('lost') || text.includes('found')) {
    return 'Lost and Found is in the dashboard. Sign in, open Lost & Found, then post the item details and optional contact information.'
  }

  return 'CommunityConnect helps you find resources, browse and create events, ask favors, manage groups, post lost and found items, and adjust accessibility settings.'
}
