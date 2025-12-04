import type { AIConfig } from '../../types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  error?: {
    message: string
  }
}

export async function callOpenRouter(
  messages: ChatMessage[],
  config: AIConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('OpenRouter API key not configured')
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Cold Email Sequencer',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error?.message || `API request failed: ${response.status}`
    )
  }

  const data: OpenRouterResponse = await response.json()

  if (data.error) {
    throw new Error(data.error.message)
  }

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from OpenRouter')
  }

  return data.choices[0].message.content
}

export async function callOpenRouterJSON<T>(
  messages: ChatMessage[],
  config: AIConfig
): Promise<T> {
  const content = await callOpenRouter(messages, config)

  // Extract JSON from the response (handle markdown code blocks)
  let jsonStr = content
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim()
  }

  try {
    return JSON.parse(jsonStr) as T
  } catch {
    throw new Error('Failed to parse JSON response from AI')
  }
}
