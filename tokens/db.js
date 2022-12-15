import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: String,
  username: String,
  clientId: String,
  iat: Number,
  exp: Number,
});

const Token = mongoose.model("token", tokenSchema);

export const getToken = async (token) => {
  return Token.findOne({ token: token });
};

const newToken = ({ token, username, clientId }) => {
  const payload = token.split(".")[1];
  const { iat, exp } = JSON.parse(
    Buffer.from(payload, "base64").toString("utf8")
  );
  return {
    token,
    username,
    clientId,
    iat,
    exp,
  };
};

export const saveToken = async ({ username, clientId }, token) => {
  const tk = new Token(newToken({ username, clientId, token }));
  await tk.save();
  return tk;
};
