import { OpenAPIHono } from "@hono/zod-openapi";
import { loginRouteConfig, signupRouteConfig } from "./openapi.js";
import { auth } from "../utils/auth.js";

export const authRoute = (app: OpenAPIHono) => {
  app.openapi(loginRouteConfig, async (c) => {
    try {
      const body: { email: string; password: string } = c.req.valid("json");

      const x = await auth.api
        .signInEmail({ body })
        .then((data) => {
          return { data, error: null };
        })
        .catch((e) => {
          const error = JSON.parse(JSON.stringify(e));
          return {
            error: error?.body?.message ?? "Unknown error",
            data: null,
          };
        });

      if (x.error) {
        return c.json(
          {
            success: false,
            error: x.error,
          },
          x.error.status
        );
      }
      return c.json(
        {
          success: true,
          data: x.data,
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

  app.openapi(signupRouteConfig, async (c) => {
    try {
      const body: { email: string; password: string; name: string } =
        c.req.valid("json");

      const data = await auth.api
        .signUpEmail({ body })
        .then((data) => {
          return { data, error: null };
        })
        .catch((err) => {
          const error = JSON.parse(JSON.stringify(err));
          return {
            error: error?.body?.message ?? "Unknown error",
            data: null,
          };
        });

      if (data.error) {
        return c.json(
          {
            success: false,
            error: data.error,
          },
          422
        );
      }

      return c.json(
        {
          success: true,
          data,
        },
        200
      );
    } catch (e) {
      const error = JSON.parse(JSON.stringify(e));
      console.log(error);
      const code = (error?.body?.code as string) || "";
      const status = (error?.statusCode as number) || 500;
      if (code && status === 422) {
        return c.json(
          {
            success: false,
            error: "User already exists",
          },
          status
        );
      }
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
