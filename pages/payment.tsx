import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import BitcoinPayment from '../components/BitcoinPayment'

export default function Payment() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'select' | 'pesapal' | 'bitcoin'>('select')
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

  async function handlePesapalPayment() {
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

      <div style={{ maxWidth: 800, margin: '60px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>Unlock Premium Access</h1>
          <p style={{ fontSize: 18, color: 'var(--gray-600)' }}>
            Choose your preferred payment method
          </p>
        </div>

        {paymentMethod === 'select' && (
          <>
            {/* Features Card */}
            <div className="card" style={{ padding: 32, marginBottom: 32 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ color: 'var(--brand-red)', marginTop: 0, fontSize: 48, fontWeight: 800 }}>$100</h2>
                <p style={{ fontSize: 18, color: 'var(--gray-600)', margin: 0 }}>One-time payment • Lifetime access</p>
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: 32 }}>
                <h3 style={{ marginBottom: 16 }}>What you get:</h3>
                <ul style={{ color: 'var(--gray-700)', lineHeight: 2, fontSize: 16 }}>
                  <li>✓ Full dashboard access with verified match proofs</li>
                  <li>✓ Historical winning data & screenshots</li>
                  <li>✓ Direct team contact for match negotiations</li>
                  <li>✓ AI-powered match insights & analysis</li>
                  <li>✓ Lifetime access (no recurring fees)</li>
                  <li>✓ Priority customer support</li>
                </ul>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              {/* Pesapal Card */}
              <div 
                className="card"
                onClick={() => setPaymentMethod('pesapal')}
                style={{
                  padding: 32,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '2px solid var(--gray-200)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '2px solid var(--brand-red)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '2px solid var(--gray-200)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>Pesapal</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: 16 }}>
                  Credit/Debit Card, Mobile Money
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  background: 'var(--gray-100)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--gray-700)'
                }}>
                  Instant Access
                </div>
              </div>

              {/* Bitcoin Card */}
              <div 
                className="card"
                onClick={() => setPaymentMethod('bitcoin')}
                style={{
                  padding: 32,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '2px solid var(--gray-200)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '2px solid var(--brand-yellow)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '2px solid var(--gray-200)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>₿</div>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>Bitcoin</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: 16 }}>
                  Cryptocurrency Payment
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  background: 'rgba(255, 217, 0, 0.1)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#F7931A'
                }}>
                  Most Secure
                </div>
              </div>
            </div>
          </>
        )}

        {paymentMethod === 'pesapal' && (
          <div>
            <button
              onClick={() => setPaymentMethod('select')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gray-600)',
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              ← Back to payment methods
            </button>

            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>Pay with Pesapal</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 32 }}>
                Secure payment via credit card, debit card, or mobile money
              </p>
              
              <button 
                className="cta" 
                onClick={handlePesapalPayment}
                disabled={loading}
                style={{ width: '100%', padding: 16, fontSize: 16, maxWidth: 400 }}
              >
                {loading ? 'Processing...' : 'Continue to Pesapal →'}
              </button>

              <p style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 16 }}>
                🔒 Your dashboard will be unlocked instantly upon successful payment
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'bitcoin' && (
          <div>
            <button
              onClick={() => setPaymentMethod('select')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gray-600)',
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              ← Back to payment methods
            </button>

            <BitcoinPayment />
          </div>
        )}
      </div>
    </div>
  )
}
