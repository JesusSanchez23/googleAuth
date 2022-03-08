const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
} = require("../controllers/categorias");
const { validarJWT } = require("../middlewares/validar-jwt");

const validarCampos = require("../middlewares/validar_campos");

const router = Router();

// url/api/categorias

// obtener todas las categorias
router.get("/", obtenerCategorias);

// obtener una categoria por id
router.get(
  "/:id",
  [check("id", "No es un Id valido").isMongoId(), validarCampos],
  obtenerCategoria
);

// crear categoria - cualquiera con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar - privado - cuqluiera con token valido
router.put("/:id", [], (req, res) => {
  res.json("put");
});

// Borrar categoria- admin
router.delete("/:id", (req, res) => {
  res.json("delete");
});

module.exports = router;
