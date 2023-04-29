const { Role, Usuario, Categoria, Producto } = require("../models");

const isValidRole = async (role = "") => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    throw new Error(`Role ${role} is not registered in database`);
  }
};

const existsEmail = async (email = "") => {
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    throw new Error(`Email ${email} is already registered in database`);
  }
};
const existsUserById = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`There is not user with id ${id}`);
  }
};

const existeCategoria = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`There is not category with id ${id}`);
  }
};
const existeProducto = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`There is not product with id ${id}`);
  }
};

module.exports = {
  isValidRole,
  existsEmail,
  existsUserById,
  existeCategoria,
  existeProducto,
};
