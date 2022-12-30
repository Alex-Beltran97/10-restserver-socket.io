const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/createJwt");
const { googleVerify } = require("../helpers/google-verify");
const User = require("../models/User");

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
};

const googleSignIn = async (req, res = response)=>{

  const { id_token } = req.body;

  try{

    const { email, name, img } = await googleVerify( id_token );

    let user = await User.findOne({ email });

    if( !user ){

      const data = {
        email,
        name,
        img,
        role: "USER_ADMIN",
        password: " :p",
        google: true
      };

      user = new User( data );

      await user.save();
    };

    if( !user.state ){
      return res.status(401).json({
        msg: "Report to adminsitrator. User was blocked."
      })
    };

    const token = await generateJWT( user.id );

    return res.status(200).json({ user, token });

  }catch(error){
    console.log(error);

    res.status(400).json({
      msg: "Token could not be verified"
    });
  };
};

module.exports = {
  login,
  googleSignIn
};