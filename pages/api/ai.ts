import type { NextApiRequest, NextApiResponse } from 'next'
import { openRouterChat } from '../../lib/openRouter'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  
  const { action, prompt } = req.body

  console.log('AI API called with:', { action, promptLength: prompt?.length })

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  // Check if API key is set
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY is not set')
    return res.status(500).json({ error: 'OpenRouter API key not configured' })
  }

  try {
    if (action === 'chat' || !action) {
      // Using Meta Llama 3.1 8B (FREE on OpenRouter)
      console.log('Calling OpenRouter with Llama 3.1 8B...')
      const response = await openRouterChat(prompt, 'meta-llama/llama-3.1-8b-instruct:free')
      console.log('OpenRouter response received:', { hasResponse: !!response.response, model: response.model })
      return res.status(200).json(response)
    }
    
    if (action === 'summarize') {
      const enhancedPrompt = `You are a sports betting analyst. Summarize this ticket information concisely and verify its authenticity markers: ${prompt}`
      const response = await openRouterChat(enhancedPrompt, 'meta-llama/llama-3.1-8b-instruct:free')
      return res.status(200).json(response)
    }
    
    return res.status(400).json({ error: 'Invalid action. Use "chat" or "summarize"' })
  } catch (error: any) {
    console.error('OpenRouter API error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    return res.status(500).json({ error: error.message || 'AI service error' })
  }
}
