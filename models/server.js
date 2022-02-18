const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");
require("dotenv").config();

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = "/api/usuarios";
        this.authPath = "/api/auth";

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
        this.app.use(this.authPath, require("../routes/auth"));
        this.app.use(this.usuariosPath, require("../routes/user"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Running", process.env.PORT);
        });
    }
}

module.exports = Server;