import { OpenAPIHono } from "@hono/zod-openapi";
import { loginRouteConfig } from "./openapi.js";
import { auth } from "../utils/auth.js";

export const authRoute = (app: OpenAPIHono) => {
  app.openapi(loginRouteConfig, async (c) => {
    try {
      const body: { email: string; password: string } = c.req.valid("json");
      const data = await auth.api.signInEmail({ body });
      return c.json(
        {
          success: true,
          data,
        },
        200
      );
    } catch (e) {
      console.log(e);
      return c.json(
        {
          success: false,
          error: "Internal Server Error",
        },
        500
      );
    }
  });

  return app;
};
