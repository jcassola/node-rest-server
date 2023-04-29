const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields, validateJWT, isAdminRole } = require("../middlewares");
const {
  crearCategoria,
  categoriasGet,
  getCategoria,
  updateCategoria,
  categoriaDelete,
} = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

// Get todas las categorias - public
router.get("/", categoriasGet);

// Get categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "It is not a valid id").isMongoId(),
    check("id").custom(existeCategoria),
    validateFields,
  ],
  getCategoria
);

// Crear categoria - private - persona con token valido
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    validateFields,
  ],
  crearCategoria
);

// Update categoria - private - persona con token valido
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "It is not a valid id").isMongoId(),
    check("name", "Name is required").not().isEmpty(),
    check("id").custom(existeCategoria),
    validateFields,
  ],
  updateCategoria
),
  // Delete categoria - admin
  router.delete(
    "/:id",
    [
      validateJWT,
      isAdminRole,
      check("id", "It is not a valid id").isMongoId(),
      check("id").custom(existeCategoria),
      validateFields,
    ],
    categoriaDelete
  );

module.exports = router;
