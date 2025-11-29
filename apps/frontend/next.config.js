/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Turbopack config required for Next.js 16 when webpack config is present
  turbopack: {
    resolveAlias: {
      '@/*': ['./*'],
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
