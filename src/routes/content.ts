import { OpenAPIHono } from "@hono/zod-openapi";
import { analyseString } from "../utils/index.js";
import {
  authMiddleware,
  rateLimitterMiddleware,
} from "../middlewares/index.js";
import { ContentModel } from "../models/content.js";
import { createContentRouteConfig, getContentRouteConfig } from "./openapi.js";

type User = {
  name: string;
  email: string;
  id: string;
};

export const contentRoute = (app: OpenAPIHono) => {
  app.use(
    createContentRouteConfig.getRoutingPath(),
    authMiddleware,
    rateLimitterMiddleware
  );
  app.openapi(createContentRouteConfig, async (c) => {
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
          error: "Internal Server Error",
        },
        500
      );
    }
  });

  app.use(
    getContentRouteConfig.getRoutingPath(),
    authMiddleware,
    rateLimitterMiddleware
  );
  app.openapi(getContentRouteConfig, async (c) => {
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
          error: "Internal Server Error",
        },
        500
      );
    }
  });

  return app;
};
