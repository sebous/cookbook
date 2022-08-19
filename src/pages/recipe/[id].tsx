import prisma from "@/backend/prisma";
import { ShareBtn } from "@/components/ShareBtn";
import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { NextAppPage } from "../_app";

const getRecipeDetail = async (id: string) => {
  return prisma.recipe.findFirst({ where: { id } });
};

type RecipeQueryResult = inferAsyncReturnType<typeof getRecipeDetail>;

const RecipePage: NextAppPage<{
  recipe: NonNullable<RecipeQueryResult>;
}> = ({ recipe }) => {
  return (
    <article className="prose pl-2 pr-2">
      <div className="flex flex-row items-center">
        <h2>{recipe.name}</h2>
        <div className="flex-1">
          <ShareBtn />
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: recipe.htmlBody }}
        className="pb-8"
      ></div>
    </article>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.["id"];

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

  // using ISR
  return {
    props: { recipe },
    revalidate: 60 * 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default RecipePage;
