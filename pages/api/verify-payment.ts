import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { getPesapalToken, getTransactionStatus } from '../../lib/pesapal'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { orderTrackingId, userId, paymentMethod, amount } = req.body

  // Handle manual verification (e.g., Bitcoin payments)
  if (!orderTrackingId && userId) {
    return handleManualVerification(req, res, userId, paymentMethod, amount);
  }

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

    // If payment is completed, create consultation request
    if (status.payment_status_description === 'Completed' && payment.status !== 'completed') {
      // Update payment status
      await supabaseAdmin
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id)

      // Get user details
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(payment.user_id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create consultation request
      await createConsultationRequest(payment.user_id, user.email!, payment.id, 'pesapal', payment.amount);

      return res.status(200).json({ status: 'completed', payment })
    }

    return res.status(200).json({ status: status.payment_status_description.toLowerCase(), payment })

  } catch (error: any) {
    console.error('Verify payment error:', error)
    return res.status(500).json({ error: error.message || 'Payment verification failed' })
  }
}

async function handleManualVerification(
  req: NextApiRequest, 
  res: NextApiResponse, 
  userId: string, 
  paymentMethod: string, 
  amount: number
) {
  try {
    // Get user details
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create consultation request
    const consultationId = await createConsultationRequest(userId, user.email!, null, paymentMethod, amount);

    return res.status(200).json({
      success: true,
      consultationId,
      message: 'Consultation request created successfully'
    });

  } catch (error: any) {
    console.error('Manual verification error:', error);
    return res.status(500).json({ error: error.message || 'Verification failed' });
  }
}

async function createConsultationRequest(
  userId: string,
  userEmail: string,
  paymentId: string | null,
  paymentMethod: string,
  amount: number
) {
  // Check if consultation request already exists
  const { data: existingRequest } = await supabaseAdmin
    .from('consultation_requests')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existingRequest) {
    console.log('Consultation request already exists');
    return existingRequest.id;
  }

  // Create consultation request
  const { data: consultationData, error: consultationError } = await supabaseAdmin
    .from('consultation_requests')
    .insert({
      user_id: userId,
      payment_id: paymentId,
      user_email: userEmail,
      payment_amount: amount,
      payment_method: paymentMethod,
      status: 'pending'
    })
    .select()
    .single();

  if (consultationError) {
    console.error('Consultation creation error:', consultationError);
    throw new Error('Failed to create consultation request');
  }

  // Send admin notification email
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `🎯 New Consultation Request - $${amount}`,
      html: getAdminNotificationEmail(userEmail, userId, amount, paymentMethod)
    });
  } catch (emailError) {
    console.error('Admin email error:', emailError);
  }

  // Send user confirmation email
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: userEmail,
      subject: '✅ Consultation Payment Confirmed - Smart-Win',
      html: getUserConfirmationEmail(amount)
    });
  } catch (emailError) {
    console.error('User email error:', emailError);
  }

  return consultationData.id;
}

function getAdminNotificationEmail(userEmail: string, userId: string, amount: number, paymentMethod: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-label { font-weight: 600; color: #6b7280; }
          .info-value { color: #111827; font-weight: 500; }
          .cta-button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">💰 New Consultation Payment</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <h3 style="margin-top: 0;">Client Details</h3>
              <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${userEmail}</span></div>
              <div class="info-row"><span class="info-label">User ID:</span><span class="info-value">${userId}</span></div>
              <div class="info-row"><span class="info-label">Amount:</span><span class="info-value">$${amount}</span></div>
              <div class="info-row" style="border:none;"><span class="info-label">Method:</span><span class="info-value">${paymentMethod}</span></div>
            </div>
            <div style="text-align:center;">
              <a href="mailto:${userEmail}?subject=Smart-Win Consultation" class="cta-button">Email Client</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getUserConfirmationEmail(amount: number) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .cta-button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 Payment Confirmed!</h1>
          </div>
          <div class="content">
            <p>Thank you for your $${amount} consultation payment.</p>
            <p>Our team will contact you within 24-48 hours via email to discuss your fixed match requirements.</p>
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>⚠️ Reminder:</strong> The $100 fee is non-refundable. Match prices negotiated separately.</p>
            </div>
            <div style="text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">View Dashboard</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
