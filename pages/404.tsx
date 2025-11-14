import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Smart-Win</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)',
        }}
      >
        <div
          style={{
            maxWidth: 600,
            padding: 48,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--brand-red) 0%, #d00000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 24,
              lineHeight: 1,
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 16,
              color: 'var(--gray-900)',
            }}
          >
            Page Not Found
          </h1>

          <p
            style={{
              fontSize: 18,
              color: 'var(--gray-600)',
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            Sorry, we couldn't find the page you're looking for. The page may have been moved or deleted.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/">
              <button
                className="cta"
                style={{
                  padding: '14px 28px',
                  fontSize: 16,
                }}
              >
                Go to Homepage
              </button>
            </Link>

            <Link href="/dashboard">
              <button
                className="ghost-cta"
                style={{
                  padding: '14px 28px',
                  fontSize: 16,
                }}
              >
                Go to Dashboard
              </button>
            </Link>
          </div>

          <div
            style={{
              marginTop: 48,
              padding: 24,
              background: 'var(--brand-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: 'var(--gray-600)',
              }}
            >
              Need help? <Link href="/contact"><a style={{ color: 'var(--brand-red)', fontWeight: 600 }}>Contact our team</a></Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
