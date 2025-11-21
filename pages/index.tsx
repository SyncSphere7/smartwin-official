import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import Logo from '../components/Logo'

export default function Home() {
  const { t } = useTranslation()
  const [activeMembers, setActiveMembers] = useState(0)
  const [totalPayouts, setTotalPayouts] = useState(0)
  const [successRate, setSuccessRate] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const animateCounter = (target: number, setter: (val: number) => void, duration: number) => {
      let start = 0
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(start))
        }
      }, 16)
    }

    setTimeout(() => animateCounter(500, setActiveMembers, 2000), 300)
    setTimeout(() => animateCounter(2000000, setTotalPayouts, 2500), 500)
    setTimeout(() => animateCounter(92, setSuccessRate, 1800), 700)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <Head>
        <title>{t('siteTitle')} - Professional Match Consultancy</title>
        <meta name="description" content="Professional match consultancy with verified winning proofs. $100 consultation fee to access expert team and negotiate fixed match details." />
        <link rel="icon" href="/Smart_win_logo-transparent.png" />
      </Head>

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
          <div className="logo-wrap">
            <Logo />
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{t('siteTitle')}</h2>
          </div>
          <nav>
            <Link href="/login">
              <button className="ghost-cta">{t('login')}</button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 80 }}>
            <div style={{ flex: 1, maxWidth: 650 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--brand-black)',
                color: 'var(--brand-yellow)',
                padding: '10px 20px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: 32,
                border: '2px solid var(--brand-red)'
              }}>
                <span style={{ fontSize: 18 }}>⚡</span>
                AI-Powered Intelligence
              </div>

              <h1 style={{
                margin: '0 0 32px 0',
                fontSize: 82,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                fontWeight: 900
              }}>
                Professional<br/>
                <span style={{
                  background: 'linear-gradient(135deg, var(--brand-red) 0%, var(--brand-black) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Match Analysis
                </span>
              </h1>

              <p style={{
                color: 'var(--gray-600)',
                fontSize: 22,
                margin: '0 0 48px 0',
                lineHeight: 1.6,
                fontWeight: 400
              }}>
                Access verified winning proofs and expert consultation. $100 gets you direct contact with our professional team. Serious inquiries only.
              </p>

              <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 48 }}>
                <Link href="/login">
                  <button className="cta" style={{ fontSize: 18, padding: '22px 56px' }}>
                    Start Consultation — $100
                  </button>
                </Link>
                <div style={{ color: 'var(--gray-500)', fontSize: 15, fontWeight: 500 }}>
                  24/7 Support Available
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 32,
                paddingTop: 32,
                borderTop: '2px solid var(--gray-200)'
              }}>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--brand-black)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                    {activeMembers}+
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Members
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--brand-black)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                    {successRate}%
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Success Rate
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--brand-black)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                    24/7
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    AI Support
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              position: 'relative',
              width: 500,
              height: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(255, 24, 26, 0.1) 0%, transparent 70%)',
                filter: 'blur(60px)',
                animation: 'pulse 4s ease-in-out infinite'
              }}></div>
              <img
                src="/lionel-messi-argentina-celebrates-scoring-782686143.webp"
                alt="Champion Celebration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.3))',
                  position: 'relative',
                  zIndex: 2
                }}
              />
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--gray-50)', padding: '120px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 80, maxWidth: 700, margin: '0 auto 80px' }}>
              <h2 style={{
                margin: '0 0 24px 0',
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--brand-black)'
              }}>
                How It Works
              </h2>
              <p style={{
                color: 'var(--gray-600)',
                fontSize: 20,
                margin: 0,
                lineHeight: 1.6
              }}>
                Three simple steps to access verified match intelligence
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--brand-black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: 36,
                  fontWeight: 800,
                  color: 'var(--brand-yellow)',
                  border: '4px solid var(--brand-red)',
                  boxShadow: '0 8px 32px rgba(255, 24, 26, 0.2)'
                }}>
                  1
                </div>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--brand-black)'
                }}>
                  Pay $100 Fee
                </h3>
                <p style={{
                  color: 'var(--gray-600)',
                  margin: 0,
                  lineHeight: 1.7,
                  fontSize: 17
                }}>
                  Secure one-time consultation fee. Instant dashboard access upon payment confirmation.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--brand-black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: 36,
                  fontWeight: 800,
                  color: 'var(--brand-yellow)',
                  border: '4px solid var(--brand-red)',
                  boxShadow: '0 8px 32px rgba(255, 24, 26, 0.2)'
                }}>
                  2
                </div>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--brand-black)'
                }}>
                  View Verified Proofs
                </h3>
                <p style={{
                  color: 'var(--gray-600)',
                  margin: 0,
                  lineHeight: 1.7,
                  fontSize: 17
                }}>
                  Access AI-verified winning tickets and historical performance data in your dashboard.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--brand-black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: 36,
                  fontWeight: 800,
                  color: 'var(--brand-yellow)',
                  border: '4px solid var(--brand-red)',
                  boxShadow: '0 8px 32px rgba(255, 24, 26, 0.2)'
                }}>
                  3
                </div>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--brand-black)'
                }}>
                  Direct Team Contact
                </h3>
                <p style={{
                  color: 'var(--gray-600)',
                  margin: 0,
                  lineHeight: 1.7,
                  fontSize: 17
                }}>
                  Negotiate match details directly with our professional team via WhatsApp or Telegram.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '120px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{
                margin: '0 0 24px 0',
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--brand-black)'
              }}>
                Real Winning Tickets
              </h2>
              <p style={{
                color: 'var(--gray-600)',
                fontSize: 20,
                margin: 0,
                lineHeight: 1.6,
                maxWidth: 700,
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                Verified betting slips from our members. Every ticket is AI-authenticated and represents real payouts.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24
            }}>
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    paddingBottom: '140%',
                    background: 'var(--gray-100)',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={`/Ticket ${num}.jpeg`}
                      alt={`Winning Ticket ${num}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(16, 185, 129, 0.95)',
                      color: 'white',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      <span style={{ fontSize: 14 }}>✓</span> VERIFIED
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--brand-black)',
                      marginBottom: 6
                    }}>
                      Winning Ticket #{num}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: 'var(--gray-600)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <span style={{ color: 'var(--brand-yellow)', fontSize: 16 }}>★</span>
                      AI Authenticated
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              textAlign: 'center',
              marginTop: 56,
              padding: '32px',
              background: 'rgba(255, 217, 0, 0.08)',
              borderRadius: 12,
              border: '2px solid var(--brand-yellow)',
              maxWidth: 900,
              margin: '56px auto 0'
            }}>
              <p style={{
                margin: 0,
                fontSize: 17,
                color: 'var(--gray-900)',
                lineHeight: 1.7,
                fontWeight: 500
              }}>
                <strong style={{ color: 'var(--brand-black)', fontWeight: 700 }}>Pay $100 consultation fee</strong> to view complete verified proofs and negotiate match access with our team.
                <span style={{ color: 'var(--brand-red)', fontWeight: 700 }}> Non-refundable. Serious buyers only.</span>
              </p>
            </div>
          </div>
        </section>

        <section style={{
          background: 'var(--brand-black)',
          padding: '120px 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(255, 217, 0, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div className="container">
            <h2 style={{
              color: 'var(--brand-white)',
              marginBottom: 80,
              textAlign: 'center',
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: '-0.03em'
            }}>
              Trusted Worldwide
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 80, position: 'relative' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 80,
                  fontWeight: 900,
                  color: 'var(--brand-yellow)',
                  marginBottom: 16,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  textShadow: '0 0 40px rgba(255, 217, 0, 0.3)'
                }}>
                  {activeMembers}+
                </div>
                <p style={{
                  color: 'var(--gray-400)',
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  Active Members
                </p>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--gray-800)', borderRight: '1px solid var(--gray-800)' }}>
                <div style={{
                  fontSize: 80,
                  fontWeight: 900,
                  color: 'var(--brand-yellow)',
                  marginBottom: 16,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  textShadow: '0 0 40px rgba(255, 217, 0, 0.3)'
                }}>
                  ${(totalPayouts / 1000000).toFixed(1)}M+
                </div>
                <p style={{
                  color: 'var(--gray-400)',
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  Total Verified Payouts
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 80,
                  fontWeight: 900,
                  color: 'var(--brand-yellow)',
                  marginBottom: 16,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  textShadow: '0 0 40px rgba(255, 217, 0, 0.3)'
                }}>
                  {successRate}%
                </div>
                <p style={{
                  color: 'var(--gray-400)',
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  Success Rate
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{
          padding: '120px 0',
          background: 'var(--gray-50)'
        }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{
                margin: '0 0 24px 0',
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--brand-black)'
              }}>
                Why Smart-Win?
              </h2>
              <p style={{
                color: 'var(--gray-600)',
                fontSize: 20,
                margin: 0,
                lineHeight: 1.6
              }}>
                Industry-leading technology meets proven results
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
              <div className="card-dark" style={{ padding: 48, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: 'var(--brand-red)'
                }}></div>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--brand-red), var(--brand-yellow))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  fontSize: 32
                }}>
                  🤖
                </div>
                <h3 style={{
                  marginTop: 0,
                  marginBottom: 16,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--brand-white)'
                }}>
                  AI Verification
                </h3>
                <p style={{
                  color: 'var(--gray-400)',
                  margin: 0,
                  lineHeight: 1.8,
                  fontSize: 17
                }}>
                  Advanced machine learning algorithms verify every ticket for authenticity before publication.
                </p>
              </div>

              <div className="card-dark" style={{ padding: 48, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: 'var(--brand-yellow)'
                }}></div>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--brand-yellow), var(--brand-red))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  fontSize: 32
                }}>
                  ⚡
                </div>
                <h3 style={{
                  marginTop: 0,
                  marginBottom: 16,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--brand-white)'
                }}>
                  Instant Access
                </h3>
                <p style={{
                  color: 'var(--gray-400)',
                  margin: 0,
                  lineHeight: 1.8,
                  fontSize: 17
                }}>
                  Secure payment processing with immediate dashboard access. No waiting, no delays.
                </p>
              </div>

              <div className="card-dark" style={{ padding: 48, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: 'var(--brand-red)'
                }}></div>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--brand-red), var(--brand-yellow))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  fontSize: 32
                }}>
                  🌍
                </div>
                <h3 style={{
                  marginTop: 0,
                  marginBottom: 16,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--brand-white)'
                }}>
                  Global Platform
                </h3>
                <p style={{
                  color: 'var(--gray-400)',
                  margin: 0,
                  lineHeight: 1.8,
                  fontSize: 17
                }}>
                  Multi-language support with localized interfaces for seamless international access.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{
          padding: '120px 0',
        }}>
          <div className="container">
            <div style={{
              textAlign: 'center',
              padding: '80px 60px',
              background: 'linear-gradient(135deg, var(--brand-red), var(--brand-black))',
              borderRadius: 20,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: -100,
                left: -100,
                width: 300,
                height: 300,
                background: 'radial-gradient(circle, rgba(255, 217, 0, 0.2) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}></div>

              <h2 style={{
                marginBottom: 24,
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--brand-white)',
                position: 'relative'
              }}>
                Ready to Start?
              </h2>
              <p style={{
                color: 'var(--gray-300)',
                fontSize: 22,
                margin: '0 0 48px 0',
                maxWidth: 700,
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.6,
                position: 'relative'
              }}>
                Pay $100 consultation fee to access our team and negotiate match details. Non-refundable.
              </p>
              <Link href="/login">
                <button
                  style={{
                    background: 'var(--brand-yellow)',
                    color: 'var(--brand-black)',
                    padding: '24px 64px',
                    fontSize: 20,
                    fontWeight: 800,
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(255, 217, 0, 0.4)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 217, 0, 0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 217, 0, 0.4)'
                  }}
                >
                  Start Consultation Now
                </button>
              </Link>
              <p style={{
                fontSize: 15,
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: 32,
                fontWeight: 500,
                position: 'relative'
              }}>
                Instant access • 24/7 support • Verified proofs
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{
        background: 'var(--brand-black)',
        color: 'var(--gray-400)',
        padding: '64px 0 40px 0',
        borderTop: '1px solid var(--gray-800)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
              <Logo />
              <h3 style={{ margin: 0, color: 'var(--brand-white)', fontSize: 28, fontWeight: 800 }}>Smart-Win</h3>
            </div>
            <p style={{ margin: 0, fontSize: 16, color: 'var(--gray-500)' }}>
              Premium Match Intelligence Platform
            </p>
          </div>
          <div style={{
            textAlign: 'center',
            paddingTop: 32,
            borderTop: '1px solid var(--gray-800)',
            fontSize: 14
          }}>
            © 2025 Smart-Win. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
