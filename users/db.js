import { compare } from "../cryptoUtil.js";

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  username: String,
  password: String,
  name: String,
  surname: String,
  age: Number,
});

const User = mongoose.model("user", userSchema);

export const getUser = async (username) => {
  return User.findOne({ username: username });
};

// This is still unused... :/ maybe we could delete it
//export const createUser = ({ password, ...rest } = {}) => {
//  const newUser = { ...rest, password: hash(password) };
//  users.push(newUser);
//  writeFileSync(USERS_FILE, JSON.stringify(users.concat(newUser), null, "\t"));
//};

export const verifyPassword = async (username, password) => {
  const user = await getUser(username);
  return user && compare(password, user.password);
};
