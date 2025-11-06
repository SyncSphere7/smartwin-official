import axios from 'axios'

const RESEND_KEY = process.env.RESEND_API_KEY || ''
const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@smartwinofficial.co.uk'

export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_KEY) {
    throw new Error('RESEND_API_KEY not set in environment variables')
  }

  const response = await axios.post(
    'https://api.resend.com/emails',
    {
      from: FROM,
      to: to,
      subject: subject,
      html: html
    },
    {
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return response.data
}
