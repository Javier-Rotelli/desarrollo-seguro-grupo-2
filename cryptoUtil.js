import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import crypto from "crypto";

const saltRounds = 10;

export const hash = (plain) => bcrypt.hashSync(plain, saltRounds);
export const compare = (plain, hashed) => bcrypt.compareSync(plain, hashed);

export const uuid = () => crypto.randomUUID();
export const apiSecret = () => nanoid(36);
