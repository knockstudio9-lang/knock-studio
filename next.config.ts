// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this project so it always resolves `next` from
  // ./node_modules (avoids "Next.js package not found" panics on Windows)
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      // Unsplash images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Cloudinary images (res.cloudinary.com)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // Your specific Cloudinary domain
      {
        protocol: 'https',
        hostname: process.env.CLOUDINARY_CLOUD_NAME ? `${process.env.CLOUDINARY_CLOUD_NAME}.cloudinary.com` : 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // Support any Cloudinary subdomain
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // Add other image domains as needed
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // Optional: Configure image formats and quality
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

export default nextConfig;