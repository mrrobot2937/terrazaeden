import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'terrazaedenfiles.s3.us-east-2.amazonaws.com',
      }
    ]
  }
};

export default nextConfig;
