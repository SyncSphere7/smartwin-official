import crypto from 'crypto'
import axios from 'axios'

const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || ''
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || ''
const PESAPAL_API_URL = process.env.PESAPAL_API_URL || 'https://pay.pesapal.com/v3'

interface PaymentRequest {
  id: string
  currency: string
  amount: number
  description: string
  callback_url: string
  notification_id: string
  billing_address: {
    email_address: string
    phone_number?: string
    country_code?: string
    first_name?: string
    last_name?: string
  }
}

// Get OAuth token from Pesapal
export async function getPesapalToken(): Promise<string> {
  try {
    const response = await axios.post(`${PESAPAL_API_URL}/api/Auth/RequestToken`, {
      consumer_key: PESAPAL_CONSUMER_KEY,
      consumer_secret: PESAPAL_CONSUMER_SECRET
    })
    return response.data.token
  } catch (error) {
    console.error('Pesapal token error:', error)
    throw new Error('Failed to get Pesapal token')
  }
}

// Register IPN (webhook) with Pesapal
export async function registerIPN(token: string, url: string, notificationType = 'GET'): Promise<string> {
  try {
    const response = await axios.post(
      `${PESAPAL_API_URL}/api/URLSetup/RegisterIPN`,
      {
        url,
        ipn_notification_type: notificationType
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data.ipn_id
  } catch (error) {
    console.error('Pesapal IPN registration error:', error)
    throw new Error('Failed to register IPN')
  }
}

// Submit order to Pesapal
export async function submitOrder(token: string, paymentData: PaymentRequest) {
  try {
    const response = await axios.post(
      `${PESAPAL_API_URL}/api/Transactions/SubmitOrderRequest`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data // Contains order_tracking_id and redirect_url
  } catch (error) {
    console.error('Pesapal order submission error:', error)
    throw new Error('Failed to submit order')
  }
}

// Verify payment status
export async function getTransactionStatus(token: string, orderTrackingId: string) {
  try {
    const response = await axios.get(
      `${PESAPAL_API_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Pesapal status check error:', error)
    throw new Error('Failed to get transaction status')
  }
}

// Verify IPN signature (webhook validation)
export function verifyPesapalSignature(payload: any, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', PESAPAL_CONSUMER_SECRET)
  hmac.update(JSON.stringify(payload))
  const computedSignature = hmac.digest('hex')
  return computedSignature === signature
}
