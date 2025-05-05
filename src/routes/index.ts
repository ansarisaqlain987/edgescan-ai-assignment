import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { getSuccessSchema } from "../utils/index.js";

const postDataRouteConfig = createRoute({
  method: "post",
  path: "/content",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            text: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: getSuccessSchema(
            z.object({
              label: z.string().openapi({
                example: "Good",
              }),
              confidence: z.number().openapi({
                example: 23,
              }),
            })
          ),
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({
              default: false,
            }),
            error: z.object({
              name: z.string(),
              issues: z.array(
                z.object({
                  code: z.string(),
                  expected: z.string(),
                  received: z.string(),
                  path: z.array(z.string()),
                  message: z.string(),
                })
              ),
            }),
          }),
        },
      },
    },
  },
});

export const contentRoute = (app: OpenAPIHono) => {
  app.openapi(postDataRouteConfig, (c) => {
    const body = c.req.valid("json");
    console.log(body);
    return c.json(
      {
        success: true,
        data: {
          label: "Hello",
          confidence: 20,
          name: "Ultra-man 123",
        },
      },
      200
    );
  });

  return app;
};
