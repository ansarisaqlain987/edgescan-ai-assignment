import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middlewares/index.js";
import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  requestBodySchema,
  successSchema,
  unauthorisedErrorSchema,
  unprocessableEntityErrorSchema,
} from "./index.js";

export const createContentSchema = z.object({
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

export const createContentRouteConfig = createRoute({
  method: "post",
  path: "/api/content",
  request: {
    body: requestBodySchema(z.object({ text: z.string() })),
    headers: z.object({
      Authorization: z.string().openapi({ default: "<token>" }),
    }),
  },
  middlewares: [authMiddleware] as const,
  responses: {
    200: successSchema(createContentSchema),
    400: badRequestErrorSchema,
    401: unauthorisedErrorSchema,
    500: internalServerErrorSchema,
  },
});

export const getContentsSchema = z.object({
  _id: z.string(),
  text: z.string(),
  response: createContentSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getContentRouteConfig = createRoute({
  method: "get",
  path: "/api/content",
  request: {
    headers: z.object({
      Authorization: z.string().openapi({ default: "<token>" }),
    }),
  },
  responses: {
    200: successSchema(z.array(getContentsSchema)),
    401: unauthorisedErrorSchema,
    500: internalServerErrorSchema,
  },
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginRouteConfig = createRoute({
  method: "post",
  path: "/api/auth/sign-in/email",
  request: {
    body: requestBodySchema(loginSchema),
  },
  responses: {
    200: successSchema(
      z.object({
        token: z.string(),
        redirect: z.boolean().openapi({ default: false }),
        user: z.object({
          name: z.string(),
          email: z.string(),
          id: z.string(),
          image: z.string().or(z.null()).optional(),
          emailVerified: z.boolean(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
        url: z.string().optional(),
      })
    ),
    400: badRequestErrorSchema,
    401: unauthorisedErrorSchema,
    500: internalServerErrorSchema,
  },
});

export const signupSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
});

export const signupRouteConfig = createRoute({
  method: "post",
  path: "/api/auth/sign-up/email",
  request: {
    body: requestBodySchema(signupSchema),
  },
  responses: {
    200: successSchema(z.object({ token: z.string() })),
    400: badRequestErrorSchema,
    422: unprocessableEntityErrorSchema,
    500: internalServerErrorSchema,
  },
});
