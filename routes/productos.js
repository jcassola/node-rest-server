const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields, validateJWT, isAdminRole } = require("../middlewares");
const {
  crearProducto,
  productosGet,
  getProducto,
  updateProducto,
  deleteProduct,
} = require("../controllers/productos");
const { existeCategoria, existeProducto } = require("../helpers/db-validators");

const router = Router();

// Get todas los productos - public
router.get("/", productosGet);

// Get producto por id - publico
router.get(
  "/:id",
  [
    check("id", "It is not a valid id").isMongoId(),
    check("id").custom(existeProducto),
    validateFields,
  ],
  getProducto
);

// Crear categoria - private - persona con token valido
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("category", "It is not a valid id").isMongoId(),
    check("category").custom(existeCategoria),
    validateFields,
  ],
  crearProducto
);

// Update producto - private - persona con token valido
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "It is not a valid id").isMongoId(),
    check("id").custom(existeProducto),
    validateFields,
  ],
  updateProducto
),
  // Delete producto - admin
  router.delete(
    "/:id",
    [
      validateJWT,
      isAdminRole,
      check("id", "It is not a valid id").isMongoId(),
      check("id").custom(existeProducto),
      validateFields,
    ],
    deleteProduct
  );

module.exports = router;
