"use strict";
import express from 'express'

import apiAuth from './auth/api-auth.js'

import courseRouter from "./courses/routes.js"

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
app.use(express.json());

// Setup Api Auth
apiAuth(app)

// reduciendo la informacion que damos
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/Course", courseRouter);

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
