import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import { Loader } from "./layout/Loader";

export const AuthGuard = ({ children }: PropsWithChildren<{}>) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
  }

  if (session && status === "authenticated") {
    return <>{children}</>;
  }
  return null;
};
