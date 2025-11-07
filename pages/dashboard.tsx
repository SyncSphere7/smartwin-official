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
      pending: { text: 'Pending Review', color: 'bg-yellow-500' },
      contacted: { text: 'Admin Contacted', color: 'bg-blue-500' },
      negotiating: { text: 'Negotiating', color: 'bg-purple-500' },
      completed: { text: 'Completed', color: 'bg-green-500' },
      declined: { text: 'Declined', color: 'bg-red-500' }
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`${badge.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Smart-Win Official</title>
        <meta name="description" content="Your Smart-Win consultation dashboard" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900">
        {/* Header */}
        <header className="border-b border-green-500/30 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src="/Logo.png" alt="Smart-Win Logo" width={50} height={50} />
              <span className="text-white font-bold text-xl">Smart-Win Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-white hover:text-green-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 border border-green-500 rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Smart-Win! 🎉
            </h1>
            <p className="text-green-200">
              Thank you for your consultation payment. Our team will review your request shortly.
            </p>
          </div>

          {/* Consultation Status */}
          {consultation && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
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
              <div className="bg-gradient-to-br from-green-600 to-green-800 border border-green-400 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📧</span> Contact Our Team
                </h2>
                <p className="text-green-100 mb-4">
                  Ready to discuss your fixed match needs? Reach out to us directly:
                </p>
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm mb-1">Email Us At:</p>
                  <a 
                    href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
                    className="text-white font-bold text-lg hover:text-green-300 transition-colors break-all"
                  >
                    {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
                  </a>
                </div>
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}?subject=Consultation Request - ${user?.email}`}
                  className="block w-full bg-white text-green-700 font-bold py-3 rounded-lg text-center hover:bg-green-100 transition-colors"
                >
                  Send Email Now
                </a>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6 mb-8">
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
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>✅</span> Our Verified Winning Tickets
            </h2>
            <p className="text-gray-400 mb-6">
              See proof of our past successes. These are real tickets from satisfied clients.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-700 rounded-lg blur opacity-25 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-black border border-green-500/30 rounded-lg overflow-hidden">
                    <Image
                      src={`/Ticket ${num}.jpeg`}
                      alt={`Verified Winning Ticket ${num}`}
                      width={300}
                      height={400}
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span>✓</span> Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">What Happens Next?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  1️⃣
                </div>
                <h4 className="text-white font-semibold mb-2">Admin Review</h4>
                <p className="text-gray-400 text-sm">
                  Our team reviews your consultation request and payment details
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  2️⃣
                </div>
                <h4 className="text-white font-semibold mb-2">Email Contact</h4>
                <p className="text-gray-400 text-sm">
                  We'll reach out via email to discuss your fixed match requirements
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
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
