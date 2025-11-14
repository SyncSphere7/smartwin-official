import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'var(--green-500)',
          borderColor: 'var(--green-600)',
          icon: '✓'
        };
      case 'error':
        return {
          backgroundColor: 'var(--red-500)',
          borderColor: '#dc2626',
          icon: '✕'
        };
      case 'warning':
        return {
          backgroundColor: 'var(--yellow-500)',
          borderColor: '#d97706',
          icon: '⚠'
        };
      case 'info':
      default:
        return {
          backgroundColor: 'var(--blue-500)',
          borderColor: '#2563eb',
          icon: 'ℹ'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        maxWidth: 400,
        backgroundColor: styles.backgroundColor,
        color: 'var(--brand-white)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        border: `2px solid ${styles.borderColor}`,
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 9999,
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {styles.icon}
      </span>
      <p
        style={{
          margin: 0,
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {message}
      </p>
      <button
        onClick={onClose}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--brand-white)',
          fontSize: 20,
          cursor: 'pointer',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8,
          transition: 'opacity 0.2s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
      >
        ×
      </button>
    </div>
  );
}
