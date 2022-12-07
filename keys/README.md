# Claves RSA para firmar el JWT

Si recibiste las claves guardarlas en este directorio con los siguientes nombres:

* `jwtRS256.key` para la clave privada
* `jwtRS256.key.pub` para la clave publica

Si no las recibiste, o queres usar nuevas claves podes crear unas nuevas asi:

**Dejar passphrase en blanco!**

## Clave privada
```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
```

## Clave publica
```
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

**Importante: asegurarse que los archivos de claves esten en este directorio con el nombre correcto, porque sino el servidor no arranca.**

En verdad solo se esta utilizando la clave privada, la clave publica puede ser util tenerla para servirla de manera que los clientes puedan verificar la autenticidad del token.
