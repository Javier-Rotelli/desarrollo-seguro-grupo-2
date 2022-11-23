import oauth2orize from 'oauth2orize'
import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { Strategy as BearerStrategy } from 'passport-http-bearer'

import { getUser, verifyPassword } from '../users/db.js'
import { getClient, verifySecret } from '../clients/db.js'
import { getToken } from '../tokens/db.js'

const authServer = oauth2orize.createServer()

authServer.exchange(
  oauth2orize.exchange.password(
    (client, username, passwd, scope, reqBody, reqAuthInfo, issued) => {
      // TODO: call issueTokens
      console.log('issue JWT!')
      console.log(client, username, passwd, scope, reqBody, reqAuthInfo, issued)
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

function issueTokens(userId, clientId, done) {
  // db.users.findById(userId, (error, user) => {
  //   // TODO: make jwt
  //   const accessToken = utils.getUid(256);
  //   const refreshToken = utils.getUid(256);
  //   db.accessTokens.save(accessToken, userId, clientId, (error) => {
  //     if (error) return done(error);
  //     db.refreshTokens.save(refreshToken, userId, clientId, (error) => {
  //       if (error) return done(error);
  //       // Add custom params, e.g. the username
  //       const params = { username: user.name };
  //       return done(null, accessToken, refreshToken, params);
  //     });
  //   });
  // });
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

// When using /token endpoint
passport.use(new BasicStrategy(
  (clientIdOrUserName, secretOrPassword, done) => {
    const user = getUser(clientIdOrUserName)
    if (user && !verifyPassword(clientIdOrUserName, secretOrPassword)) return done(null, false)

    const client = getClient(clientIdOrUserName)
    if (client && !verifySecret(clientIdOrUserName, secretOrPassword)) return done(null, false)

    if (!user && !client) return done(null, false)

    return done(null, user || client)
  }
))

// When using any other secured endpoint
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