import { readFileSync, writeFileSync } from 'fs'

import { hash, compare } from '../cryptoUtil.js'

const USERS_FILE = 'data/users.json'
const users = JSON.parse(readFileSync(USERS_FILE, 'utf8'))

export const getUser = (username) => {
  return users.find(user => user.username === username)
}

// This is still unused... :/ maybe we could delete it
export const createUser = ({ password, ...rest } = {}) => {
  const newUser = { ...rest, password: hash(password) }
  users.push(newUser)
  writeFileSync(USERS_FILE, JSON.stringify(users.concat(newUser), null, "\t"))
}

export const verifyPassword = (username, password) => {
  const user = getUser(username)
  return user && compare(password, user.password)
}
