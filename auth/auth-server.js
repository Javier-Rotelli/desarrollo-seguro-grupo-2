import oauth2orize from "oauth2orize";
import jwt from "jsonwebtoken";

import { getUser, verifyPassword } from "../users/db.js";
import { getClient, verifySecret } from "../clients/db.js";
import { saveToken } from "../tokens/db.js";

if (!process.env.JWT_RS256_PRIV_B64) {
  console.error(
    `ERROR! Please configure the JWT_RS256_PRIV_B64 env var with an base64 encoded RS256 private key.`
  );
  throw new Error(
    "Setup env var JWT_RS256_PRIV_B64 env var with an base64 encoded RS256 private key"
  );
}
const privateKey = Buffer.from(
  process.env.JWT_RS256_PRIV_B64,
  "base64"
).toString("ascii");

const authServer = oauth2orize.createServer();

authServer.exchange(
  oauth2orize.exchange.password(
    async (client, username, passwd, scope, reqBody, reqAuthInfo, issued) => {
      const user = await getUser(username);
      if (!user || !(await verifyPassword(username, passwd)))
        return issued(null, false);

      issueTokens({ username }, issued);
    }
  )
);

authServer.exchange(
  oauth2orize.exchange.clientCredentials(
    // first arg is client, which would be not null if authenticated by basic strat before,
    // but we do not use a previous basic strat because if not, when using Resource Owner Password
    // then you would also be required to provide a basic auth which is not the idea.
    // So we will get client credentials from the body here, and populate the client ourselves now.
    async (_, scope, body, authInfo, issued) => {
      const { client_id: clientId, client_secret: clientSecret } = body;
      const client = await getClient(clientId);
      if (client && !verifySecret(clientId, clientSecret))
        return issued(null, false);
      if (!client) return issued(null, false);

      issueTokens({ clientId: client.clientId }, issued);
    }
  )
);

// TODO: la firma de token esta SYNCH porque no quiero callbacks, el tema es que passport no se banca promises habria que wrappear?
const makeToken = (payload, expiresIn) =>
  jwt.sign(
    payload,
    // sign with RSA SHA256
    privateKey,
    { algorithm: "RS256", expiresIn }
  );

const issueTokenFor = (attr, context, issued) => {
  const payload = { [attr]: context[attr] };
  const accessToken = makeToken(payload, "5m");
  const refreshToken = makeToken(payload, "20m");

  // store tokens
  saveToken(payload, accessToken);
  saveToken(payload, refreshToken);

  return issued(null, accessToken, refreshToken, payload);
};
const issueTokens = (context, issued) => {
  if (context.username) {
    return issueTokenFor("username", context, issued);
  } else if (context.clientId) {
    return issueTokenFor("clientId", context, issued);
  } else {
    throw new Error("username or clientId are required to issue a token");
  }
};

authServer.serializeClient((clientOrUser, done) => {
  if (clientOrUser.username) return done(null, clientOrUser.username);
  return done(null, clientOrUser.clientId);
});

authServer.deserializeClient(async (identifier, done) => {
  const maybeUser = await getUser(identifier);
  if (maybeUser) return done(null, maybeUser);

  const maybeClient = getClient(identifier);
  if (maybeClient) return done(null, maybeClient);

  return done(new Error("DeserializeClient problem."));
});

export default authServer;
