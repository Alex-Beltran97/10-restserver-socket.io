const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth.controllers");
const { validateFileds } = require("../middlewares/validate-fields");

const router = Router();

router.post("/login", [
  check("email", "Email must be mandatory").isEmail(),
  check("password", "Password must be mandatory").not().isEmpty(),
  validateFileds
],login );

module.exports = router;