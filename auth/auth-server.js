import oauth2orize from 'oauth2orize'
import jwt from 'jsonwebtoken'

import { getUser, verifyPassword } from '../users/db.js'
import { getClient, verifySecret } from '../clients/db.js'
import { saveToken } from '../tokens/db.js'

const JWT_SECRET = 'ssshhhhh...sshhhhh'

const authServer = oauth2orize.createServer()

authServer.exchange(
  oauth2orize.exchange.password(
    (client, username, passwd, scope, reqBody, reqAuthInfo, issued) => {
      const user = getUser(username)
      if (!user || !verifyPassword(username, passwd)) return issued(null, false)

      issueTokens({ username }, issued)
    }
  )
)

authServer.exchange(
  oauth2orize.exchange.clientCredentials(
    // first arg is client, which would be not null if authenticated by basic strat before,
    // but we do not use a previous basic strat because if not, when using Resource Owner Password
    // then you would also be required to provide a basic auth which is not the idea.
    // So we will get client credentials from the body here, and populate the client ourselves now.
    (_, scope, body, authInfo, issued) => {
      const { client_id: clientId, client_secret: clientSecret } = body
      const client = getClient(clientId)
      if (client && !verifySecret(clientId, clientSecret)) return issued(null, false)
      if (!client) return issued(null, false)

      issueTokens({ clientId: client.clientId }, issued)
    }
  )
)

// issue new tokens and remove the old ones
authServer.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  // db.refreshTokens.find(refreshToken, (error, token) => {
  //   if (error) return done(error);
  //   issueTokens(token.id, client.id, (err, accessToken, refreshToken) => {
  //     if (err) {
  //       done(err, null, null);
  //     }
  //     db.accessTokens.removeByUserIdAndClientId(token.userId, token.clientId, (err) => {
  //       if (err) {
  //         done(err, null, null);
  //       }
  //       db.refreshTokens.removeByUserIdAndClientId(token.userId, token.clientId, (err) => {
  //         if (err) {
  //           done(err, null, null);
  //         }
  //         done(null, accessToken, refreshToken);
  //       });
  //     });
  //   });
  // });
}));

// TODO: la firma de token esta SYNCH porque no quiero callbacks, el tema es que passport no se banca promises habria que wrappear?
const makeToken = (payload, expiresIn) => jwt.sign(
  payload,
  // sign with RSA SHA256
  // var privateKey = fs.readFileSync('private.key');
  // var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
  // TODO: use private key
  JWT_SECRET,
  // TODO: maybe use assymetric RS256 ?
  { algorithm: 'HS256', expiresIn }
)

const issueTokens = ({ username, clientId }, issued) => {
  if (username) {
    const payload = { username }
    const accessToken = makeToken(payload, '5m')
    const refreshToken = makeToken(payload, '20m')

    // store tokens
    saveToken(payload, accessToken)
    saveToken(payload, refreshToken)

    return issued(null, accessToken, refreshToken, payload)
  } else if (clientId) {
    // TODO: casi todo el codigo copiado, podria ser un toque distinto o reusar
    const payload = { clientId }
    const accessToken = makeToken(payload, '5m')
    const refreshToken = makeToken(payload, '20m')

    // store tokens
    saveToken(payload, accessToken)
    saveToken(payload, refreshToken)

    return issued(null, accessToken, refreshToken, payload)
  } else {
    throw new Error('username or clientId are required to issue a token')
  }
}

authServer.serializeClient((clientOrUser, done) => {
  if (clientOrUser.username) return done(null, clientOrUser.username)
  return done(null, clientOrUser.clientId)
})

authServer.deserializeClient((identifier, done) => {
  const maybeUser = getUser(identifier)
  if (maybeUser) return done(null, maybeUser)

  const maybeClient = getClient(identifier)
  if (maybeClient) return done(null, maybeClient)

  return done(new Error('DeserializeClient problem.'))
})

export default authServer