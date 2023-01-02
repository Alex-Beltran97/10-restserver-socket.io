const { Router } = require("express");
const { check } = require("express-validator");
const {
  loadFile,
  updateImage,
  showImage,
  updateImageCloudinary,
} = require("../controllers/uploads.controllers");
const { allowedCollections } = require("../helpers");
const { validateFileds, validateFileUpload } = require("../middlewares");

const router = Router();

router.post("/", validateFileUpload, loadFile);

router.put(
  "/:collection/:id",
  [
    validateFileUpload,
    check("id", "It is not a valid ID").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validateFileds,
  ],
  updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("id", "It is not a valid ID").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validateFileds,
  ],
  showImage
);

module.exports = router;
