# desarrollo-seguro-grupo-2

## SETUP

Los archivos `https.cert` y `https.key` van en el directorio `certs`

Los archivos `jwtRS256.key` y `jwtRS256.key.pub` van en el directorio `keys`

## EJECUTAR

```
docker-compose up -d
```

Inicia dos contenedores:

* nodejs: que es la api de courses expuesta en el puerto 8080 del host. Este puerto es un puerto seguro con lo que hay que utilizar el scheme `https` para acceder.
* mongo: es la base de datos, no expone ningun puerto hacia el host.

## API DOCS

Abrir `https://localhost:8080/api-docs` para ver la documentacion de la api en `swagger-ui`.

## PROBAR CON POSTMAN

Importar la coleccion `Courses.postman_collection.json` en postman, hay que deshabilitar el chequeo de certificados para que sea compatible con el certificado autofirmado incluido.

## BASE DE DATOS

La base de datos mongodb corre en un container que es solo accesible por la red interna creada por `docker-compose`.

Los archivos de datos se guardan en el directorio `data/mongo` que esta incluido en el `.gitignore` ya que contiene grandes archivos binarios generados que no forman parte del codigo fuente que queremos en el sistema de control de versiones.

En caso de querer hacer queries a la base de datos desde el host se puede editar el archivo `docker-compose.yml` y descomentar las lineas que alli se indican.

## DESARROLLO

### Install

```
npm install
```

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

## RUN

```
npm start
```

or using debug log level

```
DEBUG=course:* npm start
```

## TODO
- [x] validar inputs
- [ ] revisar el dockerfile, encontrar una imagen con menos vulnerabilidades
- [x] meter un action en el repo que escanee el dockerfile?
