const Role = require("../models/role");
const Usuario = require("../models/usuario");

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

module.exports = {
  isValidRole,
  existsEmail,
  existsUserById,
};
