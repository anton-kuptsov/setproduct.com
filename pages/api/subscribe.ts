import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import SubscribeEmail from "../../emails/SubscribeEmail";
import { rateLimit, getClientIp } from "../../lib/rateLimit";
import { verifyToken } from "../../lib/csrf";

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_ORIGINS = [
  "https://setproduct.com",
  "https://www.setproduct.com",
  "http://localhost:3000",
];

type ResponseData = {
  success?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const origin = req.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const ip = getClientIp(req);
  const limit = rateLimit(ip, 1, 3);
  if (!limit.allowed) {
    return res.status(429).json({ error: limit.reason });
  }

  const { email, website, _token, _timestamp } = req.body;

  if (website) {
    return res.status(400).json({ error: "Invalid submission" });
  }

  const csrf = verifyToken(_token, _timestamp);
  if (!csrf.valid) {
    return res.status(403).json({ error: csrf.reason });
  }

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await resend.emails.send({
      from: "Setproduct <contact@setproduct.com>",
      to: "steambot33+sub@gmail.com",
      subject: `New subscriber: ${email}`,
      react: SubscribeEmail({ email }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Subscribe email error:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
}
