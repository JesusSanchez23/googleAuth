const { response, query } = require("express");
const res = require("express/lib/response");
const Usuario = require("../models/user");
const bcryptjs = require("bcryptjs");

//! Metodo get
const usersGet = async(req = request, res = response) => {
    // const params = req.query;

    // const { q, nombre = "No name", apikey, page = 1, limit } = req.query;
    const { limite = 3, desde = 0 } = req.query;
    const query = { estado: true };

    // ! En este codigo trabajamos con el await pero como había dos en el código al momento de ser una aplicación real el tiempo de espera sería muchisimo, por esta razón se trabaja con promesas y no con el aync-await
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    //Te permite saber el numero de registris en una base de datos mongoDB
    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
    ]);

    res.json({
        total,
        usuarios,
        // total,
        // usuarios,
    });
};

// Para insertar nuevos datos
const usersPost = async(req, res = response) => {
    // const body = req.body;
    const { nombre, correo, password, role } = req.body;

    const usuario = new Usuario({
        nombre,
        correo,
        password,
        role,
    });

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // guardar en BD

    await usuario.save();
    res.json({
        msg: "get API Post",
        usuario,
    });
};
const usersPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //Todo validar contra base de datos
    if (password) {
        // encriptar pass
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
};

const usersPatch = (req, res = response) => {
    res.json({
        msg: "get API Patch",
    });
};
const usersDelete = async(req, res = response) => {
    const { id } = req.params;

    // const uid = req.uid;

    // fisicamente lo borramos
    //! Esto no se recomienda porque se pierde la integridad de los datos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    const usuarioAutenticado = req.usuario;
    res.json({
        usuario,
        usuarioAutenticado,
        // uid,
    });
};

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
};