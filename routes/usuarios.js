const { Router } = require("express");
const { usuariosGet, usuariosDelete, usuariosPatch, usuariosPost, usuariosPut } = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.put("/:id", usuariosPut);

router.delete("/", usuariosDelete);

router.patch("/", usuariosPatch);

router.post("/", usuariosPost);


module.exports = router;
