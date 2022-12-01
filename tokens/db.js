import { readFileSync, writeFileSync } from "fs"

const TOKENS_FILE = "data/tokens.json"
const encoding = "utf8"
const data = () => JSON.parse(readFileSync(TOKENS_FILE, encoding))

export const getToken = token => {
  return data().find(some => some.token === token)
}

const newToken = ({ token, username, clientId }) => {
  const payload = token.split('.')[1]
  const { iat, exp } = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
  return {
    token,
    username,
    clientId,
    iat,
    exp
  }
}

const stringifyNicely = x => JSON.stringify(x, null, 2)

export const saveToken = ({ username, clientId }, token) =>
  writeFileSync(
    TOKENS_FILE,
    stringifyNicely(
      data().concat(newToken({ username, clientId, token }))
    ),
    { encoding }
  )
