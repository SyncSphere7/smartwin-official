# Smart-Win Deployment Guide

## Pre-Deployment Checklist

### 1. Supabase Setup

1. **Create Project**
   - Go to https://supabase.com
   - Create new project
   - Note your project URL and keys

2. **Run Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy entire contents of `supabase-schema.sql`
   - Execute the SQL
   - Verify tables created: users, tickets, payments, testimonials, contact_messages

3. **Create Storage Bucket**
   - Go to Storage in Supabase dashboard
   - Create bucket named "tickets"
   - Set to public
   - Configure CORS if needed

4. **Get Credentials**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (keep SECRET!)
   ```

### 2. Pesapal Setup

1. **Register Account**
   - Go to https://www.pesapal.com
   - Sign up for merchant account
   - Get approved (may take 1-2 business days)

2. **Get API Credentials**
   - Login to Pesapal dashboard
   - Go to API section
   - Generate Consumer Key and Secret
   - Note the API URL (sandbox or live)

3. **Register IPN Webhook**
   - In Pesapal dashboard, register IPN URL
   - Use: `https://yourdomain.com/api/payment-webhook`
   - Save the IPN ID provided

4. **Add to Environment**
   ```
   PESAPAL_CONSUMER_KEY=your_key
   PESAPAL_CONSUMER_SECRET=your_secret
   PESAPAL_API_URL=https://pay.pesapal.com/v3
   PESAPAL_IPN_ID=your_ipn_id
   ```

### 3. Resend Setup

1. **Create Account**
   - Go to https://resend.com
   - Sign up for free account

2. **Verify Domain**
   - Add your domain (smartwinofficial.co.uk)
   - Add DNS records provided by Resend
   - Wait for verification (usually minutes)

3. **Generate API Key**
   - Go to API Keys section
   - Create new API key
   - Copy immediately (won't be shown again)

4. **Add to Environment**
   ```
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_EMAIL=noreply@smartwinofficial.co.uk
   ```

### 4. OpenRouter Setup

1. **Create Account**
   - Go to https://openrouter.ai
   - Sign up

2. **Get API Key**
   - Go to Keys section
   - Create new key
   - Free tier includes generous limits

3. **Add to Environment**
   ```
   OPENROUTER_API_KEY=sk-or-xxxxx
   ```

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
cd /Users/syncsphere/Desktop/smartwinofficial.co.uk
git init
git add .
git commit -m "Initial commit - Smart-Win platform"
git branch -M main
git remote add origin https://github.com/yourusername/smartwin.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add ALL variables from `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PESAPAL_CONSUMER_KEY=
PESAPAL_CONSUMER_SECRET=
PESAPAL_API_URL=
PESAPAL_IPN_ID=
OPENROUTER_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_APP_URL=https://smartwinofficial.co.uk
```

### Step 4: Deploy

- Click "Deploy"
- Wait for build to complete
- Visit your site!

### Step 5: Configure Custom Domain

1. In Vercel, go to Settings → Domains
2. Add: `smartwinofficial.co.uk`
3. Add DNS records to your domain provider:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
4. Wait for DNS propagation (can take 24-48 hours)

## Post-Deployment Tasks

### 1. Create Admin User

After deployment, you need to manually set your first admin user:

1. Go to your Supabase project
2. Navigate to Table Editor → users
3. Find your user account
4. Edit the `role` field to `admin`
5. Save

Or run this SQL:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-admin@email.com';
```

### 2. Test Payment Flow

1. Use Pesapal sandbox/test mode
2. Create test account
3. Make $100 test payment
4. Verify:
   - Payment record created
   - User.paid set to true
   - Confirmation email sent
   - Dashboard unlocked

### 3. Upload First Tickets

1. Login as admin
2. Go to `/admin`
3. Upload 4-8 ticket images
4. Verify they appear on landing page and dashboard

### 4. Configure Email Templates

Edit `lib/emailTemplates.ts` to:
- Update support email
- Customize branding
- Add more language translations

### 5. Update Logo

Replace the SVG in `components/Logo.tsx` with your actual logo file.

## Monitoring & Maintenance

### Check Logs

**Vercel**
- Go to project → Deployments → Latest → Function Logs
- Monitor API routes for errors

**Supabase**
- Database → Logs
- Check query performance and errors

**Pesapal**
- Dashboard → Transactions
- Verify webhook deliveries

**Resend**
- Dashboard → Logs
- Check email delivery status

### Database Backups

Supabase automatically backs up your database. To manually export:
1. Go to Database → Backups
2. Download backup
3. Store securely

### Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] Service role key is NEVER exposed to client
- [ ] RLS policies are enabled on all tables
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] Admin role is manually assigned (not self-assignable)
- [ ] Payment webhooks verify signatures
- [ ] User input is sanitized

## Troubleshooting

### Payment webhook not receiving events
- Check Pesapal dashboard for webhook delivery logs
- Ensure URL is publicly accessible (not localhost)
- Verify PESAPAL_IPN_ID is set correctly
- Check Vercel function logs for errors

### Emails not sending
- Verify domain is verified in Resend
- Check Resend API key is correct
- Review Resend logs for bounce/failure reasons
- Ensure FROM email matches verified domain

### Database permission errors
- Check RLS policies are correct
- Verify service role key is used for admin operations
- Review Supabase logs for specific errors

### AI not responding
- Verify OpenRouter API key is valid
- Check if you've hit free tier limits
- Try different free model if one is down
- Review function logs for API errors

## Performance Optimization

### Image Optimization

1. Use Next.js Image component:
```tsx
import Image from 'next/image'
<Image src={url} alt="Ticket" width={200} height={120} />
```

2. Compress images before upload
3. Generate thumbnails for tickets

### Caching

Add to `next.config.js`:
```js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' }
      ]
    }
  ]
}
```

### Database Indexing

Already included in schema, but monitor slow queries in Supabase.

## Scaling Considerations

When you grow:

1. **Supabase**: Upgrade to Pro plan for more storage/bandwidth
2. **Vercel**: Pro plan for more function invocations
3. **Pesapal**: Verify transaction limits
4. **OpenRouter**: Add billing for more AI requests
5. **CDN**: Add Cloudflare for global performance

## Support

For issues:
- Check GitHub Issues
- Review Supabase docs: https://supabase.com/docs
- Pesapal support: support@pesapal.com
- Vercel docs: https://vercel.com/docs
