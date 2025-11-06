import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Admin(){
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'users' | 'tickets' | 'payments'>('users')
  
  // Upload form
  const [uploading, setUploading] = useState(false)
  const [matchDescription, setMatchDescription] = useState('')
  const [payoutAmount, setPayoutAmount] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const router = useRouter()

  useEffect(()=>{
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        alert('Unauthorized access')
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      loadData()
    }

    checkAdmin()
  },[router])

  async function loadData() {
    // Load users
    const { data: usersData } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (usersData) setUsers(usersData)

    // Load tickets
    const { data: ticketsData } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
    if (ticketsData) setTickets(ticketsData)

    // Load payments
    const { data: paymentsData } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
    if (paymentsData) setPayments(paymentsData)

    setLoading(false)
  }

  async function handleTicketUpload(e: any) {
    e.preventDefault()
    if (!file) return

    setUploading(true)

    try {
      // Upload image to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tickets')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tickets')
        .getPublicUrl(fileName)

      // Get AI summary
      let aiSummary = ''
      try {
        const aiResponse = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'summarize', 
            prompt: `Match: ${matchDescription}, Expected Payout: $${payoutAmount}` 
          })
        })
        const aiData = await aiResponse.json()
        aiSummary = aiData.choices?.[0]?.message?.content || ''
      } catch (err) {
        console.error('AI summary failed:', err)
      }

      // Insert ticket record
      const { error: insertError } = await supabase
        .from('tickets')
        .insert({
          image_url: publicUrl,
          thumbnail_url: publicUrl,
          match_description: matchDescription,
          payout_amount: parseFloat(payoutAmount),
          verified: true,
          ai_summary: aiSummary,
          visibility: 'public'
        })

      if (insertError) throw insertError

      alert('Ticket uploaded successfully!')
      setMatchDescription('')
      setPayoutAmount('')
      setFile(null)
      loadData()

    } catch (error: any) {
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function toggleUserPaidStatus(userId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('users')
      .update({ paid: !currentStatus })
      .eq('id', userId)

    if (error) {
      alert('Failed to update user')
    } else {
      loadData()
    }
  }

  if(loading) return <div className="container">Loading admin panel...</div>
  if(!isAdmin) return null

  return (
    <div className="container">
      <Head><title>Admin Panel - Smart-Win</title></Head>
      
      <h2>Admin Panel</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, borderBottom: '2px solid #eee' }}>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'users' ? '3px solid var(--brand-red)' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'users' ? 'bold' : 'normal'
          }}
        >
          Users ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('tickets')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'tickets' ? '3px solid var(--brand-red)' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'tickets' ? 'bold' : 'normal'
          }}
        >
          Tickets ({tickets.length})
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'payments' ? '3px solid var(--brand-red)' : 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'payments' ? 'bold' : 'normal'
          }}
        >
          Payments ({payments.length})
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h3>User Management</h3>
          <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--gray-50)', borderBottom: '2px solid var(--gray-200)' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: 'var(--gray-700)' }}>Email</th>
                  <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: 'var(--gray-700)' }}>Name</th>
                  <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: 'var(--gray-700)' }}>Paid</th>
                  <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: 'var(--gray-700)' }}>Role</th>
                  <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: 'var(--gray-700)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: 12, color: 'var(--gray-900)' }}>{user.email}</td>
                    <td style={{ padding: 12, color: 'var(--gray-900)' }}>{user.full_name || '-'}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: 4, 
                        background: user.paid ? 'var(--brand-red)' : 'var(--gray-200)',
                        color: user.paid ? 'var(--brand-white)' : 'var(--gray-700)',
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {user.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>{user.role || 'user'}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <button 
                        onClick={() => toggleUserPaidStatus(user.id, user.paid)}
                        className="ghost-cta"
                        style={{ fontSize: 12, padding: '6px 12px' }}
                      >
                        Toggle Paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div>
          <h3>Upload New Ticket</h3>
          <div className="card" style={{ padding: 24, marginBottom: 32 }}>
            <form onSubmit={handleTicketUpload}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Match Description</label>
                <input 
                  value={matchDescription}
                  onChange={e => setMatchDescription(e.target.value)}
                  required
                  placeholder="e.g., Man Utd vs Chelsea, Over 2.5 Goals"
                  style={{ width: '100%', padding: 12, border: '2px solid #eee', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Payout Amount ($)</label>
                <input 
                  type="number"
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  required
                  placeholder="5000"
                  style={{ width: '100%', padding: 12, border: '2px solid #eee', borderRadius: 8 }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Ticket Image</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <button 
                className="cta" 
                type="submit"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Ticket'}
              </button>
            </form>
          </div>

          <h3>All Tickets</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {tickets.map(ticket => (
              <div key={ticket.id} className="card" style={{ padding: 12 }}>
                {ticket.thumbnail_url && (
                  <img src={ticket.thumbnail_url} alt="Ticket" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                )}
                <p style={{ margin: '8px 0 4px 0', fontSize: 14, fontWeight: 600 }}>{ticket.match_description}</p>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--brand-red)', fontWeight: 600 }}>${ticket.payout_amount}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--gray-600)' }}>
                  {ticket.verified ? 'Verified' : 'Unverified'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div>
          <h3>Payment Records</h3>
          <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--gray-50)', borderBottom: '2px solid var(--gray-200)' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: 'var(--gray-700)' }}>Date</th>
                  <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: 'var(--gray-700)' }}>Amount</th>
                  <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: 'var(--gray-700)' }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: 'var(--gray-700)' }}>Tracking ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: 12, color: 'var(--gray-900)' }}>{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: 12, color: 'var(--gray-900)' }}>${payment.amount} {payment.currency}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: 4, 
                        background: payment.status === 'completed' ? 'var(--brand-red)' : 'var(--gray-200)',
                        color: payment.status === 'completed' ? 'var(--brand-white)' : 'var(--gray-700)',
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {payment.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 12, fontFamily: 'monospace' }}>
                      {payment.pesapal_tracking_id || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
