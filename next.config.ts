import type { NextConfig } from 'next';

const staticExport = process.env.STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ['127.0.0.1'],
  basePath,
  ...(staticExport ? { output: 'export' as const, trailingSlash: true } : {}),
  images: { qualities: [75, 90], unoptimized: staticExport },
};
export default nextConfig;
