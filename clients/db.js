import { hash, compare, apiSecret, uuid } from "../cryptoUtil.js";
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  username: String,
  clientId: String,
  app: String,
  clientSecret: String,
});

const Client = mongoose.model("client", clientSchema);

export const getClient = async (clientId) => {
  return Client.findOne({ clientId: clientId }).exec();
};

export const createClient = async (username, app) => {
  const plainSecret = apiSecret();
  const newClient = new Client({
    username,
    app,
    clientId: uuid(),
    clientSecret: hash(plainSecret),
  });
  await newClient.save();
  return { newClient: newClient.toObject(), plainSecret };
};

export const verifySecret = async (clientId, clientSecret) => {
  const client = await getClient(clientId);
  return client !== null && compare(clientSecret, client.clientSecret);
};
