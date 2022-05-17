import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const recipes = trpc.useQuery(["all-recipes"]);

  if (!recipes.data) {
    return <div>Loading...</div>;
  }

  console.log(recipes.data);
  return (
    <div className={styles.container}>
      {recipes.data.map((r) => (
        <p key={r.id}>
          {r.id} {r.name}
        </p>
      ))}
    </div>
  );
};

export default Home;
