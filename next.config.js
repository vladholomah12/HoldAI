/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['t.me', 'ton.org', 'tonkeeper.com'],
  },
  experimental: {
    serverActions: true,
  },
  async headers() {
    return [
      {
        source: '/ton-connect-manifest.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Content-Type',
            value: 'application/json'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig