import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const IndexPage: NextPage = ({}) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  });

  return (
    <div>
      <button onClick={() => signIn()}>sign in</button>
    </div>
  );
};

export default IndexPage;
