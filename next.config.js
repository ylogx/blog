/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  // Add public directory as a base path for images
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  
  // Enable standalone output for Docker deployment
  output: 'standalone',
};

module.exports = nextConfig;
