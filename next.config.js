const { withSuperjson } = require("next-superjson");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/",
      destination: "/dashboard",
      permanent: true,
    },
  ],
};

module.exports = withSuperjson()(nextConfig);
