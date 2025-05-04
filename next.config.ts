import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simpsons-images.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/optimized_images//**',
        search: '',
      },
    ],
    domains: ['simpsons-images.s3.eu-north-1.amazonaws.com'],
  },
};

export default nextConfig;
