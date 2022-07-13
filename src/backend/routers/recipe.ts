import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";
import { recipeModule } from "../modules/recipe";
import prisma from "../prisma";

export const recipeRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        userId: ctx.session.user.email,
      },
    });
  })
  .query("getAll", {
    input: z.undefined(),
    async resolve() {
      const recipes = await prisma.recipe.findMany({
        select: { id: true, name: true },
      });
      return recipes;
    },
  })
  .query("getAllForCurrentUser", {
    async resolve({ ctx }) {
      const recipes = await prisma.recipe.findMany({
        select: { id: true, name: true },
        where: { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
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
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      await prisma.recipe.deleteMany({
        where: { id: input.id, userId: ctx.userId },
      });
    },
  })
  .mutation("import", {
    input: z.object({
      url: z.string().url(),
    }),
    async resolve({ input, ctx }) {
      const duplicate = await prisma.recipe.findFirst({
        where: {
          url: input.url,
          userId: ctx.userId,
        },
      });
      if (duplicate) throw "duplicate recipe";

      const processedRecipe = await recipeModule.processRecipeUrl(input.url);
      const created = await prisma.recipe.create({
        data: {
          ...processedRecipe,
          url: input.url,
          parsedName: processedRecipe.name,
          userId: ctx.userId,
        },
      });
      return created;
    },
  });
