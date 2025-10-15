// File: next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The 'env' block has been removed.
  // Next.js automatically handles variables prefixed with NEXT_PUBLIC_
  // from your .env.local file.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;