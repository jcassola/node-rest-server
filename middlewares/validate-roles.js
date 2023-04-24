const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar rol sin validar token",
    });
  }
  const { role, name } = req.usuario;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not an admin. He/She cannot do this`,
    });
  }
  next();
};

const hasRoles = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar rol sin validar token",
      });
    }

    if (!roles.includes(req.usuario.role)) {
      return res.status(401).json({
        msg: `Service requires one of the next roles: ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  isAdminRole,
  hasRoles,
};
