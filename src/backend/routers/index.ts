import { createRouter } from "../createRouter";
import superjson from "superjson";
import { recipeRouter } from "./recipe";

export const appRouter = createRouter()
  .transformer(superjson)
  .query("ping", {
    resolve() {
      return "pong";
    },
  })
  .merge("recipe.", recipeRouter);

export type AppRouter = typeof appRouter;
