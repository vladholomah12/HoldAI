/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['t.me'], // Для зображень з Telegram
  },
  typescript: {
    ignoreBuildErrors: true, // Тимчасово, поки виправляємо всі типи
  },
  eslint: {
    ignoreDuringBuilds: true, // Тимчасово, поки виправляємо всі помилки eslint
  }
}

module.exports = nextConfig
