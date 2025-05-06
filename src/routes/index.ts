import { z } from "@hono/zod-openapi";

export const internalServerErrorSchema = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: z.object({
        success: z.boolean().openapi({ default: false }),
        error: z.string().openapi({ default: "Internal Server Error" }),
      }),
    },
  },
};

export const unauthorisedErrorSchema = {
  description: "Unauthorised",
  content: {
    "application/json": {
      schema: z.object({
        success: z.boolean().openapi({ default: false }),
        error: z.string().openapi({ default: "Unauthorised" }),
      }),
    },
  },
};

export const badRequestErrorSchema = {
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
};

export const successSchema = (schema: z.ZodSchema) => {
  return {
    description: "OK",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().openapi({ default: true }),
          data: schema,
        }),
      },
    },
  };
};

export const requestBodySchema = (schema: z.ZodSchema) => {
  return {
    content: {
      "application/json": {
        schema: schema,
      },
    },
    required: true,
  };
};
