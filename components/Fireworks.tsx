import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface FireworksProps {
  duration?: number;
  intensity?: 'light' | 'medium' | 'heavy';
  trigger?: boolean;
  onComplete?: () => void;
}

const Fireworks: React.FC<FireworksProps> = ({
  duration = 5000,
  intensity = 'medium',
  trigger = true,
  onComplete
}) => {
  useEffect(() => {
    if (!trigger) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const end = Date.now() + duration;

    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

    const particleCount = intensity === 'light' ? 30 : intensity === 'medium' ? 50 : 100;
    const spread = intensity === 'light' ? 50 : intensity === 'medium' ? 80 : 120;

    const frame = () => {
      if (Date.now() > end) {
        onComplete?.();
        return;
      }

      confetti({
        particleCount: Math.floor(Math.random() * (particleCount / 2)) + particleCount / 2,
        startVelocity: 30,
        spread: spread,
        origin: {
          x: Math.random() * 0.6 + 0.2,
          y: Math.random() * 0.5 + 0.3
        },
        colors: colors,
        gravity: 1.2,
        scalar: 1.2,
        drift: 0,
        ticks: 200
      });

      if (intensity === 'heavy') {
        confetti({
          particleCount: Math.floor(Math.random() * 20) + 10,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: colors
        });
        confetti({
          particleCount: Math.floor(Math.random() * 20) + 10,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: colors
        });
      }

      requestAnimationFrame(frame);
    };

    frame();

    return () => {
      confetti.reset();
    };
  }, [duration, intensity, trigger, onComplete]);

  return null;
};

export default Fireworks;
