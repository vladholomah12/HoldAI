/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['t.me'],
  },
  // Додаємо експериментальні функції якщо потрібно
  experimental: {
    serverActions: true,
  },
  // Додаємо налаштування заголовків для ton-connect-manifest.json
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
  },
  // Додаємо конфігурацію для правильної обробки статичних файлів
  webpack(config) {
    config.module.rules.push({
      test: /\.json$/,
      type: 'javascript/auto',
      use: ['json-loader']
    });
    return config;
  }
}

module.exports = nextConfig