import { readFileSync } from "fs"

const data = JSON.parse(readFileSync("data/users.json", "utf8"))

export const getUser = (username) => {
  return data.find(user => user.username === username)
}

export const verifyPassword = (username, password) => {
  const user = getUser(username)
  // TODO: crypt password
  return user && user.password === password
}
