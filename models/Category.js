const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "Name must be mandatory"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const { __v, _id, status, ...user  } = this.toObject();

  user.uid = _id;

  return user;
};

module.exports = model("Category", CategorySchema);
