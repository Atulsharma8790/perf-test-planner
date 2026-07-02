import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { verifyPasscode, unauthorizedResponse } from '@/lib/auth'
import { buildPrompt } from '@/lib/prompts'
import type { PerfInput } from '@/lib/types'

const client = new Anthropic()

export async function POST(req: Request) {
  if (!verifyPasscode(req)) return unauthorizedResponse()
  const input: PerfInput = await req.json()
  if (!input.appName || !input.appDescription || !input.targetEndpoints) {
    return NextResponse.json({ error: 'App name, description, and endpoints are required' }, { status: 400 })
  }
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: buildPrompt(input) }],
  })
  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    // Extract k6 script from fenced code block first (before JSON parsing)
    const k6Match = text.match(/```(?:k6|javascript|js)?\n([\s\S]*?)```/)
    const k6Script = k6Match ? k6Match[1].trim() : ''

    // Extract JSON — take everything between the first { and the last } before the code fence
    const jsonPart = text.split('```')[0]
    const jsonMatch = jsonPart.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const parsed = JSON.parse(jsonMatch[0])
    parsed.k6Script = k6Script || parsed.k6Script || ''

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Parse error:', err, '\nRaw text:', text.slice(0, 500))
    return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 })
  }
}
