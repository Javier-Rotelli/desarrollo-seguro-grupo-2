import { readFileSync } from "fs"

const data = JSON.parse(readFileSync("data/clients.json", "utf8"))

export const getClient = (clientId) => {
  return data.find(client => client.clientId === clientId)
}

export const verifySecret = (clientId, clientSecret) => {
  const client = getClient(clientId)
  // TODO: crypt password
  return client && client.clientSecret === clientSecret
}
