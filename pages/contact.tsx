import Head from 'next/head'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Contact() {
  const [user, setUser] = useState<any>(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    })
  }, [])

  async function handleSubmit(e: any) {
    e.preventDefault()
    if (!user) return

    setSending(true)

    try {
      // Insert message into database
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user.id,
          subject,
          message,
          status: 'new'
        })

      if (error) throw error

      // Send email notification to admin
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'support@smartwinofficial.co.uk',
          subject: `Contact: ${subject}`,
          html: `<h3>New Contact Message</h3><p><strong>From:</strong> ${user.email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`
        })
      })

      alert('Message sent! We\'ll get back to you soon.')
      setSubject('')
      setMessage('')
    } catch (error: any) {
      alert('Failed to send message: ' + error.message)
    } finally {
      setSending(false)
    }
  }

  if (!user) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <Head>
        <title>Contact Team - Smart-Win</title>
      </Head>

      <div style={{ maxWidth: 600, margin: '60px auto' }}>
        <h1>Contact Our Team</h1>
        <p style={{ color: 'var(--gray-600)', fontSize: 18 }}>
          Have questions about upcoming matches or want to discuss exclusive opportunities? Send us a message.
        </p>

        <div className="card" style={{ padding: 32, marginTop: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Subject</label>
              <input 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                placeholder="What's this about?"
                style={{ width: '100%', padding: 12, border: '2px solid #eee', borderRadius: 8, fontSize: 16 }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Message</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="Tell us more..."
                style={{ width: '100%', padding: 12, border: '2px solid #eee', borderRadius: 8, fontSize: 16, fontFamily: 'inherit' }}
              />
            </div>

            <button 
              className="cta" 
              type="submit"
              disabled={sending}
              style={{ width: '100%', padding: 14, fontSize: 16 }}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/dashboard">
            <span style={{ color: 'var(--gray-600)', cursor: 'pointer' }}>← Back to dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
