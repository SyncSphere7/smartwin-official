import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--gray-50)',
          }}
        >
          <div
            style={{
              maxWidth: 500,
              padding: 32,
              backgroundColor: 'var(--brand-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 16,
              }}
            >
              ⚠️
            </div>
            <h1
              style={{
                fontSize: 24,
                marginBottom: 16,
                color: 'var(--gray-900)',
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: 'var(--gray-600)',
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              className="cta"
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
              }}
            >
              Refresh Page
            </button>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  backgroundColor: 'var(--gray-100)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  color: 'var(--red-500)',
                  overflow: 'auto',
                }}
              >
                <strong>Error details (dev only):</strong>
                <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
