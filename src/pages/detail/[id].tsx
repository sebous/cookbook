import { trpc } from "@/utils/trpc";
import Markdown from "markdown-to-jsx";
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
    <div>
      <h2>{recipe.data.name}</h2>
      <Markdown>{recipe.data.markdownBody}</Markdown>
    </div>
  );
};

export default Detail;
