import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Detail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || Array.isArray(id)) {
    return null;
  }

  const recipe = trpc.useQuery(["recipe-detail", { id }]);

  if (!recipe.data) {
    return <div>loading...</div>;
  }

  return (
    <article className="prose">
      <h2>{recipe.data.name}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: recipe.data.htmlBody }}
        className="pb-32"
      ></div>
    </article>
  );
};

export default Detail;
