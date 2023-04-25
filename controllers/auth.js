const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { name, email, img } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      const data = {
        name,
        email,
        password: "xd",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    if (!usuario.status) {
      return res.status(401).json({
        msg: "Blocked user",
      });
    }

    const token = await generateJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Invalid Google token",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
