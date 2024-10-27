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
  }
}

module.exports = nextConfig