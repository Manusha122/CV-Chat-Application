/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable modern bundling
    esmExternals: true,
  },
  // Add proper error handling
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4001/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
