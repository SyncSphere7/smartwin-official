import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { getPesapalToken, getTransactionStatus } from '../../lib/pesapal'
import { sendEmail } from '../../lib/resend'
import { getPaymentConfirmationEmail } from '../../lib/emailTemplates'

// Pesapal IPN webhook handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Pesapal sends GET requests with query params for IPN
  const orderTrackingId = req.query.OrderTrackingId as string
  const orderNotificationType = req.query.OrderNotificationType as string

  if (!orderTrackingId) {
    console.error('Missing OrderTrackingId in webhook')
    return res.status(400).json({ error: 'Missing OrderTrackingId' })
  }

  console.log('Pesapal IPN received:', { orderTrackingId, orderNotificationType })

  try {
    // Get Pesapal token and verify transaction
    const token = await getPesapalToken()
    const status = await getTransactionStatus(token, orderTrackingId)

    console.log('Transaction status:', status)

    // Find payment record
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('pesapal_tracking_id', orderTrackingId)
      .single()

    if (!payment) {
      console.error('Payment record not found for tracking ID:', orderTrackingId)
      return res.status(404).json({ error: 'Payment not found' })
    }

    // Update payment status if completed
    if (status.payment_status_description === 'Completed' && payment.status !== 'completed') {
      console.log('Payment completed, updating user access')

      // Update payment status
      await supabaseAdmin
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id)

      // Grant user dashboard access
      const { data: user } = await supabaseAdmin
        .from('users')
        .update({ paid: true })
        .eq('id', payment.user_id)
        .select()
        .single()

      if (user) {
        console.log('User access granted:', user.email)

        // Send confirmation email
        const emailTemplate = getPaymentConfirmationEmail(user.full_name || user.email, user.locale || 'en')
        try {
          await sendEmail(user.email, emailTemplate.subject, emailTemplate.html)
          console.log('Confirmation email sent to:', user.email)
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
        }
      }
    }

    return res.status(200).json({ received: true, status: status.payment_status_description })

  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return res.status(500).json({ error: error.message || 'Webhook processing failed' })
  }
}
