const { response } = require("express");
const res = require("express/lib/response");
const { Categoria } = require("../models");
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }
  // generar la data a guardar

  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  // guardarDB

  await categoria.save();

  res.status(201).json(categoria);
};

const obtenerCategorias = async (req, res = response) => {
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
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
    // total,
    // usuarios,
  });
};

const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.status(201).json({
    categoria,
  });
};

const actualizarCategoria = () => {};

const borrarCategoria = () => {};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
