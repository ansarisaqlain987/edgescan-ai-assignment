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

export const getDatabaseString = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const DB_NAME = process.env.DB_NAME;
  const DB_USER = process.env.DB_USER;
  const DB_PASS = process.env.DB_PASS;
  const DB_HOST = process.env.DB_HOST;

  if (isProduction) {
    return `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?authSource=admin`;
  }

  return `mongodb://${DB_USER}:${DB_PASS}@host.docker.internal:27017/${DB_NAME}?authSource=admin`;
};
