import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ConfettiEffect from '../components/ConfettiEffect'

export default function Dashboard(){
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])
  const [stats, setStats] = useState({ totalWins: 0, totalPayout: 0, successRate: 0 })
  const [loading, setLoading] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [chatResponse, setChatResponse] = useState('')
  const [chatting, setChatting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const router = useRouter()

  useEffect(()=>{
    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if(!authUser){ 
        router.push('/login')
        return 
      }
      
      setUser(authUser)

      // Get user profile from database
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUserProfile(profile)
        
        // Check if user has paid
        if (!profile.paid) {
          router.push('/payment')
          return
        }
      } else {
        // Create user profile if doesn't exist
        await supabase.from('users').insert({
          id: authUser.id,
          email: authUser.email,
          paid: false
        })
        router.push('/payment')
        return
      }

      // Load tickets
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(8)

      if (ticketData) {
        setTickets(ticketData)
        
        // Calculate stats
        const totalWins = ticketData.filter(t => t.verified).length
        const totalPayout = ticketData.reduce((sum, t) => sum + (parseFloat(t.payout_amount) || 0), 0)
        const successRate = ticketData.length > 0 ? (totalWins / ticketData.length * 100) : 0
        
        setStats({ totalWins, totalPayout, successRate })
      }

      setLoading(false)
    }

    loadUser()
  },[router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleChat(e: any) {
    e.preventDefault()
    if (!chatMessage.trim()) return

    setChatting(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', prompt: chatMessage })
      })
      const data = await response.json()
      setChatResponse(data.choices?.[0]?.message?.content || 'No response from AI')
    } catch (error) {
      setChatResponse('Error connecting to AI. Please try again.')
    }
    setChatting(false)
  }

  if(loading) return <div className="container">Loading your dashboard...</div>

  if(!userProfile?.paid) return null

  return (
    <div className="container">
      <Head><title>Dashboard - Smart-Win</title></Head>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0' }}>Welcome back, {userProfile.full_name || user.email}</p>
        </div>
        <button className="ghost-cta" onClick={handleLogout}>Logout</button>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 24, borderLeft: '3px solid var(--brand-red)' }}>
          <p style={{ color: 'var(--gray-600)', margin: '0 0 8px 0', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Wins</p>
          <h3 style={{ color: 'var(--gray-900)', margin: 0, fontSize: 36 }}>{stats.totalWins}</h3>
        </div>
        <div className="card" style={{ padding: 24, borderLeft: '3px solid var(--brand-red)' }}>
          <p style={{ color: 'var(--gray-600)', margin: '0 0 8px 0', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Payout</p>
          <h3 style={{ color: 'var(--gray-900)', margin: 0, fontSize: 36 }}>${stats.totalPayout.toFixed(0)}</h3>
        </div>
        <div className="card" style={{ padding: 24, borderLeft: '3px solid var(--brand-red)' }}>
          <p style={{ color: 'var(--gray-600)', margin: '0 0 8px 0', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate</p>
          <h3 style={{ color: 'var(--gray-900)', margin: 0, fontSize: 36 }}>{stats.successRate.toFixed(0)}%</h3>
        </div>
      </div>

      {/* AI Chat Widget */}
      <div className="card" style={{ marginBottom: 32, padding: 24, background: 'var(--gray-900)', color: 'var(--brand-white)', border: '1px solid var(--gray-800)' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'var(--brand-white)' }}>AI Assistant</h3>
        <form onSubmit={handleChat} style={{ display: 'flex', gap: 12 }}>
          <input 
            value={chatMessage}
            onChange={e => setChatMessage(e.target.value)}
            placeholder="Ask me anything about matches, strategies, or your account..."
            style={{ flex: 1, padding: 12, border: '1px solid var(--gray-700)', borderRadius: 4, fontSize: 15, background: 'var(--gray-800)', color: 'var(--brand-white)' }}
          />
          <button className="cta" type="submit" disabled={chatting}>
            {chatting ? 'Processing...' : 'Ask'}
          </button>
        </form>
        {chatResponse && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--gray-800)', borderRadius: 4, border: '1px solid var(--gray-700)' }}>
            <p style={{ margin: 0, color: 'var(--brand-white)', lineHeight: 1.6 }}>{chatResponse}</p>
          </div>
        )}
      </div>

      {/* Latest Verified Proofs */}
      <section style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -50, right: 0, opacity: 0.08, pointerEvents: 'none' }}>
          <img src="/celebrations 1.webp" alt="" className="dashboard-decoration" style={{ width: 200, height: 200, objectFit: 'contain' }} />
        </div>
        <h3>Latest Verified Match Proofs</h3>
        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src="/trophy 5.webp" alt="" style={{ width: 150, height: 150, objectFit: 'contain', opacity: 0.3 }} />
            </div>
            <p style={{ color: 'var(--gray-600)', fontSize: 18, marginTop: 24 }}>No tickets available yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {tickets.map((ticket, i) => (
              <div
                key={ticket.id || i}
                className="card"
                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => ticket.verified && setShowCelebration(true)}
              >
                {ticket.thumbnail_url ? (
                  <img src={ticket.thumbnail_url} alt="Ticket proof" style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                ) : (
                  <div className="ticket-preview" style={{ height: 150 }}>Proof {i + 1}</div>
                )}
                <div style={{ padding: 12 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{ticket.match_description || 'Match details'}</p>
                  {ticket.verified && (
                    <span style={{ fontSize: 12, color: 'var(--brand-red)', fontWeight: 600 }}>✓ Verified</span>
                  )}
                  {ticket.payout_amount && (
                    <p style={{ margin: '4px 0 0 0', fontSize: 14, color: 'var(--gray-700)', fontWeight: 600 }}>
                      ${ticket.payout_amount}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Team */}
      <div className="card" style={{ marginTop: 32, padding: 24 }}>
        <h3 style={{ marginTop: 0 }}>Ready to Negotiate?</h3>
        <p style={{ color: 'var(--gray-600)' }}>Contact our team to discuss upcoming matches and exclusive opportunities.</p>
        <Link href="/contact">
          <button className="cta">Contact Team</button>
        </Link>
      </div>

      {/* Celebration Confetti */}
      <ConfettiEffect
        trigger={showCelebration}
        style="standard"
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  )
}
