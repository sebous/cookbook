import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";
import type trpc from "@trpc/server";

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getSession({ req });
  return {
    req,
    res,
    session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
