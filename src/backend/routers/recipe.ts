import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";
import { recipeModule } from "../modules/recipe";
import prisma from "../prisma";

export const recipeRouter = createRouter()
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
        select: { id: true, name: true, order: true },
        where: { userId: ctx.userId },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
      return recipes;
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
  .mutation("order", {
    input: z.array(z.object({ id: z.string(), order: z.number().min(0) })),
    async resolve({ ctx, input }) {
      const recipes = await prisma.recipe.findMany({
        select: { id: true },
        where: { userId: ctx.userId },
      });

      const dbRecipeIds = recipes.map((r) => r.id);

      if (
        input.length !== dbRecipeIds.length ||
        input.some((x) => !dbRecipeIds.includes(x.id))
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "requested recipe ids to order not matching recipe ids in db",
        });
      }

      await prisma.$transaction(
        input.map((x) =>
          prisma.recipe.update({ where: { id: x.id }, data: { ...x } })
        )
      );
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

      const maxOrderAggr = await prisma.recipe.aggregate({
        _max: { order: true },
        where: { userId: ctx.userId },
      });
      const { order: maxOrder } = maxOrderAggr._max;

      const created = await prisma.recipe.create({
        data: {
          ...processedRecipe,
          url: input.url,
          parsedName: processedRecipe.name,
          userId: ctx.userId,
          // if recipes are ordered, make new item last
          order: typeof maxOrder === "number" ? maxOrder + 1 : null,
        },
      });
      return created;
    },
  });
