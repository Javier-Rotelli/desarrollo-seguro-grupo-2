import { readFileSync, writeFileSync } from 'fs'

import { hash, compare, apiSecret, uuid } from '../cryptoUtil.js'

const CLIENTS_FILE = 'data/clients.json'
const clients = JSON.parse(readFileSync(CLIENTS_FILE, 'utf8'))

export const getClient = (clientId) => {
  return clients.find(client => client.clientId === clientId)
}

export const createClient = (username, app) => {
  const plainSecret = apiSecret()
  const newClient = { username, app, clientId: uuid(), clientSecret: hash(plainSecret) }
  clients.push(newClient)
  writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, "\t"))
  return { newClient, plainSecret }
}

export const verifySecret = (clientId, clientSecret) => {
  const client = getClient(clientId)
  return client && compare(clientSecret, client.clientSecret)
}
