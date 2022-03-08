const Role = require("../models/role");
const { Usuario, Categoria, Producto } = require("../models");

const esRoleValido = async (role = "") => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    throw new Error(`El ${role} no esta registrado en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });

  if (existeEmail) {
    throw new Error(`el correo: ${correo} ya esta registrado`);
  }
};
const existeUsuarioId = async (id) => {
  const existeId = await Usuario.findById(id);

  if (!existeId) {
    throw new Error(`el Id: ${id} No existe`);
  }
};

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);

  if (!existeCategoria) {
    throw new Error(`el Id: ${id} No existe`);
  }
};

const existeProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id);

  if (!existeProducto) {
    throw new Error(`el Id: ${id} No existe`);
  }
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioId,
  existeCategoriaPorId,
  existeProductoPorId,
};
