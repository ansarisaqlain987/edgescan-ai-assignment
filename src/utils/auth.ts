import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { bearer } from "better-auth/plugins";

const client = new MongoClient(process.env.DB_URL || "");
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
