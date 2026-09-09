# API GraphQL con persistencia en MySQL

## Autor(es)

- David Esteban Ortiz Ortiz
- Juliana Muñoz

## Descripción del proyecto

Este proyecto consiste en el desarrollo de una API GraphQL para gestionar los datos básicos de usuarios mediante una base de datos MySQL.

La aplicación permite registrar, listar, buscar, actualizar y eliminar usuarios. Cada usuario contiene un identificador único, un nombre y un correo electrónico.

A diferencia de una aplicación que utiliza arrays almacenados temporalmente en memoria RAM, este proyecto utiliza MySQL como mecanismo de persistencia. Esto permite conservar la información aunque el servidor de Node.js se detenga o se reinicie.

El proyecto fue desarrollado como actividad académica para aplicar los conceptos de GraphQL, consultas, mutaciones, resolvers, conexión con bases de datos y operaciones CRUD.

## Objetivo

Construir una API GraphQL conectada a una base de datos MySQL que permita realizar operaciones CRUD sobre los datos básicos de los usuarios.

## Tecnologías utilizadas

- Node.js
- JavaScript
- Express
- GraphQL
- express-graphql
- GraphiQL
- MySQL
- MySQL Workbench
- mysql2
- dotenv
- Git
- GitHub

## Datos de los usuarios

Cada usuario contiene los siguientes campos:

- `id`: identificador único entero generado automáticamente.
- `name`: nombre del usuario.
- `email`: correo electrónico del usuario.

## Funcionalidades

La API permite realizar las siguientes operaciones:

1. Registrar un nuevo usuario.
2. Listar todos los usuarios almacenados.
3. Buscar un usuario mediante su identificador.
4. Actualizar el nombre y el correo de un usuario.
5. Eliminar un usuario mediante su identificador.
6. Informar cuando un usuario solicitado no existe.
7. Evitar el registro de correos electrónicos repetidos.
8. Conservar los datos después de reiniciar el servidor.

## Operaciones disponibles

### Queries

- `users`: permite listar todos los usuarios.
- `user(id)`: permite buscar un usuario por su identificador.

### Mutations

- `addUser`: permite registrar un nuevo usuario.
- `updateUser`: permite actualizar un usuario existente.
- `deleteUser`: permite eliminar un usuario mediante su identificador.

## Requisitos previos

Antes de instalar y ejecutar el proyecto, se debe contar con:

- Node.js.
- npm.
- MySQL Server.
- MySQL Workbench.
- Git.
- Visual Studio Code o cualquier editor de código.
- Una cuenta de GitHub, si se desea clonar o colaborar en el repositorio.

Para comprobar que Node.js y npm están instalados, se pueden ejecutar los siguientes comandos:

```bash
node --version
npm --version
```

## Instalación del proyecto

### 1. Clonar el repositorio

Ejecute el siguiente comando en una terminal:

```bash
git clone https://github.com/TU-USUARIO/guia3-graphql-mysql.git
```

### 2. Entrar en la carpeta del proyecto

```bash
cd guia3-graphql-mysql
```

### 3. Instalar las dependencias

```bash
npm install
```

Este comando instalará las dependencias registradas en el archivo `package.json`, incluyendo Express, GraphQL, MySQL2 y dotenv.

## Creación de la base de datos

Abra MySQL Workbench, conéctese al servidor local y ejecute el siguiente código:

```sql
CREATE DATABASE graphql_db;

USE graphql_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);
```

Para comprobar la estructura de la tabla, ejecute:

```sql
DESCRIBE users;
```

La tabla debe contener las columnas:

- `id`
- `name`
- `email`

## Configuración de las variables de entorno

Por razones de seguridad, la contraseña y los datos de conexión con MySQL no están escritos directamente en el archivo `index.js`.

El proyecto utiliza variables de entorno almacenadas en un archivo `.env`.

### 1. Crear el archivo `.env`

En la raíz del proyecto, cree un archivo llamado:

```text
.env
```

### 2. Agregar los datos de conexión

Dentro del archivo `.env`, agregue:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SU_CONTRASENA
DB_NAME=graphql_db
```

Reemplace `SU_CONTRASENA` por la contraseña correspondiente a la conexión de MySQL.

Si el usuario de MySQL no tiene contraseña, deje la variable vacía:

```env
DB_PASSWORD=
```

El archivo `.env` no se encuentra almacenado en GitHub porque contiene información privada y está incluido dentro del archivo `.gitignore`.

El repositorio contiene un archivo `.env.example` que puede utilizarse como referencia para realizar esta configuración.

## Ejecución del proyecto

Después de instalar las dependencias, crear la base de datos y configurar el archivo `.env`, inicie el servidor con:

```bash
node index.js
```

Si la conexión es correcta, la terminal mostrará:

```text
Conectado correctamente a MySQL
Servidor disponible en http://localhost:4000/graphql
```

Después, abra la siguiente dirección en el navegador:

```text
http://localhost:4000/graphql
```

En esta dirección estará disponible la interfaz GraphiQL para ejecutar las operaciones de la API.

## Pruebas en GraphiQL

Cada uno de los siguientes bloques debe ejecutarse por separado dentro de GraphiQL.

### Agregar un usuario

```graphql
mutation {
  addUser(
    name: "Juan Pérez"
    email: "juan@example.com"
  ) {
    id
    name
    email
  }
}
```

El identificador se genera automáticamente en MySQL.

### Listar todos los usuarios

```graphql
query {
  users {
    id
    name
    email
  }
}
```

Esta consulta devuelve todos los usuarios almacenados en la tabla `users`.

### Buscar un usuario por identificador

```graphql
query {
  user(id: 1) {
    id
    name
    email
  }
}
```

El identificador debe reemplazarse por el ID real del usuario que se desea consultar.

### Actualizar un usuario

```graphql
mutation {
  updateUser(
    id: 1
    name: "Juan Pérez Actualizado"
    email: "juan.actualizado@example.com"
  ) {
    id
    name
    email
  }
}
```

Esta mutación modifica el nombre y el correo electrónico del usuario indicado.

### Eliminar un usuario

```graphql
mutation {
  deleteUser(id: 1)
}
```

Esta operación elimina de la base de datos el usuario que tenga el identificador proporcionado.

## Comprobación desde MySQL Workbench

Para comprobar que las operaciones realizadas desde GraphQL modificaron la base de datos, ejecute en MySQL Workbench:

```sql
USE graphql_db;

SELECT * FROM users;
```

El resultado mostrará los usuarios almacenados actualmente en la tabla.

## Validaciones y manejo de errores

La API incluye las siguientes validaciones:

- El nombre del usuario no puede estar vacío.
- El correo electrónico no puede estar vacío.
- No se permiten correos electrónicos repetidos.
- Se verifica que un usuario exista antes de buscarlo.
- Se verifica que un usuario exista antes de actualizarlo.
- Se verifica que un usuario exista
