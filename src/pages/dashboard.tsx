import { RecipeCard } from "@/components/dashboard/RecipeCard";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";

const Dashboard: NextPage = () => {
  const recipes = trpc.useQuery(["all-recipes"]);

  if (!recipes.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      {recipes.data.map((r) => (
        <RecipeCard name={r.name} key={r.id} />
      ))}
    </div>
  );
};

export default Dashboard;
