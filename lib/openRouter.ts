import axios from 'axios'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ''
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://smartwinofficial.co.uk'

export async function openRouterChat(prompt: string, model = 'meta-llama/llama-3.1-8b-instruct:free') {
  if (!OPENROUTER_KEY) {
    throw new Error('OPENROUTER_API_KEY not set in environment variables')
  }

  console.log('OpenRouter request:', { 
    model, 
    promptLength: prompt.length, 
    hasApiKey: !!OPENROUTER_KEY,
    apiKeyPrefix: OPENROUTER_KEY.substring(0, 10) + '...',
    siteUrl: SITE_URL
  })

  try {
    const requestData = {
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }

    console.log('Request data:', requestData)

    const response = await axios.post(
      OPENROUTER_URL,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': 'Smart-Win',
          'Content-Type': 'application/json'
        },
        timeout: 30000
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

