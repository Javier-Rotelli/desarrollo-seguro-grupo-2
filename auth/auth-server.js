import oauth2orize from 'oauth2orize'
import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import jwt from 'jsonwebtoken'

import { getUser, verifyPassword } from '../users/db.js'
import { getClient } from '../clients/db.js'
import { getToken, saveToken } from '../tokens/db.js'

const JWT_SECRET = 'ssshhhhh...sshhhhh'

const authServer = oauth2orize.createServer()

authServer.exchange(
  oauth2orize.exchange.password(
    (client, username, passwd, scope, reqBody, reqAuthInfo, issued) => {
      console.log(client, username, passwd, scope, reqBody, reqAuthInfo, issued)
      const user = getUser(username)
      if (!user || !verifyPassword(username, passwd)) return issued(null, false)

      issueTokens({ username }, issued)
    }
  )
)

authServer.exchange(
  oauth2orize.exchange.clientCredentials(
    (client, scope, done) => {
      // TODO: call issueTokens
      console.log('issue JWT!')
      console.log(client, scope)
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

const issueTokens = ({ username, clientId }, issued) => {

  if (username) {
    const user = getUser(username)

    // TODO: la firma de token esta SYNCH porque no quiero callbacks, el tema es que passport no se banca promises habria que wrappear?
    const makeToken = expiresIn => jwt.sign(
      { username },
      // sign with RSA SHA256
      // var privateKey = fs.readFileSync('private.key');
      // var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
      // TODO: use private key
      JWT_SECRET,
      // TODO: maybe use assymetric RS256 ?
      { algorithm: 'HS256', expiresIn }
    )

    const accessToken = makeToken('5m')
    const refreshToken = makeToken('20m')

    // store tokens
    saveToken({ username }, accessToken)
    saveToken({ username }, refreshToken)

    const params = { username: user.name }
    return issued(null, accessToken, refreshToken, params)
  } else if (clientId) {
    ;
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

// When using any secured endpoint
passport.use(new BearerStrategy(
  (accessToken, done) => {
    const token = getToken(accessToken)
    if (!token) return done(null, false)

    if (token.username) {
      const maybeUser = getUser(token.username)
      if (!maybeUser) return done(null, false)
      // TODO: maybe redeact user
      done(null, maybeUser)
    }
    if (token.clientId) {
      const maybeClient = getClient(token.clientId)
      if (!maybeClient) return done(null, false)
      // TODO: maybe redeact user
      done(null, maybeClient)
    }
  }
));

export default authServer