import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  // callbacks: {
  //   async signIn({ user, account, profile, email, credentials }) {
  //     console.log("sign in");
  //     return true;
  //   },
  //   async redirect({ url, baseUrl }) {
  //     console.log(`${baseUrl}/dashboard`);
  //     return `${baseUrl}/dashboard`;
  //   },
  //   async session({ session, user, token }) {
  //     console.log("session");
  //     return session;
  //   },
  //   async jwt({ token, user, account, profile, isNewUser }) {
  //     console.log("jwt");
  //     return token;
  //   },
  // },
});
