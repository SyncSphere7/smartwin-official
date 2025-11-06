import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Fireworks from '../components/Fireworks'

export default function PaymentCallback() {
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking')
  const [showFireworks, setShowFireworks] = useState(false)
  const router = useRouter()
  const { OrderTrackingId } = router.query

  useEffect(() => {
    if (!OrderTrackingId) return

    // Verify payment status
    fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderTrackingId: OrderTrackingId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'completed') {
          setStatus('success')
          setShowFireworks(true)
          setTimeout(() => router.push('/dashboard'), 3000)
        } else {
          setStatus('failed')
        }
      })
      .catch(() => setStatus('failed'))
  }, [OrderTrackingId])

  return (
    <div className="container">
      <Head>
        <title>Payment Status - Smart-Win</title>
      </Head>

      <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
        {status === 'checking' && (
          <div className="card" style={{ padding: 48 }}>
            <h2>Verifying your payment...</h2>
            <p style={{ color: 'var(--gray-600)' }}>Please wait while we confirm your transaction.</p>
            <div style={{ margin: '24px 0' }}>
              <div className="spinner"></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="card" style={{ padding: 48 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--brand-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--brand-white)', fontSize: 32, fontWeight: 700 }}>✓</div>
            <h2>Payment Successful</h2>
            <p style={{ color: 'var(--gray-600)' }}>Your dashboard has been unlocked. Redirecting you now...</p>
            <Link href="/dashboard">
              <button className="cta" style={{ marginTop: 24 }}>Go to Dashboard</button>
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="card" style={{ padding: 48 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--gray-600)', fontSize: 32, fontWeight: 700 }}>✗</div>
            <h2>Payment Failed</h2>
            <p style={{ color: 'var(--gray-600)' }}>
              We couldn't verify your payment. Please contact support if you've been charged.
            </p>
            <Link href="/payment">
              <button className="cta" style={{ marginTop: 24 }}>Try Again</button>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--brand-red);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Fireworks on Success */}
      <Fireworks trigger={showFireworks} onComplete={() => setShowFireworks(false)} />
    </div>
  )
}
