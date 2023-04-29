const { response } = require("express");
const { Categoria } = require("../models");

// Get categorias - paginado - total - populate
const categoriasGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { status: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("user", "name")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    total,
    categorias,
  });
};

// Get categoria by id - populate
const getCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("user", "name");

  return res.json({
    categoria,
  });
};

const crearCategoria = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoriaDB = await Categoria.findOne({ name });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `Category ${name} already exists`,
    });
  }

  // Generar data

  const data = {
    name,
    user: req.usuario._id,
  };

  const categoria = await new Categoria(data);

  await categoria.save();

  res.status(201).json({
    msg: "Category added",
    categoria,
  });
};

// Update categoria - populate
const updateCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("user", "name");

  res.json({
    msg: "Category updated sucessfully",
    categoria,
  });
};
// Delete categoria - status:false
const categoriaDelete = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    {
      status: false,
    },
    { new: true }
  ).populate("user", "name");
  res.json({
    msg: "Category deleted sucessfully",
    categoria,
  });
};

module.exports = {
  categoriasGet,
  getCategoria,
  crearCategoria,
  updateCategoria,
  categoriaDelete,
};
