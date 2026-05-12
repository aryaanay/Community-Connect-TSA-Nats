import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, description, email, address } = body

    const groqApiKey = process.env.GROQ_API_KEY

    if (groqApiKey) {
      const prompt = `You are a community resource directory moderator for Bothell, WA.
Review this submitted community resource and decide if it should be approved.

Resource Name: ${name}
Category: ${category}
Description: ${description}
Contact Email: ${email}
Address: ${address || 'Not provided'}

Approve if it provides genuine community value (food, health, education, jobs, housing, mental health, youth, seniors, etc.) and the description is informative.
Reject if it appears to be spam, commercial advertising, inappropriate content, or too vague to be useful.

Respond with ONLY valid JSON in this exact format: {"approved": true, "reason": "brief 1-2 sentence explanation"}`

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 150,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const text: string = data.choices[0]?.message?.content ?? ''
        const match = text.match(/\{[\s\S]*\}/)
        if (match) {
          try {
            const result = JSON.parse(match[0])
            if (typeof result.approved === 'boolean' && typeof result.reason === 'string') {
              return NextResponse.json(result)
            }
          } catch {
            // fall through to rule-based
          }
        }
      }
    }

    // Fallback: rule-based review
    const issues: string[] = []
    if (!name || name.trim().length < 3) issues.push('resource name is too short')
    if (!description || description.trim().length < 20) issues.push('description needs more detail')
    if (!email || !email.includes('@')) issues.push('a valid contact email is required')

    if (issues.length > 0) {
      return NextResponse.json({
        approved: false,
        reason: `This submission could not be approved: ${issues.join(', ')}. Please revise and resubmit.`,
      })
    }

    return NextResponse.json({
      approved: true,
      reason: 'This resource meets our community guidelines and has been added to the directory.',
    })
  } catch (err) {
    console.error('Review API error:', err)
    // Don't approve by default on error - require manual review
    return NextResponse.json({
      approved: false,
      reason: 'Unable to complete AI review. Your submission has been saved and will be reviewed manually.',
    })
  }
}
