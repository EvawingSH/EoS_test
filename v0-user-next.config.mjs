/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['placeholder.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Ignore the deprecation warning
    config.ignoreWarnings = [
      { module: /node_modules\/node-fetch\/lib\/index\.js/ },
      { message: /Critical dependency: the request of a dependency is an expression/ },
      { message: /\[DEP0060\] DeprecationWarning: util\._extend is deprecated/ },
    ];

    return config;
  },
};

export default nextConfig;
