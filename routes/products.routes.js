const { Router } = require("express");
const { check } = require("express-validator");
const {
  getAllProducts,
  getProductsById,
  postProducts,
  putProductsById,
  deleteProductsById,
} = require("../controllers/products.controllers");
const { queryIsNumber, existsProductById, categoryIDExists } = require("../helpers/db-validators");
const { validateFileds, validateJwt, hasRole } = require("../middlewares");

const router = Router();

router.get("/", [
  check("limit").custom( queryIsNumber ),
  check("from").custom( queryIsNumber ),
  validateFileds
], getAllProducts);

router.get("/:id", [
  check("id","It is not a valid ID").isMongoId(),
  validateFileds,
  check("id").custom( existsProductById ),
  validateFileds
], getProductsById);

router.post("/", [
  validateJwt,
  hasRole("ADMIN_ROLE"),
  check("name","Name Must Be Required").not().isEmpty(),  
  validateFileds
], postProducts);

router.put("/:id", [
  validateJwt,
  hasRole("ADMIN_ROLE"),
  check("id","It is not a valid ID").isMongoId(),
  validateFileds,
  check("id").custom( existsProductById ),
  check("category","It is not a valid ID").isMongoId(),
  validateFileds,
  check("category").custom( categoryIDExists ),
  validateFileds
],putProductsById);

router.delete("/:id", [
  validateJwt,
  hasRole("ADMIN_ROLE"),
  check("id","It is not a valid ID").isMongoId(),
  validateFileds,
  check("id").custom( existsProductById ),
  validateFileds
], deleteProductsById);

module.exports = router;
