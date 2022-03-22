const path = require("path");
const fs = require("fs");

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");

const { Usuario, Producto } = require("../models");

const cargarArchivos = async (req, res = response) => {
  try {
    const nombre = await subirArchivo(
      req.files,
      ["txt", "docx"],
      "documentos/parte1"
    );

    res.json({
      nombre,
    });
  } catch (error) {
    res.status(404).json({
      msg: error,
    });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un usuario con el id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "olvide validar esto",
      });
  }
  // limpiar imagenes previas

  if (modelo.img) {
    //borrar la imagen del servidor

    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    // para validar si algo existe podemos ocupar la propiedad de node fileSystem fs, y borrar con unlink que tabien la trae filesysstem
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();
  res.json({
    modelo,
  });
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un usuario con el id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "olvide validar esto",
      });
  }
  // limpiar imagenes previas

  if (modelo.img) {
    //borrar la imagen del servidor

    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    // para validar si algo existe podemos ocupar la propiedad de node fileSystem fs, y borrar con unlink que tabien la trae filesysstem
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
  const pathNoImage = path.join(__dirname, "../assets/no-image.png");

  res.sendFile(pathNoImage);
};

module.exports = {
  cargarArchivos,
  actualizarImagen,
  mostrarImagen,
};
