import type { NextApiRequest, NextApiResponse } from 'next'
import { openRouterChat } from '../../lib/openRouter'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  
  const { action, prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  try {
    if (action === 'chat' || !action) {
      // Default model: Claude 3.5 Sonnet (best quality)
      // Alternatives: 'google/gemini-pro-1.5', 'openai/gpt-4o', 'anthropic/claude-3-opus'
      const response = await openRouterChat(prompt, 'anthropic/claude-3.5-sonnet')
      return res.status(200).json(response)
    }
    
    if (action === 'summarize') {
      const enhancedPrompt = `You are a sports betting analyst. Summarize this ticket information concisely and verify its authenticity markers: ${prompt}`
      const response = await openRouterChat(enhancedPrompt, 'anthropic/claude-3.5-sonnet')
      return res.status(200).json(response)
    }
    
    return res.status(400).json({ error: 'Invalid action. Use "chat" or "summarize"' })
  } catch (error: any) {
    console.error('OpenRouter API error:', error)
    return res.status(500).json({ error: error.message || 'AI service error' })
  }
}
