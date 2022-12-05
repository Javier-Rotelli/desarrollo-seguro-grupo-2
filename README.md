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

## API DOCS

Levantar el server y abrir en el navegador: `https://localhost:8080/api-docs`

## PROBAR CON POSTMAN

Importar `Courses.postman_collection.json` con postman.

### Permitir Certificado Self-Signed

Hay que abrir la configuracion de Postman y cambiar la opcion de validacion de certificado, de lo contrario los pedidos de Postman no se enviaran.

![dev](https://user-images.githubusercontent.com/1416695/205656729-40189d9d-8298-46a0-8d92-25c376c8e42d.gif)


La otra opcion seria hacer que el sistema operativo confie en el certificado auto firmado de la api de cursos meidante una configuracion que depende del sistema operativo en uso.


## TODO
- [x] validar inputs
- [x] revisar el dockerfile, encontrar una imagen con menos vulnerabilidades
- [x] meter un action en el repo que escanee el dockerfile?
