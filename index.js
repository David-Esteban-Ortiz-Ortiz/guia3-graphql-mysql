require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2');

// ======================================================
// CONEXIÓN CON MYSQL
// ======================================================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(error => {
  if (error) {
    console.error('Error al conectar con MySQL:', error.message);
    return;
  }

  console.log('Conectado correctamente a MySQL');
});

// ======================================================
// SCHEMA DE GRAPHQL
// ======================================================

const schema = buildSchema(`
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
    updateUser(id: Int!, name: String!, email: String!): User
    deleteUser(id: Int!): String!
  }
`);

// ======================================================
// RESOLVERS
// ======================================================

const root = {
  // Listar todos los usuarios
  users: () => {
    return new Promise((resolve, reject) => {
      const consulta = 'SELECT * FROM users ORDER BY id';

      db.query(consulta, (error, resultados) => {
        if (error) {
          reject(new Error('No fue posible listar los usuarios'));
          return;
        }

        resolve(resultados);
      });
    });
  },

  // Buscar un usuario por identificador
  user: ({ id }) => {
    return new Promise((resolve, reject) => {
      const consulta = 'SELECT * FROM users WHERE id = ?';

      db.query(consulta, [id], (error, resultados) => {
        if (error) {
          reject(new Error('No fue posible buscar el usuario'));
          return;
        }

        if (resultados.length === 0) {
          reject(new Error(`No existe un usuario con el id ${id}`));
          return;
        }

        resolve(resultados[0]);
      });
    });
  },

  // Agregar un nuevo usuario
  addUser: ({ name, email }) => {
    return new Promise((resolve, reject) => {
      const nombreLimpio = name.trim();
      const correoLimpio = email.trim().toLowerCase();

      if (nombreLimpio === '') {
        reject(new Error('El nombre no puede estar vacío'));
        return;
      }

      if (correoLimpio === '') {
        reject(new Error('El correo no puede estar vacío'));
        return;
      }

      const consulta =
        'INSERT INTO users (name, email) VALUES (?, ?)';

      db.query(
        consulta,
        [nombreLimpio, correoLimpio],
        (error, resultado) => {
          if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              reject(new Error('El correo ya está registrado'));
              return;
            }

            reject(new Error('No fue posible registrar el usuario'));
            return;
          }

          resolve({
            id: resultado.insertId,
            name: nombreLimpio,
            email: correoLimpio
          });
        }
      );
    });
  },

  // Actualizar un usuario
  updateUser: ({ id, name, email }) => {
    return new Promise((resolve, reject) => {
      const nombreLimpio = name.trim();
      const correoLimpio = email.trim().toLowerCase();

      if (nombreLimpio === '') {
        reject(new Error('El nombre no puede estar vacío'));
        return;
      }

      if (correoLimpio === '') {
        reject(new Error('El correo no puede estar vacío'));
        return;
      }

      const consulta =
        'UPDATE users SET name = ?, email = ? WHERE id = ?';

      db.query(
        consulta,
        [nombreLimpio, correoLimpio, id],
        (error, resultado) => {
          if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              reject(new Error('El correo ya está registrado'));
              return;
            }

            reject(new Error('No fue posible actualizar el usuario'));
            return;
          }

          if (resultado.affectedRows === 0) {
            reject(new Error(`No existe un usuario con el id ${id}`));
            return;
          }

          resolve({
            id,
            name: nombreLimpio,
            email: correoLimpio
          });
        }
      );
    });
  },

  // Eliminar un usuario
  deleteUser: ({ id }) => {
    return new Promise((resolve, reject) => {
      const consulta = 'DELETE FROM users WHERE id = ?';

      db.query(consulta, [id], (error, resultado) => {
        if (error) {
          reject(new Error('No fue posible eliminar el usuario'));
          return;
        }

        if (resultado.affectedRows === 0) {
          reject(new Error(`No existe un usuario con el id ${id}`));
          return;
        }

        resolve(`Usuario con id ${id} eliminado correctamente`);
      });
    });
  }
};

// ======================================================
// SERVIDOR EXPRESS Y GRAPHQL
// ======================================================

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

// ======================================================
// INICIAR SERVIDOR
// ======================================================

app.listen(4000, () => {
  console.log(
    'Servidor disponible en http://localhost:4000/graphql'
  );
});