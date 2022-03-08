const { response } = require("express");
const res = require("express/lib/response");
const { Producto } = require("../models");

const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }
  // generar la data a guardar

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  // guardarDB

  await producto.save();

  res.status(201).json(producto);
};

const obtenerProductos = async (req, res = response) => {
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
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
    // total,
    // usuarios,
  });
};

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.status(201).json({
    producto,
  });
};

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json({
    producto,
  });
};

const borrarProducto = async (req, res = response) => {
  const { id } = req.params;

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.status(200).json(productoBorrado);
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
