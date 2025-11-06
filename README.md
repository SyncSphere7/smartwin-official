# Smart-Win — AI-Powered Fixed Match Platform

A complete Next.js + TypeScript web application for Smart-Win, featuring secure payments via Pesapal, AI-powered features with OpenRouter, transactional emails via Resend, and multi-language support.

## Features

✅ **Complete Authentication** - Supabase Auth with email/password
✅ **Secure Payment Gateway** - Pesapal integration with automatic access unlocking
✅ **AI-Powered** - Chatbot and ticket validation using OpenRouter
✅ **Multi-language** - Auto-detect browser language, 5 languages included
✅ **Admin Panel** - Manage users, tickets, and content
✅ **Email Automation** - Welcome and confirmation emails via Resend
✅ **Database & Storage** - Full Supabase integration with RLS
✅ **Mobile Responsive** - Optimized for all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Pesapal API v3
- **AI**: OpenRouter (free models)
- **Email**: Resend API
- **i18n**: react-i18next with auto-detection

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor
3. Copy your project URL and keys to `.env.local`

### 4. Configure Payment Gateway

1. Sign up for Pesapal at https://pesapal.com
2. Get your Consumer Key and Secret from the dashboard
3. Register your IPN webhook URL: `https://yourdomain.com/api/payment-webhook`
4. Add credentials to `.env.local`

### 5. Set Up Email Service

1. Sign up for Resend at https://resend.com
2. Verify your sending domain
3. Generate an API key and add to `.env.local`

### 6. Configure AI Service

1. Sign up for OpenRouter at https://openrouter.ai
2. Get a free API key
3. Add to `.env.local`

### 7. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
├── pages/
│   ├── index.tsx           # Landing page
│   ├── login.tsx           # Auth page
│   ├── dashboard.tsx       # User dashboard (paid access)
│   ├── admin.tsx           # Admin panel
│   ├── payment.tsx         # Payment checkout
│   ├── payment-callback.tsx # Payment verification
│   ├── contact.tsx         # Contact form
│   ├── _app.tsx            # App wrapper
│   └── api/
│       ├── ai.ts           # OpenRouter AI endpoints
│       ├── create-payment.ts # Initialize Pesapal payment
│       ├── verify-payment.ts # Check payment status
│       ├── payment-webhook.ts # Pesapal IPN handler
│       └── send-email.ts   # Resend email sender
├── components/
│   ├── Logo.tsx            # Brand logo
│   ├── Header.tsx          # Site header
│   ├── CTAButton.tsx       # Call-to-action button
│   └── TicketCarousel.tsx  # Proof carousel
├── lib/
│   ├── supabaseClient.ts   # Client-side Supabase
│   ├── supabaseAdmin.ts    # Server-side Supabase (elevated)
│   ├── pesapal.ts          # Pesapal API wrapper
│   ├── openRouter.ts       # OpenRouter API wrapper
│   ├── resend.ts           # Resend API wrapper
│   └── emailTemplates.ts   # Localized email templates
├── locales/                # Translation files (en, es, fr, pt, de)
├── styles/
│   └── globals.css         # Global styles with brand colors
└── supabase-schema.sql     # Database schema

```

## Key Workflows

### User Registration & Payment

1. User signs up → Account created in Supabase Auth
2. Welcome email sent via Resend
3. User redirected to `/payment`
4. User pays $100 via Pesapal
5. Pesapal webhook triggers `/api/payment-webhook`
6. User record updated: `paid = true`
7. Confirmation email sent
8. User redirected to `/dashboard` with full access

### Admin Ticket Upload

1. Admin logs in and navigates to `/admin`
2. Uploads ticket image to Supabase Storage
3. AI analyzes image and extracts data (OpenRouter)
4. Ticket saved to database with AI summary
5. Ticket visible to paid users on dashboard

### AI Chat

1. User clicks "Start Chat" on dashboard
2. Chat interface sends message to `/api/ai`
3. OpenRouter processes request with free model
4. Response displayed to user in real-time

## Database Schema

See `supabase-schema.sql` for complete schema including:
- **users** - User profiles with payment status
- **tickets** - Match proof images and metadata
- **payments** - Payment transaction records
- **testimonials** - User testimonials
- **contact_messages** - Support inquiries

All tables have Row Level Security (RLS) policies configured.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
PESAPAL_CONSUMER_KEY
PESAPAL_CONSUMER_SECRET
PESAPAL_API_URL
OPENROUTER_API_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_APP_URL
```

## Security Notes

🔒 Never commit `.env.local` or expose service role keys
🔒 All payment webhooks are signature-verified
🔒 Database access controlled by RLS policies
🔒 Admin routes check user role server-side
🔒 API routes validate authentication tokens

## Customization

### Brand Colors

Edit `styles/globals.css`:
- `--brand-black`: #000000
- `--brand-red`: #FF181A
- `--brand-yellow`: #FFD900
- `--brand-white`: #FFFFFF

### Logo

Replace the SVG in `components/Logo.tsx` with your actual logo file.

### Languages

Add new languages in:
1. Create `locales/{lang}.json`
2. Import in `i18n.ts`
3. Add to email templates in `lib/emailTemplates.ts`

### Payment Amount

Change in `pages/payment.tsx` and update description throughout.

## Troubleshooting

**Payment webhook not working?**
- Ensure your IPN URL is publicly accessible (not localhost)
- Check Pesapal dashboard for webhook delivery logs
- Verify webhook URL in Pesapal settings

**Email not sending?**
- Verify domain in Resend dashboard
- Check API key is correct
- Review Resend logs

**Database errors?**
- Verify RLS policies are set up correctly
- Check service role key for admin operations
- Review Supabase logs

## Support

For issues or questions:
- Check Supabase logs for database errors
- Check Vercel logs for API errors
- Review Pesapal/Resend dashboards for service issues

## License

Proprietary - Smart-Win Official
