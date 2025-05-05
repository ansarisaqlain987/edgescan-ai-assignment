import { z } from "@hono/zod-openapi";
export const getSuccessSchema = (schema: z.ZodSchema) => {
  return z.object({
    success: z.boolean().openapi({ default: true }),
    data: schema,
  });
};
