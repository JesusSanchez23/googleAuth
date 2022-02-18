const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/user");

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "No hay Token",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // verificar si el uid tiene estado activo:true
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: "Usuario no existe en DB",
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: "token inactivo",
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no valido",
        });
    }
};

module.exports = {
    validarJWT,
};