import type { NextConfig } from "next";
// @ts-ignore - million/next does not ship TS types for Next 15 yet
import million from 'million/next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'terrazaedenfiles.s3.us-east-2.amazonaws.com',
        pathname: '/**'
      }
    ]
  }
};

// @ts-ignore - million/next wrapper
const withMillion = (million as unknown as (opts?: Record<string, unknown>) => (config: NextConfig) => NextConfig)();

export default withMillion(nextConfig);
