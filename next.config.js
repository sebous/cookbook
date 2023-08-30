const { withSuperjson } = require("next-superjson");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
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
		domains: ["platform-lookaside.fbsbx.com", "cdn.discordapp.com"],
	},
};

module.exports = withSuperjson()(nextConfig);
