import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface FireworksProps {
  trigger?: boolean
  onComplete?: () => void
}

export default function Fireworks({ trigger = false, onComplete }: FireworksProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (trigger) {
      launchFireworks()
    }
  }, [trigger])

  const launchFireworks = () => {
    setActive(true)
    const colors = ['#FF181A', '#FFD900', '#FFFFFF', '#FF6B6B', '#FFA500']
    const bursts = 8 // Number of firework bursts
    
    for (let burst = 0; burst < bursts; burst++) {
      setTimeout(() => {
        const centerX = Math.random() * window.innerWidth
        const centerY = Math.random() * (window.innerHeight * 0.5) + 100
        const particleCount = 40 + Math.random() * 40
        const newParticles: Particle[] = []

        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount
          const velocity = 2 + Math.random() * 4
          const color = colors[Math.floor(Math.random() * colors.length)]
          
          newParticles.push({
            id: Date.now() + i + burst * 1000,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1,
            maxLife: 60 + Math.random() * 40,
            color,
            size: 3 + Math.random() * 3
          })
        }

        setParticles(prev => [...prev, ...newParticles])
      }, burst * 300)
    }

    // Clean up after animation
    setTimeout(() => {
      setActive(false)
      setParticles([])
      onComplete?.()
    }, bursts * 300 + 2000)
  }

  useEffect(() => {
    if (!active) return

    const animationFrame = requestAnimationFrame(function animate() {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // Gravity
            vx: p.vx * 0.99, // Air resistance
            life: p.life + 1,
            size: p.size * 0.98
          }))
          .filter(p => p.life < p.maxLife && p.y < window.innerHeight)
      )
      
      if (active) {
        requestAnimationFrame(animate)
      }
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [active])

  if (!active && particles.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {particles.map(particle => {
        const opacity = 1 - (particle.life / particle.maxLife)
        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: particle.color,
              opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )
      })}
    </div>
  )
}
