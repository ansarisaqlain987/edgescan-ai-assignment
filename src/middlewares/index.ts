import type { Context, Next } from "hono";
import { auth } from "../utils/auth.js";
import { rateLimiter } from "hono-rate-limiter";

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};

export const rateLimitterMiddleware = rateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    const token = c.req.header("authorization");
    const user: { id?: string } | undefined = c.get("user" as never) as object;
    return `${token}-${user?.id}`;
  },
});
