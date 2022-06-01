import type { ServerResponse } from "http";

export function setCacheHeader(
  maxAgeSec: number,
  swrSec: number,
  res: ServerResponse
) {
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${maxAgeSec}, stale-while-revalidate=${swrSec}`
  );
}
