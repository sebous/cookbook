import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
	providers: [
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		}),
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async redirect({ url, baseUrl }) {
			return `${baseUrl}/dashboard`;
		},
	},
});
