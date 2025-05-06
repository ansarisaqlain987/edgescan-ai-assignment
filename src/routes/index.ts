import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { analyseString } from "../utils/index.js";
import { authMiddleware } from "../middlewares/index.js";
import { ContentModel } from "../models/content.js";

type User = {
  name: string;
  email: string;
  id: string;
};
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
  path: "/api/content",
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
  middlewares: [authMiddleware] as const,
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

const getResponseSchema = z.object({
  _id: z.string(),
  text: z.string(),
  response: responseSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const getDataRouteConfig = createRoute({
  method: "get",
  path: "/api/content",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ default: true }),
            data: z.array(getResponseSchema),
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
  app.use(postDataRouteConfig.getRoutingPath(), authMiddleware);
  app.openapi(postDataRouteConfig, async (c) => {
    try {
      const body = c.req.valid("json");
      const user: User = c.get("user" as never);
      const x = analyseString(body.text);
      const data = await ContentModel.create({
        userId: user.id,
        text: body.text,
        response: x,
      });
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

  app.use(getDataRouteConfig.getRoutingPath(), authMiddleware);
  app.openapi(getDataRouteConfig, async (c) => {
    try {
      const user: User = c.get("user" as never);
      const data = await ContentModel.find({ userId: user.id }).select({
        _id: 1,
        text: 1,
        response: 1,
        createdAt: 1,
        updatedAt: 1,
      });
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
          error: e,
        },
        400
      );
    }
  });

  return app;
};
