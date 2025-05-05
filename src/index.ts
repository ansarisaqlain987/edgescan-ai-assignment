import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";

import { OpenAPIHono } from "@hono/zod-openapi";
import { contentRoute } from "./routes/index.js";

const app = new OpenAPIHono();

contentRoute(app);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

app.get("/ui", swaggerUI({ url: "/doc" }));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
