import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";
import { recipeModule } from "../modules/recipe";
import { db } from "../db";
import { createId } from "@paralleldrive/cuid2";

export const recipeRouter = createRouter()
  .query("getDetail", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const recipe = await db
        .selectFrom("Recipe")
        .selectAll()
        .where("id", "=", input.id)
        .executeTakeFirst();
      // const recipe = await prisma.recipe.findFirst({
      //   where: { id: input.id },
      // });
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
      const recipes = await db
        .selectFrom("Recipe")
        .select(["id", "name"])
        .execute();
      return recipes;
    },
  })
  .query("getAllForCurrentUser", {
    async resolve({ ctx }) {
      const recipes = await db
        .selectFrom("Recipe")
        .select(["id", "name", "order"])
        .where("userId", "=", ctx.userId)
        .orderBy("order")
        .orderBy("createdAt", "desc")
        .execute();

      return recipes;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      await db
        .deleteFrom("Recipe")
        .where("id", "=", input.id)
        .where("userId", "=", ctx.userId)
        .execute();
    },
  })
  .mutation("order", {
    input: z.array(z.object({ id: z.string(), order: z.number().min(0) })),
    async resolve({ ctx, input }) {
      const recipes = await db
        .selectFrom("Recipe")
        .select(["id"])
        .where("userId", "=", ctx.userId)
        .execute();

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

      db.transaction().execute(async () => {
        await Promise.allSettled(
          input.map((x) =>
            db
              .updateTable("Recipe")
              .set({ order: x.order })
              .where("id", "=", x.id)
              .execute()
          )
        );
      });
    },
  })
  .mutation("import", {
    input: z.object({
      url: z.string().url(),
    }),
    async resolve({ input, ctx }) {
      const duplicate = await db
        .selectFrom("Recipe")
        .select(["id"])
        .executeTakeFirst();
      if (duplicate) throw "duplicate recipe";

      const processedRecipe = await recipeModule.processRecipeUrl(input.url);

      const maxOrderValue = await db
        .selectFrom("Recipe")
        .select(["order"])
        .where("userId", "=", ctx.userId)
        .orderBy("order", "desc")
        .executeTakeFirst();

      // const created = await prisma.recipe.create({
      //   data: {
      //     ...processedRecipe,
      //     url: input.url,
      //     parsedName: processedRecipe.name,
      //     userId: ctx.userId,
      //     // if recipes are ordered, make new item last
      //     order: typeof maxOrder === "number" ? maxOrder + 1 : null,
      //   },
      // });
      const created = await db
        .insertInto("Recipe")
        .values({
          ...processedRecipe,
          id: createId(),
          url: input.url,
          parsedName: processedRecipe.name,
          userId: ctx.userId,
          // if recipes are ordered, make new item last
          order: typeof maxOrderValue === "number" ? maxOrderValue + 1 : null,
          updatedAt: new Date(),
        })
        .execute();
      return created;
    },
  });
