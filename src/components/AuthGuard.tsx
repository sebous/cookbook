import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";

export const AuthGuard = ({ children }: PropsWithChildren<{}>) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session, status);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/signin");
  }

  if (session && status === "authenticated") {
    return <>{children}</>;
  }
  return null;
};
