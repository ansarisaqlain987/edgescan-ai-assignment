import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { contentRoute } from "./routes/content.js";
import { connectToDb } from "./db/index.js";
import { authRoute } from "./routes/auth.js";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { prometheus } from "@hono/prometheus";
import type { FC } from "hono/jsx";

const app = new OpenAPIHono();

const { printMetrics, registerMetrics } = prometheus({
  collectDefaultMetrics: true,
});

app.use(secureHeaders());
app.use("*", requestId());
app.use(
  csrf({
    origin: ["myapp.example.com", "development.myapp.example.com"],
  })
);
app.use(logger());

app.use("*", registerMetrics);
app.get("/metrics", printMetrics);

const AboutApiPage = () => {
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.heading}>EdgescanAI API</h1>
        <p style={styles.paragraph}>
          This API was created to provide a simple and efficient way to manage
          and share data between applications. It is designed to be scalable,
          secure, and developer-friendly.
        </p>
        <p>
          Documentation can be found <a href="/ui">here</a>.
        </p>
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: "#f9fafb",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
  },
  container: {
    maxWidth: "600px",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#0f172a",
  },
  paragraph: {
    fontSize: "1.1rem",
    color: "#475569",
  },
};

app.get("/", (c) => {
  return c.html(<AboutApiPage />);
});

authRoute(app);
contentRoute(app);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

app.get("/ui", swaggerUI({ url: "/doc" }));

// connectToDb()
//   .then(() => {
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:`);
  }
);
// })
// .catch((err) => {
//   console.log(err);
//   console.log("\n\n\nError connecting to database");
//   return process.exit(0);
// });
