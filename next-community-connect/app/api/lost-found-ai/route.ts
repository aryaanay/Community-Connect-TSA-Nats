import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body as { action: string }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      if (action === 'generate_description') {
        const { title, type, location } = body as { title?: string; type?: string; location?: string }
        return NextResponse.json({
          description: buildFallbackDescription(title, type, location),
          fallback: true,
        })
      }
      if (action === 'approve_image') {
        return NextResponse.json({ approved: true, fallback: true })
      }
      return NextResponse.json({ result: null, fallback: true })
    }

    if (action === 'generate_description') {
      const { title, type, location } = body as { title: string; type: string; location?: string }

      const prompt = `Write a concise 1-2 sentence description for a ${type} item listing on a community board. Item: "${title}"${location ? `, last seen/found at ${location}` : ''}. Focus on details that help identify or locate it. Return only the description, no intro text.`

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6,
          max_tokens: 100,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const description: string = data.choices[0]?.message?.content?.trim() ?? ''
        return NextResponse.json({ description })
      }
    }

    if (action === 'approve_image') {
      const { imageBase64, mimeType } = body as { imageBase64: string; mimeType: string }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: "You are reviewing a photo submitted to a community lost & found board. Approve if the image shows an object, item, pet, or place relevant to a lost/found listing. Reject if it shows inappropriate content, explicit material, or unrelated content. Reply with exactly one word: APPROVED or REJECTED.",
                },
                {
                  type: 'image_url',
                  image_url: { url: `data:${mimeType};base64,${imageBase64}` },
                },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 10,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const result: string = data.choices[0]?.message?.content?.trim() ?? ''
        const approved = result.toUpperCase().includes('APPROVED')
        return NextResponse.json({ approved })
      }

      // Vision model unavailable — reject by default for safety
      return NextResponse.json({ approved: false, reason: 'Image moderation temporarily unavailable. Please try again later.' })
    }

    return NextResponse.json({ result: null })
  } catch (err) {
    console.error('lost-found-ai API error:', err)
    return NextResponse.json({ result: null, error: 'Server error' })
  }
}

function buildFallbackDescription(title?: string, type?: string, location?: string) {
  const item = title?.trim() || 'Item'
  const kind = type === 'found' ? 'found' : 'lost'
  const place = location?.trim() ? ` near ${location.trim()}` : ''
  return `${item} was reported ${kind}${place}. Please contact the poster if you have information that can help identify or return it.`
}
