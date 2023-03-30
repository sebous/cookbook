import { createContext } from "@/backend/context";
import { appRouter, AppRouter } from "@/backend/routers";
import * as trpcNext from "@trpc/server/adapters/next";

export const config = {
  runtime: "edge",
};

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext,
  batching: {
    enabled: true,
  },
});
