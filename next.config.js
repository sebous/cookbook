const { withSuperjson } = require("next-superjson");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
  images: {
    domains: ["platform-lookaside.fbsbx.com"],
  },
};

module.exports = withSuperjson()(nextConfig);
