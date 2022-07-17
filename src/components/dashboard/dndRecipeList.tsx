import { useDebounce } from "@/utils/hooks/useDebounce";
import { trpc } from "@/utils/trpc";
import { MotionConfig, Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { useBreakpoint } from "use-breakpoint";
import { Loader } from "../layout/Loader";
import { RecipeCard } from "./RecipeCard";

export const DndRecipeList = () => {
  const trpcUtils = trpc.useContext();
  const recipes = trpc.useQuery(["recipe.getAllForCurrentUser"], {
    staleTime: 60,
  });

  const deleteRecipe = trpc.useMutation(["recipe.delete"], {
    onSuccess: () => {
      trpcUtils.invalidateQueries(["recipe.getAllForCurrentUser"]);
    },
    onMutate: async ({ id }) => {
      await trpcUtils.cancelQuery(["recipe.getAllForCurrentUser"]);
      trpcUtils.setQueryData(["recipe.getAllForCurrentUser"], (recipes) =>
        recipes ? recipes.filter((r) => r.id !== id) : []
      );
    },
  });

  const reorder = trpc.useMutation(["recipe.order"], {
    onSuccess: () => {
      trpcUtils.invalidateQueries(["recipe.getAllForCurrentUser"]);
    },
    onMutate: async (orderInput) => {
      await trpcUtils.cancelQuery(["recipe.getAllForCurrentUser"]);
      trpcUtils.setQueryData(["recipe.getAllForCurrentUser"], (recipes) =>
        recipes
          ? recipes?.map((r) => ({
              ...r,
              order: orderInput.find((o) => o.id === r.id)?.order ?? null,
            }))
          : []
      );
    },
  });

  const debouncedReorder = useDebounce(reorder.mutate, 600);

  // track the current order of the recipes
  const [localRecipesOrdered, setLocalRecipesOrdered] = useState<
    NonNullable<typeof recipes["data"]>
  >([]);

  // sync the local order with the server data
  useEffect(() => {
    if (recipes.data) {
      setLocalRecipesOrdered((orderedRecipes) => {
        if (orderedRecipes.length === 0) {
          return recipes.data;
        }
        return [
          ...orderedRecipes.filter((x) =>
            recipes.data.map((r) => r.id).includes(x.id)
          ),
          ...recipes.data.filter(
            (x) => !orderedRecipes.map((r) => r.id).includes(x.id)
          ),
        ];
      });
    }
  }, [recipes.data]);

  if (localRecipesOrdered.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto">
      <Reorder.Group
        axis="y"
        values={localRecipesOrdered.map((x) => x.id)}
        onDrag={(e) => console.log(e)}
        onReorder={(ids: string[]) => {
          if (!localRecipesOrdered) return;
          const newOrder = [...localRecipesOrdered];
          newOrder.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
          setLocalRecipesOrdered(newOrder);
          debouncedReorder(newOrder.map((x, i) => ({ id: x.id, order: i })));
        }}
      >
        {localRecipesOrdered.map((r) => (
          <RecipeCard
            deleteFn={() => deleteRecipe.mutate({ id: r.id })}
            key={r.id}
            id={r.id}
            name={r.name}
          />
        ))}
      </Reorder.Group>
    </div>
  );
};
