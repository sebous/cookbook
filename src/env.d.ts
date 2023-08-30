declare namespace NodeJS {
	interface ProcessEnv {
		FACEBOOK_CLIENT_ID: string;
		FACEBOOK_CLIENT_SECRET: string;
		DISCORD_CLIENT_ID: string;
		DISCORD_CLIENT_SECRET: string;
		NEXTAUTH_SECRET: string;
		AWS_LAMBDA_FUNCTION_VERSION: string;
	}
}
