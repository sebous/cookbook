import { RecipeCard, UrlInput } from "@/components/dashboard";
import { Loader } from "@/components/layout/Loader";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import type { NextAppPage } from "./_app";

const Dashboard: NextAppPage = () => {
  const trpcUtils = trpc.useContext();
  const recipes = trpc.useQuery(["recipe.getAllForCurrentUser"], {
    staleTime: 60,
  });

  const importRecipe = trpc.useMutation(["recipe.import"], {
    onSuccess: () => {
      trpcUtils.invalidateQueries(["recipe.getAllForCurrentUser"]);
    },
  });

  if (!recipes.data) {
    return <Loader />;
  }

  return (
    <div className="flex-1">
      <div className="container mx-auto mb-8 flex">
        <UrlInput
          submitFn={(url) => importRecipe.mutate({ url })}
          isLoading={importRecipe.isLoading}
        />
      </div>
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
      <div className="container mx-auto">
        {recipes.data.map((r) => (
          <Link href={`/recipe/${r.id}`} key={r.id}>
            <a>
              <RecipeCard name={r.name} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

Dashboard.requireAuth = true;

export default Dashboard;
