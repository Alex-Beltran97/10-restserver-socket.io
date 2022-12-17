const Role = require("../models/Role");
const User = require("../models/User");

const regexNumber = /^\d+$/;

const isValidRole = async ( role = "") => {

  const roleExists = await Role.findOne({ role });

  if(!roleExists){
    throw new Error(`Rol ${ role } does not exists`);
  };
};

const emailExists = async ( email = "") =>{
  
  const emailIsExist = await User.findOne({ email });
  if(emailIsExist){
    throw new Error("This email is already registered");
  };
};

const existsUserById = async (id) =>{
  const idExists = await User.findById(id);

  if(!idExists){
    throw new Error("This ID does not exists");
  };
  
};

const queryIsNumber = async (query = 0) =>{
  if(!regexNumber.test(query)){
    throw new Error("Queries must be a number")
  };
};

module.exports = { 
  isValidRole,
  emailExists,
  existsUserById,
  queryIsNumber
};