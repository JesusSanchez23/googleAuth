const bcryptjs = require("bcryptjs");
const { response } = require("express");
const res = require("express/lib/response");
const { DefaultTransporter } = require("google-auth-library");
const generarJWT = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require("../models/user");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario/contraseña no son correctos - email",
      });
    }

    // si el usuario esta activo en la base de datos
    if (usuario.estado === false) {
      return res.status(400).json({
        msg: "Usuario/contraseña no son correctos - estado: false",
      });
    }

    // verificar la contraseña

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario/contraseña no son correctos - password",
      });
    }

    // generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    //generar la referencia para verificar si el orreo existe en la base de datos mongo

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // tengo que crearlo
      const data = {
        nombre,
        correo,
        role: "ADMIN_ROLE",
        password: ":P",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }
    // si el usuario en base de datos tiene el estado en false

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }
    // generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
