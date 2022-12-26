const { response } = require("express");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/createJwt");

const login = async (req, res = response) =>{
  const { email, password } = req.body;
  
  try{

  const user = await User.findOne({ email });

  // validate if email exist
  if(!user) return res.status(400).json({
    msg: "User / Password do not be correct - email"
  });
  
  // Validate if user is active
  if(!user.state) return res.status(400).json({
    msg: "User / Password do not be correct - state: false"
  });

  // Validate password 
  const validPassword = bcryptjs.compareSync(password, user.password);
  if(!validPassword) return res.status(400).json({
    msg: "User / Password do not be correct - password"
  });

  // Generate JWT
  const token = await generateJWT(user.id);

  res.json({ user, token });


  }catch(error){
    console.log(error);
    return res.status(500).json({
      msg:"Something went wrong. Please report to your administrator"
    });
  };
}

module.exports = {
  login
};