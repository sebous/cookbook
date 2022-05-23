import { RecipeCard } from "@/components/dashboard/RecipeCard";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "react-query";

const Dashboard: NextPage = () => {
  const queryClient = useQueryClient();
  const recipes = trpc.useQuery(["all-recipes"]);
  const [url, setUrl] = useState("");

  const importRecipe = trpc.useMutation(["import-recipe"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["all-recipes"]);
    },
  });

  if (!recipes.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {importRecipe.isError && (
        <div className="container mx-auto mb-8 flex">
          <div
            className="alert alert-error shadow-lg rounded-lg"
            onClick={() => importRecipe.reset()}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <b>{"You're dead!"}</b> {importRecipe.error.message}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto mb-8 flex">
        <input
          className="input flex-1 mr-8 text-xl"
          type="text"
          placeholder="paste your url (https://some-bloated-cookbook.com/history-of-rice)"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
        <button
          className="btn"
          type="button"
          onClick={() => importRecipe.mutate({ url })}
        >
          {"process >>"}
        </button>
      </div>
      <div className="container mx-auto">
        {recipes.data.map((r) => (
          <Link href={`/detail/${r.id}`} key={r.id}>
            <a>
              <RecipeCard name={r.name} />
            </a>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
