# desarrollo-seguro-grupo-2

## SETUP

### Claves RSA para firmar el JWT

**Dejar passphrase en blanco!**

#### Clave privada
```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
```

#### Clave publica
```
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

#### Guardar las claves en el archivo .env encodeadas en base64

```
cat jwtRS256.key | base64 | sed 's/^/JWT_RS256_PRIV_B64="/' | sed 's/$/"/' >> .env
cat jwtRS256.key.pub | base64 | sed 's/^/JWT_RS256_PUB_B64="/' | sed 's/$/"/' >> .env
```

## TODO
- [ ] validar inputs
- [ ] revisar el dockerfile, encontrar una imagen con menos vulnerabilidades
- [ ] meter un action en el repo que escanee el dockerfile?
