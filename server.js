"use strict";

import express from 'express'
import { join, dirname } from 'path'
import * as OpenApiValidator from 'express-openapi-validator'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

import Debug from './debugUtil.js'

import apiAuth from './auth/api-auth.js'

import courseRouter from "./courses/routes.js"
import clientRouter from "./clients/routes.js"

const debug = Debug('server')

// Constants
const PORT = 8080
const HOST = "0.0.0.0"

const apiSpec = join(dirname('.'), 'api.yml')

// App
const app = express()
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

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})
