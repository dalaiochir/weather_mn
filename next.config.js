/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  // If you later use image optimization with remote images:
  images: {
    domains: ["cdn.weatherapi.com"]
  }
};

module.exports = nextConfig;
