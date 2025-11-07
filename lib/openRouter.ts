import axios from 'axios'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ''

export async function openRouterChat(prompt: string, model = 'meta-llama/llama-3.1-8b-instruct:free') {
  if (!OPENROUTER_KEY) {
    throw new Error('OPENROUTER_API_KEY not set in environment variables')
  }

  console.log('OpenRouter request:', { model, promptLength: prompt.length })

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
        },
        timeout: 30000 // 30 second timeout
      }
    )

    console.log('OpenRouter raw response:', {
      status: response.status,
      hasChoices: !!response.data.choices,
      choicesLength: response.data.choices?.length,
      firstChoice: response.data.choices?.[0]
    })

    const content = response.data.choices[0]?.message?.content
    
    if (!content) {
      console.error('No content in response:', response.data)
      throw new Error('No response content received from AI')
    }

    return {
      response: content,
      model: response.data.model
    }
  } catch (error: any) {
    console.error('OpenRouter error details:', {
      message: error.message,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      isTimeout: error.code === 'ECONNABORTED'
    })
    
    if (error.response?.data?.error) {
      throw new Error(`OpenRouter API: ${error.response.data.error.message || error.response.data.error}`)
    }
    
    throw new Error(error.message || 'Failed to get AI response')
  }
}

