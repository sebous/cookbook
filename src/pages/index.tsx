import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const recipes = trpc.useQuery(["all-recipes"]);

  if (!recipes.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {recipes.data.map((r) => (
        <p key={r.id}>
          {r.id} {r.name}
        </p>
      ))}
    </div>
  );
};

export default Home;
