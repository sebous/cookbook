import prisma from "@/backend/prisma";
import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

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

  return {
    props: { recipe },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const recipes = await prisma.recipe.findMany({
    select: { id: true },
  });

  return {
    paths: recipes.map((r) => ({ params: { id: r.id } })),
    fallback: "blocking",
  };
};

export default RecipePage;
