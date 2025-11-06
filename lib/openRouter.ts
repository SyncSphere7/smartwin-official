import axios from 'axios'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ''

export async function openRouterChat(prompt: string, model = 'meta-llama/llama-3.2-3b-instruct:free') {
  if (!OPENROUTER_KEY) {
    throw new Error('OPENROUTER_API_KEY not set in environment variables')
  }

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Smart-Win'
      }
    }
  )

  return response.data
}
