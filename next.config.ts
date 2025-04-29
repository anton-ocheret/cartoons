import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://simpsonsua.tv/**')],
  },
};

export default nextConfig;
