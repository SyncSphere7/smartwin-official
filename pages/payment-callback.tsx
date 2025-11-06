import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Fireworks from '../components/Fireworks'
import ConfettiEffect from '../components/ConfettiEffect'

export default function PaymentCallback() {
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking')
  const [showFireworks, setShowFireworks] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
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
          setTimeout(() => setShowConfetti(true), 1000)
          setTimeout(() => router.push('/dashboard'), 10000)
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
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', opacity: 0.12, pointerEvents: 'none' }}>
              <img src="/trophies 5.webp" alt="" style={{ width: 250, height: 250, objectFit: 'contain' }} />
            </div>
            <div className="card" style={{ padding: 48, position: 'relative', zIndex: 2 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-red) 0%, #ff4444 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--brand-white)', fontSize: 42, fontWeight: 700, boxShadow: '0 8px 24px rgba(255, 24, 26, 0.3)' }}>✓</div>
              <h2 style={{ fontSize: 32, marginBottom: 16 }}>Payment Successful!</h2>
              <p style={{ color: 'var(--gray-600)', fontSize: 18, marginBottom: 8 }}>Welcome to the winning team!</p>
              <p style={{ color: 'var(--gray-500)', fontSize: 15 }}>Your premium dashboard is now unlocked. Redirecting you...</p>
              <Link href="/dashboard">
                <button className="cta" style={{ marginTop: 32, fontSize: 17, padding: '18px 40px' }}>Go to Dashboard Now</button>
              </Link>
            </div>
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
      
      {/* Celebration Effects */}
      <Fireworks
        trigger={showFireworks}
        intensity="heavy"
        duration={10000}
        onComplete={() => setShowFireworks(false)}
      />
      <ConfettiEffect
        trigger={showConfetti}
        style="celebration"
        duration={5000}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  )
}
