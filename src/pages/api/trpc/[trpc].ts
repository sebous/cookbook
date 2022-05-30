import prisma from "@/backend/prisma";
import { processRecipeUrl } from "@/backend/recipes";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

export const appRouter = trpc
  .router()
  .query("all-recipes", {
    input: z.undefined(),
    async resolve() {
      const recipes = await prisma.recipe.findMany({
        select: { id: true, name: true },
      });
      return recipes;
    },
  })
  .query("recipe-detail", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const recipe = await prisma.recipe.findFirst({
        where: { id: input.id },
      });
      return recipe;
    },
  })
  .mutation("import-recipe", {
    input: z.object({
      url: z.string(),
    }),
    async resolve({ input }) {
      const processedRecipe = await processRecipeUrl(input.url);
      const created = await prisma.recipe.create({
        data: {
          ...processedRecipe,
          parsedName: processedRecipe.name,
        },
      });
      return created;
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
