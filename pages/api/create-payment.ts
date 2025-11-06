import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { getPesapalToken, submitOrder, registerIPN } from '../../lib/pesapal'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { user_id, email, amount, currency } = req.body

  if (!user_id || !email || !amount) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Get Pesapal token
    const token = await getPesapalToken()

    // Register IPN if not already registered
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment-callback`
    const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-webhook`
    
    let notificationId = process.env.PESAPAL_IPN_ID || ''
    if (!notificationId) {
      notificationId = await registerIPN(token, ipnUrl, 'GET')
    }

    // Create payment record in database
    const merchantReference = uuidv4()
    const { data: payment, error: dbError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id,
        amount,
        currency,
        status: 'pending',
        pesapal_merchant_reference: merchantReference
      })
      .select()
      .single()

    if (dbError) throw new Error('Failed to create payment record')

    // Submit order to Pesapal
    const orderData = {
      id: merchantReference,
      currency: currency || 'USD',
      amount: parseFloat(amount),
      description: 'Smart-Win Premium Dashboard Access',
      callback_url: callbackUrl,
      notification_id: notificationId,
      billing_address: {
        email_address: email,
        country_code: 'US',
        first_name: email.split('@')[0],
        last_name: 'User'
      }
    }

    const orderResponse = await submitOrder(token, orderData)

    // Update payment with tracking ID
    await supabaseAdmin
      .from('payments')
      .update({ pesapal_tracking_id: orderResponse.order_tracking_id })
      .eq('id', payment.id)

    return res.status(200).json({
      payment_id: payment.id,
      order_tracking_id: orderResponse.order_tracking_id,
      redirect_url: orderResponse.redirect_url
    })

  } catch (error: any) {
    console.error('Create payment error:', error)
    return res.status(500).json({ error: error.message || 'Payment initialization failed' })
  }
}
