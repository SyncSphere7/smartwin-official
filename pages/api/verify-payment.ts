import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { getPesapalToken, getTransactionStatus } from '../../lib/pesapal'
import { sendEmail } from '../../lib/resend'
import { getPaymentConfirmationEmail } from '../../lib/emailTemplates'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { orderTrackingId } = req.body

  if (!orderTrackingId) {
    return res.status(400).json({ error: 'Missing order tracking ID' })
  }

  try {
    // Get Pesapal token
    const token = await getPesapalToken()

    // Check transaction status
    const status = await getTransactionStatus(token, orderTrackingId)

    // Find payment record
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('pesapal_tracking_id', orderTrackingId)
      .single()

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    // If payment is completed, update user access
    if (status.payment_status_description === 'Completed' && payment.status !== 'completed') {
      // Update payment status
      await supabaseAdmin
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id)

      // Grant user access
      const { data: user } = await supabaseAdmin
        .from('users')
        .update({ paid: true })
        .eq('id', payment.user_id)
        .select()
        .single()

      if (user) {
        // Send confirmation email
        const emailTemplate = getPaymentConfirmationEmail(user.full_name || user.email, user.locale || 'en')
        try {
          await sendEmail(user.email, emailTemplate.subject, emailTemplate.html)
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
        }
      }

      return res.status(200).json({ status: 'completed', payment })
    }

    return res.status(200).json({ status: status.payment_status_description.toLowerCase(), payment })

  } catch (error: any) {
    console.error('Verify payment error:', error)
    return res.status(500).json({ error: error.message || 'Payment verification failed' })
  }
}
