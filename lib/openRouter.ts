import axios from 'axios'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ''

export async function openRouterChat(prompt: string, model = 'anthropic/claude-3.5-sonnet') {
  if (!OPENROUTER_KEY) {
    throw new Error('OPENROUTER_API_KEY not set in environment variables')
  }

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional sports betting analyst and assistant for Smart-Win. Provide helpful, accurate information about betting strategies, match analysis, and platform features. Keep responses concise and professional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500
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

    return {
      response: response.data.choices[0]?.message?.content || 'No response received',
      model: response.data.model
    }
  } catch (error: any) {
    console.error('OpenRouter error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.error?.message || 'Failed to get AI response')
  }
}

