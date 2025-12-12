import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize production builds
  compress: true,
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Performance optimizations
  poweredByHeader: false,
  
  // TypeScript and ESLint configuration
  typescript: {
    // Fail build on TypeScript errors in production
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Fail build on ESLint errors in production
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
