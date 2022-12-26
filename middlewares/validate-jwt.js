const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateJwt = async ( req = request, res = response, next ) =>{
  
  const token = req.header("authorization");

  if(!token){
    return res.status(401).json({
      msg: "There is not a token in the request"
    });
  };

  try{

    const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

    // Read the user corresponding to the uid
    const user = await User.findById( uid );

    if(!user){
      return res.status(401).json({
        msg: "Token is not valid - User does not exist"
      });
    };
    
    // Verify if uid has satus "true"
    if(!user.state){
      return res.status(401).json({
        msg: "Token is not vaild - User with status false"
      });
    }

    req.user = user;

    next();

  }catch(error){
    
    console.log(error);
    res.status(401).json({
      msg: "Token is not valid"
    });
  };

};

module.exports = {
  validateJwt
};