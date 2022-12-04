# desarrollo-seguro-grupo-2

## SETUP

### Claves de encriptado

El JWT de la API es firma utilizando una clave privada que es necesario configurar antes de
arrancar el servidor.

Los detalles sobre la configuracion de la clave estan en el archivo `keys/README.md`

### Docker

Guardar las claves y certificados en su directorio y buildear la imagen.

La imagen expone el puerto 8080 con https.

### Local

#### Install

```
npm install
```



#### RUN

```
npm start
```

or using debug log level

```
DEBUG=course:* npm start
```

## READ API DOCS

Open `http://localhost:8080/api-docs`

## TEST WITH POSTMAN

Import `Courses.postman_collection.json` on postman.

### Permitir Certificado Self-Signed

Hay que abrir la configuracion de Postman y cambiar la opcion de validacion de certificado, de lo contrario los pedidos de Postman no se enviaran.

La otra opcion seria hacer que el sistema operativo confie en el certificado auto firmado de la api de cursos meidante una configuracion que depende del sistema operativo en uso.


## TODO
- [x] validar inputs
- [x] revisar el dockerfile, encontrar una imagen con menos vulnerabilidades
- [x] meter un action en el repo que escanee el dockerfile?
