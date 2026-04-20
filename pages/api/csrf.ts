import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "../../lib/csrf";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, timestamp } = generateToken();
  return res.status(200).json({ token, timestamp });
}
