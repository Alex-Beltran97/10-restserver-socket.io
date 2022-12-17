const { request, response } = require("express");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

const usersGet = async (req = request ,res = response)=>{

  const { limit = 5, from = 0 } = req.query;

  const query = { state: true };

  const [ total, users ] = await Promise.all([
    User.countDocuments( query ),
    User.find( query )
      .limit( limit )
      .skip( from )
  ]);

  res.json({ total, users });
};

const usersPost = async (req = request ,res = response)=>{

  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encrypt the password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync( password, salt );

  // Save in DB
  await user.save();

  res.json({
    msg: "Post api - Controller",
    user
  });

};

const usersPut = async (req = request ,res = response)=>{
  const { id } = req.params;
  const { _id, password, google, correo, ...rest } = req.body;

  // TODO Validate againts DB
  if( password ){
    // Encrypt the password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync( password, salt );
  };
  
  const user = await User.findByIdAndUpdate(id, rest);

  res.json({
    msg:"Put api - Controller",
    id,
    user
  });
};

const usersDelete = async (req = request ,res = response)=>{

  const { id } = req.params;

  // Physically deleted
  const user = await User.findByIdAndUpdate(id, { state: false });

  res.json({
    user
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete
};