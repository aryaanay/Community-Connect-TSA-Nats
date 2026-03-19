/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '/tmp/next-community-connect-build',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig

