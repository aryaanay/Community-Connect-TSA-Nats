import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Build messages for Groq
    const systemPrompt = `You are a helpful community assistant for "Community Connect" - a local resource hub for Bothell, WA area. 
You help people find:
- Volunteer opportunities
- Food assistance and pantries
- Health and wellness resources
- Career and job help
- Community events
- Senior services
- Housing assistance

When relevant, mention these local resources:
- Northshore Volunteer Services: (425) 485-1112
- Hopelink Bothell: (425) 943-6700
- EvergreenHealth: (425) 899-5200
- WorkSource Seattle-King County: (206) 296-5051
- 211 King County: Dial 2-1-1
- Crisis Connections: (866) 427-4747

Be concise, friendly, and helpful.`

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
        max_tokens: 500
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