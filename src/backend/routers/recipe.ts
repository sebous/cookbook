import { z } from "zod";
import { createRouter } from "../createRouter";
import { recipeModule } from "../modules/recipe";
import prisma from "../prisma";

export const recipeRouter = createRouter()
  .query("getAll", {
    input: z.undefined(),
    async resolve() {
      const recipes = await prisma.recipe.findMany({
        select: { id: true, name: true },
      });
      return recipes;
    },
  })
  .query("getDetail", {
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
  .mutation("import", {
    input: z.object({
      url: z.string().url(),
    }),
    async resolve({ input }) {
      const duplicate = await prisma.recipe.findFirst({
        where: {
          url: input.url,
        },
      });
      if (duplicate) throw "duplicate recipe";

      const processedRecipe = await recipeModule.processRecipeUrl(input.url);
      const created = await prisma.recipe.create({
        data: {
          ...processedRecipe,
          url: input.url,
          parsedName: processedRecipe.name,
        },
      });
      return created;
    },
  });
