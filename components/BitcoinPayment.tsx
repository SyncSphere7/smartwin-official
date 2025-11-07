import { useState } from 'react'

interface BitcoinPaymentProps {
  onPaymentComplete?: () => void
}

export default function BitcoinPayment({ onPaymentComplete }: BitcoinPaymentProps) {
  const [copied, setCopied] = useState(false)
  const bitcoinAddress = process.env.NEXT_PUBLIC_BITCOIN_ADDRESS || ''
  const trustWalletLink = `https://link.trustwallet.com/send?address=${bitcoinAddress}&asset=c0`

  const copyAddress = () => {
    navigator.clipboard.writeText(bitcoinAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      background: 'var(--brand-white)',
      borderRadius: 16,
      padding: 40,
      border: '1px solid var(--gray-200)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      maxWidth: 500,
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          fontSize: 48,
          marginBottom: 16
        }}>₿</div>
        <h2 style={{
          fontSize: 28,
          fontWeight: 800,
          margin: '0 0 8px 0',
          color: 'var(--gray-900)'
        }}>
          Pay with Bitcoin
        </h2>
        <p style={{
          color: 'var(--gray-600)',
          fontSize: 16,
          margin: 0
        }}>
          Send $100 USD worth of BTC to unlock premium access
        </p>
      </div>

      {/* QR Code */}
      <div style={{
        background: 'var(--gray-50)',
        padding: 24,
        borderRadius: 12,
        marginBottom: 24,
        textAlign: 'center'
      }}>
        <img 
          src="/Bitcoin wallet.jpeg"
          alt="Bitcoin QR Code"
          style={{
            width: '100%',
            maxWidth: 280,
            height: 'auto',
            borderRadius: 8,
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <p style={{
          fontSize: 13,
          color: 'var(--gray-600)',
          marginTop: 12,
          marginBottom: 0
        }}>
          Scan with your Bitcoin wallet
        </p>
      </div>

      {/* Bitcoin Address */}
      <div style={{
        background: 'var(--gray-50)',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16
      }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--gray-600)',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Bitcoin Address
        </div>
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>
          <code style={{
            flex: 1,
            fontSize: 13,
            color: 'var(--gray-900)',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            background: 'white',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--gray-200)'
          }}>
            {bitcoinAddress}
          </code>
          <button
            onClick={copyAddress}
            style={{
              padding: '8px 16px',
              background: copied ? '#10b981' : 'var(--gray-900)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Trust Wallet Button */}
      <a 
        href={trustWalletLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #3375BB 0%, #4A90E2 100%)',
          color: 'white',
          textAlign: 'center',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 700,
          textDecoration: 'none',
          marginBottom: 16,
          transition: 'transform 0.2s',
          boxShadow: '0 4px 12px rgba(51, 117, 187, 0.3)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        Open in Trust Wallet →
      </a>

      {/* Instructions */}
      <div style={{
        padding: 16,
        background: 'var(--gray-50)',
        borderRadius: 8,
        fontSize: 14,
        color: 'var(--gray-700)',
        lineHeight: 1.6
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--gray-900)' }}>
          📋 Instructions:
        </div>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li>Send $100 worth of BTC to the address above</li>
          <li>Screenshot your transaction confirmation</li>
          <li>Email it to support@smartwinofficial.co.uk</li>
          <li>Access will be activated within 1 hour</li>
        </ol>
      </div>

      {/* Security Note */}
      <div style={{
        marginTop: 16,
        padding: 12,
        background: 'rgba(255, 24, 26, 0.05)',
        borderRadius: 6,
        fontSize: 12,
        color: 'var(--gray-600)',
        textAlign: 'center'
      }}>
        🔒 Your transaction is secure and permanent on the Bitcoin blockchain
      </div>
    </div>
  )
}
