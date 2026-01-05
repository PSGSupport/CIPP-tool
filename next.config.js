/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async redirects() {
    return [];
  },
  // For Render.com deployment - use server mode instead of static export
  // Set CIPP_API_URL environment variable to your Azure Functions backend URL
  ...(process.env.RENDER ? {} : { output: "export", distDir: "./out" }),
  async rewrites() {
    // Proxy /api/* requests to the CIPP-API backend (Azure Functions)
    const apiUrl = process.env.CIPP_API_URL;
    if (apiUrl) {
      return [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/api/:path*`,
        },
        {
          source: "/.auth/:path*",
          destination: `${apiUrl}/.auth/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = config;
