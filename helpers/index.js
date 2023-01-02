const dbValidators = require("./db-validators");
const createJWT    = require("./createJwt");
const googleVerify = require("./google-verify");
const uploadFile   = require("./upload-file");

module.exports = {
  ...dbValidators,
  ...createJWT,
  ...googleVerify,
  ...uploadFile
};

