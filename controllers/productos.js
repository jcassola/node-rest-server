const { response } = require("express");
const { Producto } = require("../models");

// Get productos - paginado - total - populate
const productosGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { status: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    total,
    productos,
  });
};

// Get producto by id - populate
const getProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  return res.json({
    producto,
  });
};

// Crear producto
const crearProducto = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const { price, category, description = "" } = req.body;

  const productoDB = await Producto.findOne({ name });

  if (productoDB) {
    return res.status(400).json({
      msg: `Product ${name} already exists`,
    });
  }

  // Generar data
  const data = {
    name,
    user: req.usuario._id,
    price,
    category,
    description,
  };

  const producto = await new Producto(data);

  await producto.save();

  res.status(201).json({
    msg: "Product added",
    producto,
  });
};

// Update producto - populate
const updateProducto = async (req, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  data.user = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate("user", "name")
    .populate("category", "name");

  res.json({
    msg: "Product updated sucessfully",
    producto,
  });
};

// Delete producto - status:false
const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    {
      status: false,
    },
    { new: true }
  )
    .populate("user", "name")
    .populate("category", "name");
  res.json({
    msg: "Product deleted sucessfully",
    producto,
  });
};

module.exports = {
  productosGet,
  getProducto,
  crearProducto,
  updateProducto,
  deleteProduct,
};
