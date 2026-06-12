import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Transpile shared packages
  transpilePackages: ['@ppid/ui', '@ppid/db', '@ppid/email'],

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'X-Content-Type-Options',      value: 'nosniff' },
          { key: 'Referrer-Policy',             value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',          value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  // Image domains for Next.js Image component
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ppid.baznas-cianjur.or.id' },
    ],
  },
}

export default nextConfig
