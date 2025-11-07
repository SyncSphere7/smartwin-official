import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import Logo from '../components/Logo'
import TicketCarousel from '../components/TicketCarousel'
import Fireworks from '../components/Fireworks'
import ConfettiEffect from '../components/ConfettiEffect'

export default function Home() {
  const { t } = useTranslation()
  const [activeMembers, setActiveMembers] = useState(0)
  const [totalPayouts, setTotalPayouts] = useState(0)
  const [successRate, setSuccessRate] = useState(0)
  const [aiMessage, setAiMessage] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiWidget, setShowAiWidget] = useState(true)
  const [showFireworks, setShowFireworks] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showWelcomeFireworks, setShowWelcomeFireworks] = useState(true)

  useEffect(() => {
    // Animated counter effect
    const animateCounter = (target: number, setter: (val: number) => void, duration: number, prefix = '') => {
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
  }, [])

  const handleAiQuery = async () => {
    if (!aiMessage.trim()) return
    
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiMessage })
      })
      const data = await res.json()
      setAiResponse(data.response || 'Sorry, I could not process that request.')
    } catch (error) {
      setAiResponse('Error connecting to AI. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }
  
  return (
    <div>
      <Head>
        <title>{t('siteTitle')} - Verified Fixed Match Proofs</title>
        <meta name="description" content="AI-verified match proofs and premium dashboard access" />
        <link rel="icon" href="/Smart_win_logo-transparent.png" />
      </Head>

      <header className="header">
        <div style={{ 
          width: '100%',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 40px'
        }}>
          <div className="logo-wrap">
            <Logo />
            <h2>{t('siteTitle')}</h2>
          </div>
          <nav style={{ marginLeft: 'auto' }}>
            <Link href="/login">
              <button className="ghost-cta">{t('login')}</button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container">
        {/* Hero Section */}
        <section className="hero">
          <div style={{ flex: 1, maxWidth: 600 }}>
            <div style={{ 
              display: 'inline-block',
              background: 'var(--gray-900)', 
              color: 'var(--brand-white)',
              padding: '8px 16px', 
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 24
            }}>
              AI-Powered Intelligence
            </div>
            <h1 style={{ 
              margin: '0 0 28px 0',
              fontSize: 64,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              fontWeight: 800
            }}>
              Premium Match<br/>
              <span style={{ color: 'var(--brand-red)' }}>Intelligence</span> Access
            </h1>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: 20, 
              margin: '0 0 40px 0', 
              lineHeight: 1.7,
              fontWeight: 400
            }}>
              Join an exclusive community with verified winning data, AI-powered analysis, and direct team consultation. Professional-grade intelligence for serious players.
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Link href="/login">
                <button 
                  className="cta" 
                  style={{ fontSize: 17, padding: '20px 44px' }}
                  onClick={() => setShowFireworks(true)}
                >
                  Get Lifetime Access — $100
                </button>
              </Link>
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 32, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>{activeMembers}+</div>
                <div style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 500 }}>Active Members</div>
              </div>
              <div style={{ width: 1, height: 40, background: 'var(--gray-200)' }}></div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>{successRate}%</div>
                <div style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 500 }}>Success Rate</div>
              </div>
              <div style={{ width: 1, height: 40, background: 'var(--gray-200)' }}></div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>24/7</div>
                <div style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 500 }}>AI Support</div>
              </div>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-glow"></div>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src="/lionel-messi-argentina-celebrates-scoring-782686143.webp"
                alt="Messi Celebration"
                className="hero-player-image"
                style={{ 
                  animation: 'fadeInOut 20s ease-in-out infinite',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: 0
                }}
              />
              <img
                src="/cristiano 1.webp"
                alt="Cristiano Ronaldo"
                className="hero-player-image"
                style={{ 
                  animation: 'fadeInOut 20s ease-in-out infinite 5s',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: 0
                }}
              />
              <img
                src="/0_Bukayo-Saka.webp"
                alt="Bukayo Saka"
                className="hero-player-image"
                style={{ 
                  animation: 'fadeInOut 20s ease-in-out infinite 10s',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: 0
                }}
              />
              <img
                src="/Harland 1.jpg"
                alt="Erling Haaland"
                className="hero-player-image"
                style={{ 
                  animation: 'fadeInOut 20s ease-in-out infinite 15s',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: 0
                }}
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ marginTop: 120, marginBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 72, maxWidth: 800, margin: '0 auto 72px auto' }}>
            <h2 style={{ 
              margin: '0 0 20px 0',
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}>
              Why Smart-Win?
            </h2>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: 20, 
              margin: 0,
              lineHeight: 1.7
            }}>
              Industry-leading technology meets proven track record
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <div className="card" style={{ padding: 40, position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: 4,
                height: '100%',
                background: 'var(--brand-red)'
              }}></div>
              <div style={{ 
                width: 56,
                height: 56,
                borderRadius: 12,
                background: 'var(--gray-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                fontSize: 24
              }}>
                🤖
              </div>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: 16,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.01em'
              }}>
                AI Verification System
              </h3>
              <p style={{ 
                color: 'var(--gray-600)', 
                margin: 0, 
                lineHeight: 1.8,
                fontSize: 16
              }}>
                Advanced machine learning algorithms verify every ticket for authenticity and accuracy before publication
              </p>
            </div>
            <div className="card" style={{ padding: 40, position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: 4,
                height: '100%',
                background: 'var(--brand-yellow)'
              }}></div>
              <div style={{ 
                width: 56,
                height: 56,
                borderRadius: 12,
                background: 'var(--gray-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                fontSize: 24
              }}>
                ⚡
              </div>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: 16,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.01em'
              }}>
                Instant Activation
              </h3>
              <p style={{ 
                color: 'var(--gray-600)', 
                margin: 0, 
                lineHeight: 1.8,
                fontSize: 16
              }}>
                Secure payment processing with immediate dashboard access. No waiting, no delays
              </p>
            </div>
            <div className="card" style={{ padding: 40, position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: 4,
                height: '100%',
                background: 'var(--brand-red)'
              }}></div>
              <div style={{ 
                width: 56,
                height: 56,
                borderRadius: 12,
                background: 'var(--gray-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                fontSize: 24
              }}>
                🌍
              </div>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: 16,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.01em'
              }}>
                Global Platform
              </h3>
              <p style={{ 
                color: 'var(--gray-600)', 
                margin: 0, 
                lineHeight: 1.8,
                fontSize: 16
              }}>
                Multi-language support with localized interfaces for seamless international accessibility
              </p>
            </div>
          </div>
        </section>

        {/* Video & Success Stories */}
        <section style={{ marginTop: 120, marginBottom: 120 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <h2 style={{ 
                margin: '0 0 24px 0',
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                Witness The Winning Moments
              </h2>
              <p style={{ 
                color: 'var(--gray-600)', 
                fontSize: 18, 
                margin: '0 0 32px 0',
                lineHeight: 1.7
              }}>
                Every day, our members celebrate victories. From modest wins to life-changing payouts, the data doesn't lie.
              </p>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ 
                  padding: 24,
                  background: 'var(--gray-50)',
                  borderRadius: 12,
                  borderLeft: '4px solid var(--brand-red)'
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundImage: 'url(/liverpool.jpeg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      border: '2px solid var(--brand-red)'
                    }}></div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--gray-900)' }}>Marcus T.</div>
                      <div style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 8 }}>London, UK</div>
                      <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--gray-700)' }}>
                        "Turned $100 into consistent wins. The AI verification gives me confidence every match."
                      </div>
                      <div style={{ marginTop: 8, color: 'var(--brand-yellow)', fontSize: 14 }}>★★★★★</div>
                    </div>
                  </div>
                </div>
                <div style={{ 
                  padding: 24,
                  background: 'var(--gray-50)',
                  borderRadius: 12,
                  borderLeft: '4px solid var(--brand-yellow)'
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundImage: 'url(/chelsea trophy.webp)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      border: '2px solid var(--brand-yellow)'
                    }}></div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--gray-900)' }}>Sarah K.</div>
                      <div style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 8 }}>Toronto, Canada</div>
                      <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--gray-700)' }}>
                        "Best investment I've made. Access to verified data changed everything for me."
                      </div>
                      <div style={{ marginTop: 8, color: 'var(--brand-yellow)', fontSize: 14 }}>★★★★★</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'relative',
                paddingBottom: '56.25%',
                borderRadius: 16,
                overflow: 'hidden',
                background: 'var(--gray-900)',
                boxShadow: 'var(--shadow-xl)'
              }}>
                <iframe 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  src="https://www.youtube.com/embed/jh0y0FVboPg?autoplay=1&mute=1&loop=1&playlist=jh0y0FVboPg&controls=0&showinfo=0&rel=0"
                  title="Football Celebration Moments"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div style={{
                marginTop: 16,
                textAlign: 'center',
                fontSize: 13,
                color: 'var(--gray-500)',
                fontStyle: 'italic'
              }}>
                Every win tells a story
              </div>
            </div>
          </div>
        </section>

        {/* Proof of Winning Tickets */}
        <section style={{ marginTop: 120, marginBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ 
              margin: '0 0 20px 0',
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--gray-900)'
            }}>
              Real Winning Tickets, Real Results
            </h2>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: 20, 
              margin: 0,
              lineHeight: 1.7,
              maxWidth: 700,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              These are actual verified betting slips from our members. Every ticket is AI-authenticated and represents real payouts.
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
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ 
                  position: 'relative',
                  paddingBottom: '133%',
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
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <span>✓</span> VERIFIED
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ 
                    fontSize: 14, 
                    fontWeight: 700, 
                    color: 'var(--gray-900)',
                    marginBottom: 4
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
                    <span style={{ color: 'var(--brand-yellow)' }}>★</span>
                    Authenticated by AI
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: 48,
            padding: '24px',
            background: 'var(--gray-50)',
            borderRadius: 12,
            border: '1px solid var(--gray-200)'
          }}>
            <p style={{ 
              margin: 0,
              fontSize: 15,
              color: 'var(--gray-700)',
              lineHeight: 1.6
            }}>
              <strong style={{ color: 'var(--gray-900)' }}>Join today</strong> and get access to verified winning slips updated daily. 
              <span style={{ color: 'var(--brand-red)', fontWeight: 600 }}> Limited spots available.</span>
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ 
          marginTop: 120, 
          marginBottom: 120,
          padding: '80px 72px', 
          background: 'var(--gray-900)', 
          borderRadius: 16, 
          color: 'var(--brand-white)',
          border: '1px solid var(--gray-800)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(255,24,26,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>
          <h2 style={{ 
            color: 'var(--brand-white)', 
            marginBottom: 64, 
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}>
            Trusted by Professionals Worldwide
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 64, position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: 72, 
                fontWeight: 800, 
                color: 'var(--brand-white)', 
                marginBottom: 12, 
                letterSpacing: '-0.04em',
                lineHeight: 1
              }}>
                {activeMembers}+
              </div>
              <p style={{ 
                color: 'var(--gray-400)', 
                margin: 0, 
                fontSize: 17,
                fontWeight: 500
              }}>
                Active Members
              </p>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--gray-800)', borderRight: '1px solid var(--gray-800)' }}>
              <div style={{ 
                fontSize: 72, 
                fontWeight: 800, 
                color: 'var(--brand-white)', 
                marginBottom: 12, 
                letterSpacing: '-0.04em',
                lineHeight: 1
              }}>
                ${(totalPayouts / 1000000).toFixed(1)}M+
              </div>
              <p style={{ 
                color: 'var(--gray-400)', 
                margin: 0, 
                fontSize: 17,
                fontWeight: 500
              }}>
                Total Verified Payouts
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: 72, 
                fontWeight: 800, 
                color: 'var(--brand-white)', 
                marginBottom: 12, 
                letterSpacing: '-0.04em',
                lineHeight: 1
              }}>
                {successRate}%
              </div>
              <p style={{ 
                color: 'var(--gray-400)', 
                margin: 0, 
                fontSize: 17,
                fontWeight: 500
              }}>
                Success Rate
              </p>
            </div>
          </div>
        </section>

        {/* Celebration Gallery */}
        <section style={{ marginTop: 120, marginBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ 
              margin: '0 0 16px 0',
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--gray-900)'
            }}>
              Champions Trust Smart-Win
            </h2>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: 18, 
              margin: 0,
              lineHeight: 1.7
            }}>
              Join the winning teams and celebrate success with verified data
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 24 
          }}>
            <div 
              className="card"
              style={{ 
                padding: 0,
                overflow: 'hidden',
                aspectRatio: '16/9',
                position: 'relative'
              }}
            >
              <img 
                src="/celebrations 1.webp"
                alt="Team Celebration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '32px 20px 20px',
                color: 'white'
              }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Victory Moments</div>
              </div>
            </div>

            <div 
              className="card"
              style={{ 
                padding: 0,
                overflow: 'hidden',
                aspectRatio: '16/9',
                position: 'relative'
              }}
            >
              <img 
                src="/trophy.jpeg"
                alt="Trophy Celebration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '32px 20px 20px',
                color: 'white'
              }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Championship Glory</div>
              </div>
            </div>

            <div 
              className="card"
              style={{ 
                padding: 0,
                overflow: 'hidden',
                aspectRatio: '16/9',
                position: 'relative'
              }}
            >
              <img 
                src="/trophy 5.webp"
                alt="Winners Trophy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '32px 20px 20px',
                color: 'white'
              }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Winning Legacy</div>
              </div>
            </div>

            <div 
              className="card"
              style={{ 
                padding: 0,
                overflow: 'hidden',
                aspectRatio: '16/9',
                position: 'relative'
              }}
            >
              <img 
                src="/trophies 5.webp"
                alt="Multiple Trophies"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '32px 20px 20px',
                color: 'white'
              }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Champions Collection</div>
              </div>
            </div>

            <div 
              className="card"
              style={{ 
                padding: 0,
                overflow: 'hidden',
                aspectRatio: '16/9',
                position: 'relative'
              }}
            >
              <img 
                src="/liverpool 1.jpeg"
                alt="Liverpool Celebration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '32px 20px 20px',
                color: 'white'
              }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Team Triumph</div>
              </div>
            </div>

            <div 
              className="card"
              style={{ 
                padding: 0,
                overflow: 'hidden',
                aspectRatio: '16/9',
                position: 'relative',
                gridColumn: 'span 1'
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                textAlign: 'center',
                color: 'white'
              }}>
                <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 8, color: 'var(--brand-yellow)' }}>500+</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-300)' }}>Verified Winners</div>
                <div style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 8 }}>Join them today</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section style={{ marginTop: 120, marginBottom: 120, textAlign: 'center' }}>
          <p style={{ 
            fontSize: 14, 
            color: 'var(--gray-500)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            fontWeight: 600,
            marginBottom: 32
          }}>
            TRUSTED & SECURE
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 48, 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              padding: '16px 32px',
              background: 'var(--gray-50)',
              borderRadius: 8,
              border: '1px solid var(--gray-200)',
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 24 }}>🔒</span>
              <span>SSL Encrypted</span>
            </div>
            <div style={{ 
              padding: '16px 32px',
              background: 'var(--gray-50)',
              borderRadius: 8,
              border: '1px solid var(--gray-200)',
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 24 }}>💳</span>
              <span>Pesapal Verified</span>
            </div>
            <div style={{ 
              padding: '16px 32px',
              background: 'var(--gray-50)',
              borderRadius: 8,
              border: '1px solid var(--gray-200)',
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 24 }}>✓</span>
              <span>AI Verified Data</span>
            </div>
            <div style={{ 
              padding: '16px 32px',
              background: 'var(--gray-50)',
              borderRadius: 8,
              border: '1px solid var(--gray-200)',
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 24 }}>⭐</span>
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </section>

        {/* AI Assistant Demo */}
        <section id="ai-demo" style={{ marginTop: 120, marginBottom: 120 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ 
                margin: '0 0 20px 0',
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                Ask Our AI Assistant Anything
              </h2>
              <p style={{ 
                color: 'var(--gray-600)', 
                fontSize: 18, 
                margin: 0,
                lineHeight: 1.7
              }}>
                Powered by advanced language models, get instant answers about matches, statistics, and strategies
              </p>
            </div>
            
            <div style={{
              background: 'var(--brand-white)',
              borderRadius: 16,
              padding: 40,
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: '1px solid var(--gray-200)'
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--gray-900)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8
                }}>
                  <Logo />
                </div>
                <div>
                  <div style={{ color: 'var(--gray-900)', fontWeight: 700, fontSize: 17 }}>Smart-Win AI Assistant</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div>
                    Online & Ready
                  </div>
                </div>
              </div>

              {aiResponse && (
                <div style={{
                  background: 'var(--gray-50)',
                  padding: 24,
                  borderRadius: 12,
                  marginBottom: 20,
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ 
                    color: 'var(--gray-600)', 
                    fontSize: 11, 
                    marginBottom: 12, 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    AI Response
                  </div>
                  <div style={{ color: 'var(--gray-900)', lineHeight: 1.8, fontSize: 15 }}>
                    {aiResponse}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="Ask me anything about Smart-Win, matches, or strategies..."
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: 10,
                    border: '2px solid var(--gray-200)',
                    background: 'var(--brand-white)',
                    color: 'var(--gray-900)',
                    fontSize: 15,
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-red)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--gray-200)'}
                />
              </div>

              <button
                onClick={handleAiQuery}
                disabled={aiLoading || !aiMessage.trim()}
                className="cta"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: 15,
                  opacity: (aiLoading || !aiMessage.trim()) ? 0.5 : 1
                }}
              >
                {aiLoading ? 'Thinking...' : 'Ask AI Assistant'}
              </button>

              <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ width: '100%', fontSize: 12, color: 'var(--gray-500)', marginBottom: 8, fontWeight: 600 }}>
                  Try these questions:
                </div>
                {['What makes Smart-Win different?', 'How accurate is your data?', 'Tell me about AI verification'].map((question) => (
                  <button
                    key={question}
                    onClick={() => {
                      setAiMessage(question)
                      setTimeout(() => handleAiQuery(), 100)
                    }}
                    style={{
                      padding: '10px 16px',
                      background: 'var(--brand-white)',
                      border: '1px solid var(--gray-300)',
                      borderRadius: 8,
                      color: 'var(--gray-700)',
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--gray-50)'
                      e.currentTarget.style.borderColor = 'var(--gray-400)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--brand-white)'
                      e.currentTarget.style.borderColor = 'var(--gray-300)'
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ 
          marginTop: 120, 
          marginBottom: 120, 
          textAlign: 'center',
          padding: '72px 48px',
          background: 'var(--gray-50)',
          borderRadius: 16,
          border: '1px solid var(--gray-200)'
        }}>
          <h2 style={{ 
            marginBottom: 20,
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}>
            Ready to Join?
          </h2>
          <p style={{ 
            color: 'var(--gray-600)', 
            fontSize: 20, 
            margin: '0 0 48px 0',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.7
          }}>
            One-time payment of $100 gets you lifetime access to our premium intelligence platform
          </p>
          <Link href="/login">
            <button 
              className="cta" 
              style={{ fontSize: 18, padding: '22px 56px' }}
              onClick={() => setShowFireworks(true)}
            >
              Get Started Now
            </button>
          </Link>
          <p style={{ 
            fontSize: 14, 
            color: 'var(--gray-500)', 
            marginTop: 24,
            fontWeight: 500
          }}>
            No recurring fees • Instant access • Cancel anytime
          </p>
        </section>
      </main>

      <footer style={{ 
        background: 'var(--gray-900)', 
        color: 'var(--gray-400)', 
        padding: '64px 0 40px 0', 
        marginTop: 120, 
        borderTop: '1px solid var(--gray-800)' 
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
              <Logo />
              <h3 style={{ margin: 0, color: 'var(--brand-white)', fontSize: 24, fontWeight: 800 }}>Smart-Win</h3>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--gray-500)' }}>
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

      {/* Floating AI Chat Button */}
      {showAiWidget && (
        <div style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000
        }}>
          <button
            onClick={() => {
              document.querySelector('#ai-demo')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--brand-white)',
              border: '3px solid var(--brand-red)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              padding: 12
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 24, 26, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Logo />
            <div style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid white',
              animation: 'pulse 2s infinite'
            }}></div>
          </button>
          <div style={{
            position: 'absolute',
            bottom: -40,
            right: 0,
            background: 'var(--gray-900)',
            color: 'var(--brand-white)',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.2s'
          }}
          id="ai-tooltip"
          >
            Ask AI Assistant
          </div>
        </div>
      )}

      {/* Fireworks Effect */}
      <Fireworks
        trigger={showFireworks}
        onComplete={() => setShowFireworks(false)}
      />

      {/* Welcome Fireworks */}
      <Fireworks
        trigger={showWelcomeFireworks}
        onComplete={() => setShowWelcomeFireworks(false)}
      />

      {/* Confetti Effect */}
      <ConfettiEffect
        trigger={showConfetti}
        style="celebration"
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  )
}
