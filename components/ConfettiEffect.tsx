import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  style?: 'gentle' | 'standard' | 'celebration';
  trigger?: boolean;
  duration?: number;
  onComplete?: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  style = 'standard',
  trigger = true,
  duration = 3000,
  onComplete
}) => {
  useEffect(() => {
    if (!trigger) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFFFFF'];

    const configMap = {
      gentle: {
        particleCount: 30,
        spread: 40,
        startVelocity: 20,
        gravity: 0.5,
        scalar: 0.8
      },
      standard: {
        particleCount: 80,
        spread: 70,
        startVelocity: 30,
        gravity: 0.8,
        scalar: 1
      },
      celebration: {
        particleCount: 150,
        spread: 100,
        startVelocity: 45,
        gravity: 1,
        scalar: 1.2
      }
    };

    const config = configMap[style];

    confetti({
      particleCount: config.particleCount,
      spread: config.spread,
      startVelocity: config.startVelocity,
      origin: { x: 0.5, y: 0.4 },
      colors: colors,
      gravity: config.gravity,
      scalar: config.scalar,
      ticks: 200,
      shapes: ['circle', 'square'],
      drift: 0
    });

    if (style === 'celebration') {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors
        });
      }, 250);
    }

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [trigger, style, duration, onComplete]);

  return null;
};

export default ConfettiEffect;
