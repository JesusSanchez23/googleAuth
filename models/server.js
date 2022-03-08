const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");
require("dotenv").config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      usuariosPath: "/api/usuarios",
      categorias: "/api/categorias",
    };

    // conectar a base de datos
    this.conectarDB();
    // middlewares
    this.middlewares();

    // Rutas de mi aplicacion
    this.router();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // cors

    this.app.use(cors());

    // Parseo y lectura del body
    this.app.use(express.json());

    // directorio publico
    this.app.use(express.static("public"));
  }

  router() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.usuariosPath, require("../routes/user"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Running", process.env.PORT);
    });
  }
}

module.exports = Server;
