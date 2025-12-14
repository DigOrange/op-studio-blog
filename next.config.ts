import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {},
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'stack'],
  },
}

export default withNextIntl(nextConfig)
