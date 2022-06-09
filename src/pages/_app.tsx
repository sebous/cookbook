import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { Layout } from "@/components/Layout";
import type { AppRouter } from "@/backend/routers";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";
import type { NextPage } from "next";
import { AuthGuard } from "@/components/AuthGuard";

export type NextAppPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

function MyApp(props: AppProps) {
  const { Component, pageProps }: { Component: NextAppPage; pageProps: any } =
    props;
  return (
    <SessionProvider session={pageProps.session}>
      {Component.requireAuth ? (
        <AuthGuard>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthGuard>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;
    // ctx?.res?.setHeader(
    //   "Cache-Control",
    //   `s-maxage=1, stale-while-revalidate=600`
    // );

    return {
      url,
      transformer: superjson,
      headers: () => {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            "x-ssr": "1",
          };
        }
        return {};
      },
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);

function getBaseUrl() {
  if (typeof window) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}
