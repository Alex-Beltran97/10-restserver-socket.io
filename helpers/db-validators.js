const { Category, Product } = require("../models");
const Role = require("../models/Role");
const User = require("../models/User");


const regexNumber = /^\d+$/;

const isValidRole = async ( role = "") => {

  const roleExists = await Role.findOne({ role });

  if(!roleExists){
    throw new Error(`Rol ${ role } does not exists`);
  };

  return true;
};

const emailExists = async ( email = "") =>{
  
  const emailIsExist = await User.findOne({ email });
  if(emailIsExist){
    throw new Error("This email is already registered");
  };

  return true;
};

const existsUserById = async (id) =>{
  const idExists = await User.findById(id);

  if(!idExists){
    throw new Error("This ID does not exists");
  };
  
  return true;
};

const queryIsNumber = async (query = 0) =>{
  if(!regexNumber.test(query)){
    throw new Error("Queries must be a number")
  };

  return true;
};

const categoryIDExists = async ( id = "" ) =>{
  
  const idExists = await Category.findById(id);  

  if( !idExists ){
    throw new Error("Category ID was not found");
  };

  return true;
};

const existsProductById = async ( id ) =>{
  const idExists = await Product.findById( id );

  if(!idExists){
    throw new Error("This ID does not exists");
  };

  return true;
  
};

// Validate Allowed Collections

const allowedCollections = ( collection = "", collections = [] ) =>{

  const included = collections.includes( collection );

  if( !included ) throw new Error(`Collection ${ collection } is not allowed, ${ collections }`);

  return true;
};

module.exports = { 
  isValidRole,
  emailExists,
  existsUserById,
  queryIsNumber,
  categoryIDExists,
  existsProductById,
  allowedCollections
};