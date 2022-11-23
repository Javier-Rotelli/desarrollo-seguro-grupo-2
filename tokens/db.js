import { readFileSync } from "fs"

const data = JSON.parse(readFileSync("data/tokens.json", "utf8"))

export const getToken = (accessToken) => {
  return data.find(token => token.token === accessToken)
}
