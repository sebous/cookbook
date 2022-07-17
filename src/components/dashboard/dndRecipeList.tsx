import { useDebounce } from "@/utils/hooks/useDebounce";
import { trpc } from "@/utils/trpc";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
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

  const [recipeOrder, setRecipeOrder] = useState<
    NonNullable<typeof recipes["data"]>
  >([]);

  useEffect(() => {
    if (recipes.data) {
      setRecipeOrder((orderedRecipes) => {
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

  if (!recipeOrder) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto">
      <Reorder.Group
        axis="y"
        values={recipeOrder.map((x) => x.id)}
        onReorder={(ids: string[]) => {
          if (!recipeOrder) return;
          const newOrder = [...recipeOrder];
          newOrder!.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
          setRecipeOrder(newOrder);
          debouncedReorder(newOrder.map((x, i) => ({ id: x.id, order: i })));
        }}
        onDragEnd={() => console.log("end")}
      >
        {recipeOrder.map((r) => (
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
