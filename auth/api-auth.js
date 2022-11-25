import passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as ClientCredentialsStrategy } from 'passport-oauth2-client-password'

import authServer from './auth-server.js'
import limiter from '../ratelimit/limiter.js'
import { getClient, verifySecret } from '../clients/db.js'
import { getToken } from '../tokens/db.js'
import { getUser } from '../users/db.js'

// setup api auth
export default app => {

  app.post("/token",
    limiter, // rate limit this endpoint
    authServer.token(),
    authServer.errorHandler()
  )

  // When using /token endpoint
  passport.use(new ClientCredentialsStrategy(
    (clientId, clientSecret, done) => {
      const client = getClient(clientId)
      if (client && !verifySecret(clientId, clientSecret)) return done(null, false)
      if (!client) return done(null, false)

      return done(null, client)
    }
  ));

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
}
