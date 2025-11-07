import Head from 'next/head'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)
  const router = useRouter()

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    
    router.push('/dashboard')
  }

  async function handleSignup(e: any) {
    e.preventDefault()
    setLoading(true)

    // Sign up user with email confirmation required
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: `${window.location.origin}/payment`
      }
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create user profile
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        paid: false
      })

      // Show email confirmation message
      setCheckEmail(true)
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <Head>
        <title>{mode === 'login' ? 'Login' : 'Sign Up'} - Smart-Win</title>
      </Head>

      <div style={{ maxWidth: 420, margin: '60px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p style={{ color: 'var(--gray-600)' }}>
            {mode === 'login' ? 'Sign in to access your dashboard' : 'Join Smart-Win and unlock consultation access'}
          </p>
        </div>

        {checkEmail ? (
          // Email verification message
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              fontSize: 40
            }}>
              📧
            </div>
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>Check Your Email!</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              We've sent a confirmation link to <strong>{email}</strong>
            </p>
            <div style={{ 
              background: '#f0fdf4', 
              border: '1px solid #86efac', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 24,
              textAlign: 'left'
            }}>
              <p style={{ margin: 0, color: '#166534', fontSize: 14, lineHeight: 1.6 }}>
                <strong>Next steps:</strong><br/>
                1. Check your email inbox<br/>
                2. Click the confirmation link<br/>
                3. You'll be redirected to the payment page<br/>
                4. Complete your $100 consultation payment
              </p>
            </div>
            <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setCheckEmail(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--brand-red)', 
                  textDecoration: 'underline', 
                  cursor: 'pointer' 
                }}
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: 32 }}>
            <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
              {mode === 'signup' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Full Name</label>
                  <input 
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    style={{ width: '100%', padding: 12, border: '2px solid #eee', borderRadius: 8, fontSize: 16 }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: 12, border: '2px solid #eee', borderRadius: 8, fontSize: 16 }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: 12, border: '2px solid #eee', borderRadius: 8, fontSize: 16 }}
                />
              </div>

              <button 
                className="cta" 
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: 14, fontSize: 16 }}
              >
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                style={{ background: 'none', border: 'none', color: 'var(--brand-red)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/">
            <span style={{ color: 'var(--gray-600)', cursor: 'pointer' }}>← Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
