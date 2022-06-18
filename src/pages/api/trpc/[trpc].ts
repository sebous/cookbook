import { createContext } from "@/backend/context";
import { appRouter, AppRouter } from "@/backend/routers";
import * as trpcNext from "@trpc/server/adapters/next";

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext,
  batching: {
    enabled: true,
  },
});
