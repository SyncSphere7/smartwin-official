/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-supabase-url.supabase.co'], // Update with your Supabase URL
  }
}

module.exports = nextConfig
