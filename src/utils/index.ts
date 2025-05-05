import { z } from "@hono/zod-openapi";
import Sentiment from "sentiment";
export const getSuccessSchema = (schema: z.ZodSchema) => {
  return z.object({
    success: z.boolean().openapi({ default: true }),
    data: schema,
  });
};

export const analyseString = (text: string) => {
  const s = new Sentiment();
  const resp = s.analyze(text);
  return resp;
};
