import mongoose from "mongoose";
import { getDatabaseString } from "../utils/index.js";

export const connectToDb = async () => {
  const DB_URL = getDatabaseString();
  console.log("DB", DB_URL);
  return mongoose.connect(DB_URL || "", {});
};
