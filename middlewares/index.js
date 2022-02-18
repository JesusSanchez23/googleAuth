const validarJWT = require("../middlewares/validar-jwt");
const validarRoles = require("../middlewares/validar-roles");
const validarCampos = require("../middlewares/validar_campos");

module.exports = {
    ...validarJWT,
    ...validarCampos,
    ...validarRoles,
};