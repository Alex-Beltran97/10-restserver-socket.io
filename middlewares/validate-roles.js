const { response } = require("express");

const isAdminRole = ( req, res = response, next ) =>{

  if( !req.user ){
    return res.status(500).json({
      msg: "An attempt is being made to verify the role without first validating the token"
    });
  };
  const { role, name } = req.user;

  if( role !== "ADMIN_ROLE"){
    return res.status(401).json({
      msg: `${ name } is not an administrator - Can't do this`
    });
  };

  next();

};

const hasRole = ( ...roles ) =>{
  return (req, res = response, next)=>{

    if( !roles.includes( req.user.role ) ){
      return res.status(401).json({
        msg: `The service require one of this roles: ${ roles }`
      });
    };

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole
};