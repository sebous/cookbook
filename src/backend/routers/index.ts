import { createRouter } from "../createRouter";
import superjson from "superjson";
import { recipeRouter } from "./recipe";

export const appRouter = createRouter()
  .transformer(superjson)
  .query("hello", {
    resolve() {
      return "henlo!";
    },
  })
  .merge("recipe.", recipeRouter);

export type AppRouter = typeof appRouter;
