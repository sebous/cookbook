import { createRouter } from "../createRouter";
import superjson from "superjson";
import { recipeRouter } from "./recipe";
import { db } from "../db";

export const appRouter = createRouter()
  .transformer(superjson)
  .query("ping", {
    async resolve() {
      await db.selectFrom("Recipe").select("id").execute();
      return "pong";
    },
  })
  .merge("recipe.", recipeRouter);

export type AppRouter = typeof appRouter;
