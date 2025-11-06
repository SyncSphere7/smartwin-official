import type { NextApiRequest, NextApiResponse } from 'next'
import { sendEmail } from '../../lib/resend'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  
  const { to, subject, html } = req.body

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' })
  }

  try {
    const result = await sendEmail(to, subject, html)
    return res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    console.error('Send email error:', error)
    return res.status(500).json({ error: error.message || 'Failed to send email' })
  }
}
