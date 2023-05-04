const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validateUploadFile } = require("../middlewares");

const router = Router();

router.post("/", validateUploadFile, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validateUploadFile,
    check("id", "It must be a Mongo id").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validateFields,
  ],
  // actualizarImagen
  actualizarImagenCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "It must be a Mongo id").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validateFields,
  ],
  mostrarImagen
);

module.exports = router;
