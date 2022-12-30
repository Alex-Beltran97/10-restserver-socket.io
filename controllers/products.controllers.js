const { response } = require("express");
const Product = require("../models/Product");

const getAllProducts = async ( req, res = response)=>{
  const { limit = 5, from = 0 } = req.query;

  const query = { status: true };

  try{

  const [ total, products ] = await Promise.all([
    Product.countDocuments( query ),
    Product.find( query )
    .limit( +limit )
    .skip( +from )
    .populate("user", "name")
    .populate("category", "name")
  ]);

  res.status(200).json({ total, products });

  }catch(error){
    console.log(error);

    res.status(500).json({
      msg: "Something Went Wrong With  This Process",
      error: JSON.stringify( error )
    });
  };
};

const getProductsById = async ( req, res = response)=>{

  const id = req.params.id;

  try{

  const product = await Product.findById( id )
    .populate("user","name")
    .populate("category","name");

  res.status(200).json( product );

  }catch(error){
    console.log(error);

    res.status(500).json({
      msg: "Something Went Wrong With  This Process",
      error
    });
  };
};

const postProducts = async ( req, res = response)=>{
  const { status, user, name, ...data } = req.body

  try{

    const product = await Product.findOne({ name });

    if( product ){
      res.status(400).json({
        msg: "User is already exist"
      })

      return
    };

    const info = {
      name: name.toUpperCase(),
      ...data,
      user: req.user._id
    };

    const newProduct = await new Product( info );

    newProduct.save();

    res.status(201).json( newProduct );

  }catch(error){
    console.log(error);

    res.status(500).json({
      msg: "Something Went Wrong With  This Process",
      error: JSON.stringify( error )
    });
  };
};

const putProductsById = async ( req, res = response)=>{

  const id = req.params.id;

  const { status, user, ...rest } = req.body;

  try{

    if( rest.name ){
      res.name = rest.name.toUpperCase();
    };

    rest.user = req.user._id;

    const result = await Product.findByIdAndUpdate( id, rest, { new: true })
    .populate( "user", "name")
    .populate( "category", "name");

    res.status( 200 ).json({
      result
    });

  }catch(error){
    console.log(error);

    res.status(500).json({
      msg: "Something Went Wrong With  This Process",
      error
    });
  };
};

const deleteProductsById = async ( req, res = response)=>{

  const id = req.params.id;

  try{

    const result = await Product.findByIdAndUpdate( id, { status: false }, { new: true });

    res.status( 200 ).json( result );

  }catch(error){
    console.log(error);

    res.status(500).json({
      msg: "Something Went Wrong With This Process",
      error
    });
  };
};

module.exports = {
  getAllProducts,
  getProductsById,
  postProducts,
  putProductsById,
  deleteProductsById
};