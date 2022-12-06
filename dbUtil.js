import mongoose from "mongoose";

let dbConnection = undefined;

export const getDB = async () => {
  if (dbConnection !== undefined) {
    return dbConnection;
  }
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const db = process.env.MONGO_DB;

  dbConnection = await mongoose.connect(
    `mongodb://${username}:${password}@127.0.0.1:27017/${db}`
  );
  return dbConnection;
};
