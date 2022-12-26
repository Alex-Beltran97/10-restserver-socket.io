const { Router } = require("express");
const { check } = require("express-validator");

const {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
} = require("../controllers/users.controllers");

const { isValidRole, emailExists, existsUserById, queryIsNumber } = require("../helpers/db-validators");

// const { validateFileds } = require("../middlewares/validate-fields");
// const { validateJwt } = require("../middlewares/validate-jwt");
// const { isAdminRole, hasRole } = require("../middlewares/validate-roles");

const { validateFileds, validateJwt, hasRole } = require("../middlewares/index");

const router = Router();

router.get("/", [
  check("limit").custom( queryIsNumber ),
  check("from").custom( queryIsNumber ),
  validateFileds
],usersGet );

router.post("/", [
  check("name","The name is mandatory").not().isEmpty(),
  check("password","The password must containt more than 6 letters").isLength({ min: 6 }),
  check("email","This email is not valid").isEmail().custom( emailExists ),
  check("role").custom( isValidRole ),
  validateFileds
], usersPost );

router.put("/:id", [
  check("id", "Is not a valid ID").isMongoId(),
  check("id").custom( existsUserById ),
  validateFileds
],usersPut );

router.delete("/:id", [
  validateJwt,
  // isAdminRole,
  hasRole("ADMIN_ROLE","SALES_ROLE"),
  check("id", "Is not a valid ID").isMongoId(),
  check("id").custom( existsUserById ),
  validateFileds
],usersDelete );

module.exports = router;
