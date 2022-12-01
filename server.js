"use strict";

import express from "express";
import helmet from "helmet";
import hpp from "hpp";

import apiAuth from './auth/api-auth.js'

import courseRouter from "./courses/routes.js"
import clientRouter from "./clients/routes.js"

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
// headers seguros por default
app.use(helmet());

app.use(express.json());

// TODO: chequear si seguiria haciendo falta hpp si es que le agregamos un schema con validacion a la API
// prevenir contaminacion de parametros http
// https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html#prevent-http-parameter-pollution
app.use(hpp({}));

// Setup Api Auth
apiAuth(app)

// reduciendo la informacion que damos
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/Course", courseRouter)
app.use("/Client", clientRouter)

// Cambio los handlers por defecto para evitar dar informacion
// de la plataforma
app.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
