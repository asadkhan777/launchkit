/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  },
  reactStrictMode: true,
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
}

module.exports = nextConfig;
