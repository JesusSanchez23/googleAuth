const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const {
  existeCategoriaPorId,
  existeProductoPorId,
} = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");

const validarCampos = require("../middlewares/validar_campos");

const router = Router();

// url/api/categorias

// obtener todos los productos
router.get("/", obtenerProductos);

// obtener un producto por id
router.get(
  "/:id",
  [
    check("id", "No es un Id valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

// crear producto - cualquiera con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un ID de Mongo Válido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

// Actualizar - privado - cuqluiera con token valido
router.put(
  "/:id",
  [validarJWT, check("id").custom(existeProductoPorId), validarCampos],
  actualizarProducto
);

// Borrar categoria- admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un Id valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
