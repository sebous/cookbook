import type { NextApiRequest, NextApiResponse } from "next";

const payload = { "0": { json: null, meta: { values: ["undefined"] } } };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	await fetch(
		`${getBaseUrl()}/api/trpc/ping?batch=1&input=${encodeURIComponent(
			JSON.stringify(payload),
		)}`,
	);
	res.json({ ping: "pong" });
}

function getBaseUrl() {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
