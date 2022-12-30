const { Router } = require("express");
const { check } = require("express-validator");
const { createCategory, getAllCategories, getCategoryByid, updateCategoryByid, deleteCategoryByid } = require("../controllers/categories.controllers");
const { queryIsNumber, categoryIDExists, existsUserById } = require("../helpers/db-validators");

const { validateFileds, validateJwt, hasRole } = require("../middlewares");

const router = Router();

// {{ url }}/api/categories

// Get All Categories - Public

router.get("/", [
  check("limit").custom( queryIsNumber ),
  check("from").custom( queryIsNumber ),
  validateFileds
], getAllCategories);

// Get a Category by ID - Public

router.get("/:id", [
  check("id", "It is not a valid ID ").isMongoId(),
  check("id").custom( categoryIDExists ),
  validateFileds
], getCategoryByid);

// Create a Category - Private - Any person with a valid token

router.post("/", [
  validateJwt,
  check("name","Name must be mandatory").not().isEmpty(),
  validateFileds
], createCategory);

// Update a register by ID - Private - Any person with a valid token

router.put("/:id", [
  validateJwt,
  hasRole("ADMIN_ROLE"),
  check("id", "It is not a valid ID ").isMongoId(),
  check("id").custom( categoryIDExists ),
  check("name","Name must be required").not().isEmpty(),
  validateFileds
], updateCategoryByid);

// Delete a register by ID - Private - Any person with a Admin Role

router.delete("/:id", [
  validateJwt,
  hasRole("ADMIN_ROLE"),
  check("id", "It is not a valid ID ").isMongoId(),
  validateFileds,
  check("id").custom( categoryIDExists ),
  validateFileds
], deleteCategoryByid);

module.exports = router;