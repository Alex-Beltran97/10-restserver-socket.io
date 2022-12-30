const { response } = require("express");
const { Category } = require("../models");
const { findById } = require("../models/Category");

// getCategories - Paginated - Total - Populate

const getAllCategories = async ( req, res = response  ) =>{
  const { limit = 5, from = 0 } = req.query;

  try{

    const query = { status: true };

    const [ total, categories ] = await Promise.all([
      Category.countDocuments( query ),
      Category.find( query )
      .limit( limit )
      .skip( from )
      .populate({ path: "user", select: "name" })
    ]);

    res.status(200).json({ total, categories });

  }catch(error){

    console.log(error);

    res.status(500).json({
      msg: "Something went wrong finding the categories"
    });
  };
};

// getCategoryByid - Paginated - Total - Popualte

const getCategoryByid = async ( req, res = response) =>{
  const id = req.params.id;

  try{  

    const category = await Category.findById(id)
        .populate({ path: "user", select:"name" });
    
    res.status(200).json(category);

  }catch( error ){
    console.log( error );

    res.status(500).json({
      error,
      msg: "Something went wrong while find Category ID"
    });
  };
};

// updateCategoryByid - Paginated - Total - Popualte

const updateCategoryByid = async (req, res = response) =>{

  const id = req.params.id;

  const { state, user, ...data } = req.body;

  try{

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true })
      .populate( { path: "user", select: "name" } );

    res.status(200).json({
      msg:"Category was updated",
      category
    })
  }catch(error){

    console.log(error);

    res.status(500).json({
      msg: "Something Went Wrong While Update the Category Data",
      error
    });
  };
};

// deleteCategoryByid - Paginated - Total - Popualte
// Change status to False

const deleteCategoryByid = async ( req, res = response) =>{

  const id = req.params.id;

  try{

    const categoryDeleted = await Category.findByIdAndUpdate( id, { status: false },{ new: true });
    const authenticatedUser = req.user;

    res.status(200).json({
      data: categoryDeleted,
      authenticatedUser
    });

  }catch( error ){

    console.log(error);

    res.status( 500 ).json({
      msg: "Something Went Wrong While Delete The Category Data",
      error
    });
  };
};


const createCategory = async (req, res = response) =>{
  
  const name = req.body.name.toUpperCase().trim();

  const categoryDB = await Category.findOne({ name });

  if( categoryDB ){
    return res.status(400).json({
      msg: `Category ${ categoryDB.name } is already exist!`
    });
  };

  const data = {
    name,
    user: req.user._id
  };

  const category = await new Category( data );

  category.save();

  res.status(201).json({ category });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryByid,
  updateCategoryByid,
  deleteCategoryByid
};
