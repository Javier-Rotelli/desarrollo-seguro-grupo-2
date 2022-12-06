import mongoose from "mongoose";

// supressing mongo warning
mongoose.set("strictQuery", false);

let dbConnection = undefined;

export const getDB = async () => {
  if (dbConnection !== undefined) {
    return dbConnection;
  }
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOSTNAME || "127.0.0.1";
  const port = process.env.MONGO_PORT || 27017;
  const db = process.env.MONGO_DB;

  dbConnection = await mongoose.connect(
    `mongodb://${username}:${password}@${host}:${port}/${db}`
  );
  return dbConnection;
};
