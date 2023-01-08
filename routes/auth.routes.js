const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn, renewToken } = require("../controllers/auth.controllers");
const { validateFileds, validateJwt } = require("../middlewares");

const router = Router();

router.post("/login", [
  check("email", "Email must be mandatory").isEmail(),
  check("password", "Password must be mandatory").not().isEmpty(),
  validateFileds
],login );

router.post("/google", [
  check("id_token", "Id token must be mandatory").not().isEmpty(),
  validateFileds
], googleSignIn );

router.get("/",validateJwt, renewToken);

module.exports = router;