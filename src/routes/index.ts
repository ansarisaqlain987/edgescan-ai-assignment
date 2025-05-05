import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { analyseString, getSuccessSchema } from "../utils/index.js";
import { KittenModel } from "../models/user.js";

const responseSchema = z.object({
  score: z.number().openapi({
    example: 23,
  }),
  comparative: z.number().openapi({
    example: 23,
  }),
  calculation: z.array(z.record(z.string(), z.number())),
  tokens: z.array(z.string()),
  words: z.array(z.string()),
  positive: z.array(z.string()),
  negative: z.array(z.string()),
});

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
          schema: z.object({
            success: z.boolean().openapi({ default: true }),
            data: responseSchema,
          }),
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
  app.openapi(postDataRouteConfig, async (c) => {
    try {
      const body = c.req.valid("json");
      const x = analyseString(body.text);
      const data = await KittenModel.find();
      console.log(data);
      return c.json(
        {
          success: true,
          data: x,
        },
        200
      );
    } catch (e) {
      console.log(e);
      return c.json(
        {
          success: false,
          error: e,
        },
        400
      );
    }
  });

  return app;
};
