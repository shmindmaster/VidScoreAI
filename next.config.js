/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add other configurations as needed
  experimental: {
    appDir: false,
  },
  webpack: (config, { isServer }) => {
    // Important: return the modified config object
    return config;
  },
};

export default nextConfig;
