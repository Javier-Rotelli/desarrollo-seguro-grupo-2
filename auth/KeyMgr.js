import { readFileSync } from "fs";
import { join, dirname } from "path";

const PUB_KEY_PATH = join(dirname("."), "keys", "jwtRS256.key.pub");
const PRI_KEY_PATH = join(dirname("."), "keys", "jwtRS256.key");

const CERT_PATH = join(dirname("."), "certs", "https.cert");
const CERT_KEY_PATH = join(dirname("."), "certs", "https.key");

class KeyMgr {
  init() {
    try {
      this.pubkey = readFileSync(PUB_KEY_PATH, { encoding: "utf-8" });
      this.prikey = readFileSync(PRI_KEY_PATH, { encoding: "utf-8" });
      console.info(`Read keys ok.`);

      this.cert = readFileSync(CERT_PATH, { encoding: "utf-8" });
      this.certkey = readFileSync(CERT_KEY_PATH, { encoding: "utf-8" });
      console.info(`Cert and cert key ok.`);
    } catch (e) {
      throw new Error(`KeyMgr error`);
    }
  }

  getPubKey() {
    return this.pubkey;
  }
  getPubKeyB64() {
    return Buffer.from(this.getPubKey(), "utf-8").toString("base64");
  }

  getPriKey() {
    return this.prikey;
  }

  getCert() {
    return this.cert;
  }
  getCertKey() {
    return this.certkey;
  }
}

export default new KeyMgr();
