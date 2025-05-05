import mongoose from "mongoose";

export const connectToDb = async () => {
  console.log("DB", process.env.DB_URL);
  return mongoose.connect(process.env.DB_URL || "", {
    ssl: false,
  });
};
