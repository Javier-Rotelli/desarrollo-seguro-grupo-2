"use strict";

import express from 'express'
import https from 'https'
import { join, dirname } from 'path'
import * as OpenApiValidator from 'express-openapi-validator'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import helmet from "helmet";
import hpp from "hpp";

import apiAuth from './auth/api-auth.js'
import KeyMgr from './auth/KeyMgr.js'

import courseRouter from "./courses/routes.js"
import clientRouter from "./clients/routes.js"

import Debug from './debugUtil.js'
const debug = Debug('server')

// Constants
const PORT = 8080
const HOST = "0.0.0.0"

const apiSpec = join(dirname('.'), 'api.yml')

// App
const app = express()
// headers seguros por default
app.use(helmet());

// TODO: chequear si seguiria haciendo falta hpp si es que le agregamos un schema con validacion a la API
// prevenir contaminacion de parametros http
// https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html#prevent-http-parameter-pollution
app.use(hpp({}));

// reduciendo la informacion que damos
app.disable("x-powered-by");
// Body parsers for the supported API payloads
app.use(express.json())

const apiSpecYaml = YAML.load(apiSpec)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpecYaml))

// Validator middleware goes before validated routes
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  })
)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // openapi-validator error handler mas generico
  // format error
  debug(`${err.status}: ${err.message}\n${JSON.stringify(err.errors, null, 2)}`)
  res.status(err.status || 500).json({
    status: err.status,
    message: err.message
  })
})

// Validated routes
// Setup Api Auth
apiAuth(app)

app.head('/', (req, res) => {
  res.status(200).send()
})
app.get('/', (req, res) => {
  const r = { status: "up!", version: process.env.npm_package_version }
  res.json(r)
})
app.use("/Course", courseRouter)
app.use("/Client", clientRouter)

KeyMgr.init()

const server = https.createServer(
  {
    key: KeyMgr.getCertKey(),
    cert: KeyMgr.getCert()
  },
  app
).listen(PORT, HOST, () => {
  console.info(`Running on https://${HOST}:${PORT} with TLS`)
})

server.on('error', e => {
  console.error('error server: ', e.code, e.message)
})
