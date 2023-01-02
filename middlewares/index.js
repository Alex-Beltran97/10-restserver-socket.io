const validateFileds     = require("../middlewares/validate-fields");
const validateFileUpload = require("./validate-file");
const validateJwt        = require("../middlewares/validate-jwt");
const validateRoles      = require("../middlewares/validate-roles");

module.exports = {
  ...validateFileds,
  ...validateFileUpload,
  ...validateJwt,
  ...validateRoles
};

