import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

export default function Payment() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    })
  }, [])

  async function handlePayment() {
    if (!user) return
    setLoading(true)

    try {
      // Create payment record and get Pesapal checkout URL
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          amount: 100,
          currency: 'USD'
        })
      })

      const data = await response.json()

      if (data.redirect_url) {
        // Redirect to Pesapal payment page
        window.location.href = data.redirect_url
      } else {
        alert('Payment initialization failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <Head>
        <title>Complete Payment - Smart-Win</title>
      </Head>

      <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
        <h1>Unlock Premium Access</h1>
        <div className="card" style={{ padding: 32, marginTop: 24 }}>
          <h2 style={{ color: 'var(--brand-red)', marginTop: 0 }}>$100</h2>
          <p style={{ fontSize: 18, color: 'var(--muted)' }}>One-time payment</p>
          
          <div style={{ textAlign: 'left', margin: '24px 0' }}>
            <h3>What you get:</h3>
            <ul style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
              <li>Full dashboard access</li>
              <li>Verified match proofs & screenshots</li>
              <li>Historical winning data</li>
              <li>Direct team contact for negotiations</li>
              <li>AI-powered match insights</li>
              <li>Lifetime access (no recurring fees)</li>
            </ul>
          </div>

          <button 
            className="cta" 
            onClick={handlePayment}
            disabled={loading}
            style={{ width: '100%', padding: 16, fontSize: 16 }}
          >
            {loading ? 'Processing...' : 'Pay with Pesapal'}
          </button>

          <p style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 16 }}>
            Secure payment powered by Pesapal. Your dashboard will be unlocked instantly upon successful payment.
          </p>
        </div>
      </div>
    </div>
  )
}
