import prisma from "@/backend/prisma";
import { setCacheHeader } from "@/utils/ssrHeader";
import type { inferAsyncReturnType } from "@trpc/server";
import type { GetServerSideProps, NextPage } from "next";

const getRecipeDetail = async (id: string) => {
  return prisma.recipe.findFirst({ where: { id } });
};

type RecipeQueryResult = inferAsyncReturnType<typeof getRecipeDetail>;

const RecipePage: NextPage<{ recipe: NonNullable<RecipeQueryResult> }> = ({
  recipe,
}) => {
  return (
    <article className="prose">
      <h2>{recipe.name}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: recipe.htmlBody }}
        className="pb-8"
      ></div>
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  setCacheHeader(60 * 10, 60 * 60, ctx.res);
  const { id } = ctx.query;

  if (!id || Array.isArray(id)) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  const recipe = await getRecipeDetail(id);
  if (!recipe) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  return {
    props: { recipe },
  };
};

export default RecipePage;
