import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { supabase } from '../lib/supabaseClient';

interface ConsultationRequest {
  id: string;
  status: 'pending' | 'contacted' | 'negotiating' | 'completed' | 'declined';
  payment_amount: number;
  payment_method: string;
  created_at: string;
  contacted_at: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [consultation, setConsultation] = useState<ConsultationRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUserAndPayment();
  }, []);

  const checkUserAndPayment = async () => {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Check if user has paid $100 and has consultation request
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultation_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (consultationError && consultationError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is acceptable
        console.error('Consultation error:', consultationError);
      }

      if (!consultationData) {
        // User hasn't paid yet, redirect to payment page
        setError('You need to complete the $100 consultation payment to access the dashboard.');
        setTimeout(() => router.push('/payment'), 3000);
        return;
      }

      setConsultation(consultationData);
      setLoading(false);
    } catch (err) {
      console.error('Error checking user:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: 'Pending Review', className: 'status-pending' },
      contacted: { text: 'Admin Contacted', className: 'status-contacted' },
      negotiating: { text: 'Negotiating', className: 'status-negotiating' },
      completed: { text: 'Completed', className: 'status-completed' },
      declined: { text: 'Declined', className: 'status-declined' }
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`status-badge ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-bg flex-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-bg flex-center">
        <div className="error-card">
          <h2 className="text-xl font-bold mb-2 text-white">Access Denied</h2>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Consultation Dashboard - Smart-Win</title>
        <meta name="description" content="Your Smart-Win consultation dashboard. Contact our team and view verified winning proofs." />
      </Head>

      <div className="dashboard-bg">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-container flex-between py-4">
            <div className="flex items-center gap-3">
              <Image src="/Logo.png" alt="Smart-Win Logo" width={50} height={50} />
              <span className="text-white font-bold text-xl">Smart-Win Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-logout"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-container py-8">
          {/* Welcome Section */}
          <div className="welcome-card">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Smart-Win! 🎉
            </h1>
            <p className="text-green-200">
              Thank you for your consultation payment. Our team will review your request shortly.
            </p>
          </div>

          {/* Consultation Status */}
          {consultation && (
            <div className="grid-2 mb-8">
              <div className="dashboard-card">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📊</span> Consultation Status
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Current Status</p>
                    {getStatusBadge(consultation.status)}
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Amount</p>
                    <p className="text-white font-semibold">${consultation.payment_amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Method</p>
                    <p className="text-white capitalize">{consultation.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Request Date</p>
                    <p className="text-white">{new Date(consultation.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Admin Contact Card */}
              <div className="contact-card">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📧</span> Contact Our Team
                </h2>
                <p className="text-green-100 mb-4">
                  Ready to discuss your fixed match needs? Reach out to us directly:
                </p>
                <div className="bg-white-10 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm mb-2">Email Us At:</p>
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
                    className="text-white font-bold text-lg hover-green-300 transition-colors break-all block"
                  >
                    {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
                  </a>
                </div>
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}?subject=Consultation Request - ${user?.email}`}
                  className="btn-white block w-full text-center"
                >
                  Send Email Now
                </a>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="warning-card">
            <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
              <span>⚠️</span> Important Information
            </h3>
            <ul className="text-yellow-200 space-y-2 text-sm">
              <li>• The $100 consultation fee is <strong>non-refundable</strong></li>
              <li>• Match prices are negotiated separately after consultation</li>
              <li>• Our team typically responds within 24-48 hours</li>
              <li>• Please check your email regularly for updates</li>
            </ul>
          </div>

          {/* Verified Tickets Gallery - Social Proof */}
          <div className="dashboard-card">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>✅</span> Our Verified Winning Tickets
            </h2>
            <p className="text-gray-400 mb-6">
              See proof of our past successes. These are real tickets from satisfied clients.
            </p>
            <div className="grid-4 grid-2-md">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="relative ticket-glow-parent">
                  <div className="ticket-glow"></div>
                  <div className="relative dashboard-card overflow-hidden">
                    <Image
                      src={`/Ticket ${num}.jpeg`}
                      alt={`Verified Winning Ticket ${num}`}
                      width={300}
                      height={400}
                      className="w-full h-auto"
                    />
                    <div className="verified-badge">
                      <span>✓</span> Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 dashboard-card">
            <h3 className="text-xl font-bold text-white mb-4">What Happens Next?</h3>
            <div className="grid-3">
              <div className="text-center">
                <div className="step-circle">
                  1️⃣
                </div>
                <h4 className="text-white font-semibold mb-2">Admin Review</h4>
                <p className="text-gray-400 text-sm">
                  Our team reviews your consultation request and payment details
                </p>
              </div>
              <div className="text-center">
                <div className="step-circle">
                  2️⃣
                </div>
                <h4 className="text-white font-semibold mb-2">Email Contact</h4>
                <p className="text-gray-400 text-sm">
                  We'll reach out via email to discuss your fixed match requirements
                </p>
              </div>
              <div className="text-center">
                <div className="step-circle">
                  3️⃣
                </div>
                <h4 className="text-white font-semibold mb-2">Negotiation</h4>
                <p className="text-gray-400 text-sm">
                  We negotiate match details, pricing, and finalize your order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
