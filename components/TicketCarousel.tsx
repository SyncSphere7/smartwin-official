import React from 'react'

// Placeholder carousel showing ticket previews. Replace with actual Supabase Storage thumbnails.
export default function TicketCarousel(){
  const tickets = [
    { id: 127, amount: '$5,200' },
    { id: 126, amount: '$3,800' },
    { id: 125, amount: '$4,150' },
    { id: 124, amount: '$6,900' }
  ]
  
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      {tickets.map(ticket => (
        <div key={ticket.id} className="card ticket-preview">
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>
            Verified Win #{ticket.id}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-red)' }}>
            {ticket.amount}
          </div>
        </div>
      ))}
    </div>
  )
}
