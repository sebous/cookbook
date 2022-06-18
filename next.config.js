const { withSuperjson } = require("next-superjson");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["platform-lookaside.fbsbx.com"],
  },
};

module.exports = withSuperjson()(nextConfig);
