import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { bearer } from "better-auth/plugins";
import { getDatabaseString } from "./index.js";

const DB_URL = getDatabaseString();
const client = new MongoClient(DB_URL || "");
const db = client.db();

export const auth = betterAuth({
  rateLimit: {
    enabled: false,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  database: mongodbAdapter(db),
  plugins: [bearer()],
});
