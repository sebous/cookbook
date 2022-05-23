import { RecipeCard } from "@/components/dashboard/RecipeCard";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import { useState } from "react";
import { useQueryClient } from "react-query";

const Dashboard: NextPage = () => {
  const queryClient = useQueryClient();
  const recipes = trpc.useQuery(["all-recipes"]);
  const [url, setUrl] = useState("");

  const a = trpc.useMutation(["import-recipe"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["all-recipes"]);
    },
  });

  if (!recipes.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto mb-8 flex">
        <input
          className="input flex-1 mr-8 text-xl"
          type="text"
          placeholder="paste your url (https://some-bloated-cookbook.com/history-of-rice)"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
        <button className="btn" type="button" onClick={() => a.mutate({ url })}>
          {"process >>"}
        </button>
      </div>
      <div className="container mx-auto">
        {recipes.data.map((r) => (
          <RecipeCard name={r.name} key={r.id} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
