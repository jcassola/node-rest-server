const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require('../middlewares/validate-fields');
const { isValidRole, existsEmail, existsUserById } = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosDelete,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
} = require("../controllers/usuarios");

const router = Router(); 

router.get("/", usuariosGet);

router.put("/:id", [
  check('id', 'It is not a valid id').isMongoId(),
  check('id').custom(existsUserById),
  check('role').custom(isValidRole),
  validateFields 
], usuariosPut);

router.post("/", [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio y más de 6 letras").isLength({min: 6}),
    // check("email", "El correo no es valido").isEmail(),
    // check("role", "No es un rol válido").isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('email').custom(existsEmail),
    check('role').custom(isValidRole),
    validateFields
], usuariosPost);

router.delete("/:id", [
  check('id', 'It is not a valid id').isMongoId(),
  check('id').custom(existsUserById),
  validateFields
], usuariosDelete);

router.patch("/", usuariosPatch);

module.exports = router;
