const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivos,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
const { validarArchivoSubir } = require("../middlewares");
const validarCampos = require("../middlewares/validar_campos");

const router = Router();

router.post("/", [validarArchivoSubir, validarCampos], cargarArchivos);

router.put(
  "/:coleccion/:id",
  [
    check("id", "el ID debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarArchivoSubir,
    validarCampos,
  ],
  // actualizarImagen
  actualizarImagenCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "el ID debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
