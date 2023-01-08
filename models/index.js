const Category = require("./Category");
const ChatMessages = require("./Chat-messages");
const Product = require("./Product");
const Role = require("./Role");
const Server = require("./Server");
const User = require("./User");

module.exports = {
  ...Category,
  ...ChatMessages,
  ...Product,
  ...Role,
  ...Server,
  ...User
};