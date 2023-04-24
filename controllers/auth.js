const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: "User not found - wrong email",
      });
    }
    // Check if user's status is true
    if (!usuario.status) {
      return res.status(400).json({
        msg: "User not found - status:false",
      });
    }

    // Check password
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "User not found - wrong password",
      });
    }

    // Generate JWT
    const token = await generateJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

module.exports = {
  login,
};
