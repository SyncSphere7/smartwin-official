# Quick Start Guide

## For Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials (see DEPLOYMENT.md for how to get these).

### 3. Set Up Database

1. Create Supabase project
2. Run the SQL from `supabase-schema.sql` in Supabase SQL Editor
3. Add Supabase URL and keys to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Create Test Admin User

After signing up through the UI:

```sql
-- Run in Supabase SQL Editor
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

Now you can access `/admin`

## Testing Without Payment Setup

To test without Pesapal credentials, you can manually set `paid = true`:

```sql
-- Run in Supabase SQL Editor after creating account
UPDATE public.users 
SET paid = true 
WHERE email = 'your@email.com';
```

Then you can access `/dashboard`

## Project Structure Overview

```
├── pages/
│   ├── index.tsx              # Landing page
│   ├── login.tsx              # Auth (login/signup)
│   ├── dashboard.tsx          # User dashboard (paid only)
│   ├── admin.tsx              # Admin panel
│   ├── payment.tsx            # Payment checkout
│   ├── payment-callback.tsx   # Payment verification
│   ├── contact.tsx            # Contact form
│   └── api/
│       ├── ai.ts              # OpenRouter chat/summarize
│       ├── create-payment.ts  # Initialize Pesapal payment
│       ├── verify-payment.ts  # Check payment status
│       ├── payment-webhook.ts # Pesapal IPN handler
│       └── send-email.ts      # Resend email sender
├── components/
│   ├── Logo.tsx               # Brand logo
│   ├── Header.tsx             # Site header
│   ├── CTAButton.tsx          # Call-to-action button
│   └── TicketCarousel.tsx     # Proof carousel
├── lib/
│   ├── supabaseClient.ts      # Client-side Supabase
│   ├── supabaseAdmin.ts       # Server-side Supabase (elevated)
│   ├── pesapal.ts             # Pesapal API wrapper
│   ├── openRouter.ts          # OpenRouter API wrapper
│   ├── resend.ts              # Resend API wrapper
│   └── emailTemplates.ts      # Localized email templates
├── locales/                   # Translation files
├── styles/
│   └── globals.css            # Global styles + brand colors
└── supabase-schema.sql        # Database schema
```

## Common Tasks

### Add a New Language

1. Create `locales/{lang}.json` with translations
2. Import in `i18n.ts`
3. Add email templates in `lib/emailTemplates.ts`

### Customize Branding

1. Replace Logo SVG in `components/Logo.tsx`
2. Update colors in `styles/globals.css` (CSS variables)
3. Update metadata in pages

### Add New Ticket

As admin:
1. Go to `/admin`
2. Click "Tickets" tab
3. Fill form and upload image
4. AI will auto-summarize

### View User Details

As admin:
1. Go to `/admin`
2. Click "Users" tab
3. Toggle payment status if needed

## API Endpoints

### POST `/api/ai`
Chat or summarize with AI
```json
{
  "action": "chat",
  "prompt": "Hello"
}
```

### POST `/api/create-payment`
Initialize Pesapal payment
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "amount": 100,
  "currency": "USD"
}
```

### POST `/api/verify-payment`
Check payment status
```json
{
  "orderTrackingId": "xxxxx"
}
```

### GET `/api/payment-webhook`
Pesapal IPN (called by Pesapal, not by you)

### POST `/api/send-email`
Send email via Resend
```json
{
  "to": "user@example.com",
  "subject": "Hello",
  "html": "<h1>Hello</h1>"
}
```

## Database Tables

### users
- id (UUID, FK to auth.users)
- email
- full_name
- paid (boolean)
- role ('user' | 'admin')
- locale

### tickets
- id (UUID)
- image_url
- match_description
- payout_amount
- verified (boolean)
- ai_summary
- visibility ('public' | 'private')

### payments
- id (UUID)
- user_id (FK)
- amount
- currency
- status ('pending' | 'completed')
- pesapal_tracking_id

### testimonials
- content
- author_name
- approved (boolean)

### contact_messages
- user_id (FK)
- subject
- message
- status ('new' | 'replied')

## Troubleshooting

**Can't login after signup**
- Check Supabase Auth logs
- Verify email confirmation isn't required (or disable it)

**Dashboard shows "Loading..."**
- Check browser console for errors
- Verify Supabase keys in `.env.local`
- Check user has `paid = true` in database

**Admin panel shows "Unauthorized"**
- Verify user has `role = 'admin'` in database

**AI not working**
- Check OPENROUTER_API_KEY is set
- Verify you haven't hit rate limits
- Try different free model

**Images not uploading**
- Check Supabase Storage bucket "tickets" exists
- Verify bucket is public
- Check admin user permissions

## Next Steps

1. Read `DEPLOYMENT.md` for production deployment
2. Customize email templates in `lib/emailTemplates.ts`
3. Replace logo SVG with actual brand asset
4. Add more languages if needed
5. Configure payment gateway credentials
6. Deploy to Vercel

## Getting Help

- Check README.md for overview
- Check DEPLOYMENT.md for production setup
- Review code comments for implementation details
- Check Supabase/Vercel logs for runtime errors
