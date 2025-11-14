interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({ size = 'medium', color = 'var(--brand-red)' }: LoadingSpinnerProps) {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60
  };

  const spinnerSize = sizeMap[size];

  return (
    <div
      className="spinner"
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `3px solid rgba(0, 0, 0, 0.1)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
