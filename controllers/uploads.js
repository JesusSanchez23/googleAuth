const { response } = require("express");
const { subirArchivo } = require("../helpers");

const cargarArchivos = async (req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({ msg: "No files were uploaded." });
    return;
  }

  if (!req.files.archivo) {
    res.status(400).json({ msg: "No files were uploaded." });
    return;
  }

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

module.exports = {
  cargarArchivos,
};
