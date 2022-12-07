# desarrollo-seguro-grupo-2

## SETUP

Tener docker instalado y ejecutando.

Recibir archivos de configuracion.

Los archivos `https.cert` y `https.key` van en el directorio `certs`

Los archivos `jwtRS256.key` y `jwtRS256.key.pub` van en el directorio `keys`

El archivo `.env` va en el directorio raiz del repositorio (al mismo nivel que el `package.json` por ejemplo).

## EJECUTAR

```
docker-compose build
```

```
docker-compose up -d
```

```
docker-compose logs -f nodejs
Attaching to nodejs
nodejs    | Read keys ok.
nodejs    | Cert and cert key ok.
nodejs    | Running on https://0.0.0.0:8080 with TLS
```

Inicia dos contenedores:

- nodejs: que es la api de courses expuesta en el puerto `8080` del host. Este puerto **es un puerto seguro** con lo que hay que utilizar el scheme `https` para acceder.
- mongo: es la base de datos, no expone ningun puerto hacia el host.

## API DOCS

Abrir `https://localhost:8080/api-docs` para ver la documentacion de la api en `swagger-ui` luego de haber levantado los contenedores.

## PROBAR CON POSTMAN

Importar la coleccion `Courses.postman_collection.json` que esta en el el directorio raiz del repositorio en postman, hay que deshabilitar el chequeo de certificados para que sea compatible con el certificado autofirmado incluido.

### Permitir Certificado Self-Signed en POSTMAN

Hay que abrir la configuracion de Postman y cambiar la opcion de validacion de certificado, de lo contrario los pedidos de Postman no se enviaran.

![dev](https://user-images.githubusercontent.com/1416695/205656729-40189d9d-8298-46a0-8d92-25c376c8e42d.gif)

La otra opcion seria hacer que el sistema operativo confie en el certificado auto firmado de la api de cursos meidante una configuracion que depende del sistema operativo en uso.

## BASE DE DATOS

La base de datos mongodb corre en un container que es solo accesible por la red interna creada por `docker-compose`.

Los archivos de datos se guardan en el directorio `data/mongo` que esta incluido en el `.gitignore` ya que contiene grandes archivos binarios generados que no forman parte del codigo fuente que queremos en el sistema de control de versiones.

En caso de querer hacer queries a la base de datos desde el host se puede editar el archivo `docker-compose.yml` y descomentar las lineas que alli se indican.

## SOLUCION DE PROBLEMAS

### KeyMgr error

Si al intentar levantar el servidor ocurre el siguiente error

```
KeyMgr error
```

El problema se soluciona revisando que los archivos de keys y de certs se encuentren en los directorios correspondientes y que los archivos tengan el nombre que corresponde.

Para revisar estos datos se puede consultar este mismo README.md o el de ./keys/README.md y ./certs/README.md

## DESARROLLO

### Install

El JWT de la API es firma utilizando una clave privada que es necesario configurar antes de
arrancar el servidor.

Los detalles sobre la configuracion de la clave estan en el archivo `keys/README.md`

### Docker

Guardar las claves y certificados en su directorio y buildear la imagen.

La imagen expone el puerto 8080 con https.

### Local

#### Instalar

```
npm install
```

#### EJECUTAR

```
npm start
```

o usando el log de debug:

```
DEBUG=course:* npm start
```

## TODO

- [x] Preparar documento para enviar
- [ ] Preparar archivos para enviar: keys, certs, .env (o en gdrive)
- [ ] Probar todo completo usando la collection de postman desde el repo.
