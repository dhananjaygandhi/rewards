/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    conversion: {
      shukran: 20,
      aed: 1
    }
  }
}

module.exports = nextConfig
