const { response } = require("express");
const { termIsMongoId } = require("../helpers/db-validators");
const { User, Category, Product } = require("../models");
const { ObjectId } = require("mongoose").Types;

const allowedCollections = [
  "users",
  "category",
  "products",
  "roles",
];

const searchUsers = async ( term = "", res = response ) =>{

  const isMongoId = ObjectId.isValid( term ); // TRUE

  if( isMongoId ){
    const data = await User.findById( term );

    return res.json({ results: data ? [ data ] : []  });
  };
  
  const regex = new RegExp( term, "i");

  const conditions = {
    $or: [{ name: regex }, { email: regex } ],
    $and: [{ state:true }]
  };

  const [ total, users ] = await Promise.all([
    User.count( conditions ),
    User.find( conditions )
  ]);

  res.json({ total, users });
};

const searchCategories = async ( term = "", res = response ) =>{

  const isMongoId = ObjectId.isValid( term ); // TRUE

  if( isMongoId ){
    const data = await Category.findById( term );

    return res.json({ results: data ? [ data ] : []  });
  };
  
  const regex = new RegExp( term, "i");

  const conditions = { name: regex, status: true };

  const category  = await Category.find( conditions )
    .populate( "user", "name" );

  res.json({ category });
};

const searchProducts = async ( term = "", res = response ) =>{

  const isMongoId = ObjectId.isValid( term ); // TRUE

  if( isMongoId ){
    const data = await Product.findById( term );

    return res.json({ results: data ? [ data ] : []  });
  };
  
  const regex = new RegExp( term, "i");

  const conditions = {
    $or: [{ name: regex }],
    $and: [{ status: true }]
  };

  const [ total, products ] = await Promise.all([
    Product.count( conditions ),
    Product.find( conditions )
  ]);

  res.json({ total, products });
};


const search = async (req, res = response) =>{
  const { collection, term } = req.params;

  try{

    if ( !allowedCollections.includes( collection ) ){
      return res.status( 400 ).json({
        msg: `Allowed Collections are: ${ allowedCollections }`
      });
    };

    switch( collection ){
      case "users":
        searchUsers( term, res );
      break;
      case "category":
        searchCategories( term, res );
        break;
        case "products":
        searchProducts( term, res );
      break;
      default:
        res.status( 500 ).json({
          msg: "Forgot to make this search"
        })
      break;
    };

  }catch(error){
    console.log(error);

    return res.status(500).json({
      msg:"Something went wrong. Please report to your administrator"
    });
  };
};

module.exports = {
  search
};