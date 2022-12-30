const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
  role: {
      type: String,
      required: [true, 'Rol must be mandatory']
  }
});

module.exports = model( 'Role', RoleSchema );
