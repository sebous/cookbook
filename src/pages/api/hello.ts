// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/backend/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const recipes = await prisma.recipe.findMany();
  res.status(200).json({ recipes });
}
