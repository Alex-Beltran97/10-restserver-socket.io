const { response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");
const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;

cloudinary.config( process.env.CLOUDINARY_URL );


const loadFile = async (req, res = response) => {
  
  try{

    // Images
    const name = await uploadFile( req.files, undefined, "images" );
  
    res.json({
      name
    });
  }catch( error ){

    res.status( 400 ).json({ msg: error });
  };
  
};

const updateImage = async ( req, res = response ) =>{
  
  const { collection, id } = req.params;

  let model;

  switch( collection ){
    case "users":

      model = await User.findById( id );

      if( !model ) return res.status( 400 ).json({ msg: `There is no user with the ID ${ id }` });

      
    break;
    case "products":

      model = await Product.findById( id );

      if( !model ) return res.status( 400 ).json({ msg: `There is no user with the ID ${ id }` });


    break;
    default:
      return res.status( 500 ).json({ msg: "Forgot validate collection type" });
    break;
  };

  // Clean preview images

  if ( model.img ){
    // Must to delete image from server
    const pathIamge = path.join( __dirname, "../uploads", collection, model.img );

    if( fs.existsSync( pathIamge ) ){
      fs.unlinkSync( pathIamge );
    };
  };

  const name = await uploadFile( req.files, undefined, collection );
  model.img = name;

  await model.save();
  
  res.json( model );
};

const updateImageCloudinary = async ( req, res = response ) =>{
  
  const { collection, id } = req.params;

  let model;

  switch( collection ){
    case "users":

      model = await User.findById( id );

      if( !model ) return res.status( 400 ).json({ msg: `There is no user with the ID ${ id }` });

      
    break;
    case "products":

      model = await Product.findById( id );

      if( !model ) return res.status( 400 ).json({ msg: `There is no user with the ID ${ id }` });


    break;
    default:
      return res.status( 500 ).json({ msg: "Forgot validate collection type" });
    break;
  };

  // Clean preview images

  if ( model.img ){
    const nameArr = model.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [ public_id ] = name.split(".");

    cloudinary.uploader.destroy( public_id );
  };

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

  model.img = secure_url;

  await model.save();
  
  res.json( model );
};

const showImage = async (req, res = response) =>{

  const { collection, id } = req.params;

  let model;

  switch( collection ){
    case "users":

      model = await User.findById( id );

      if( !model ) return res.status( 400 ).json({ 
        msg: `There is no user with the ID ${ id }` 
      });

      
    break;
    case "products":

      model = await Product.findById( id );

      if( !model ) return res.status( 400 ).json({ 
        msg: `There is no user with the ID ${ id }` 
      });

    break;
    default:
      return res.status( 500 ).json({ msg: "Forgot validate collection type" });
  };

  // Clean preview images

  if ( model.img ){
    // Must to delete image from server
    const pathIamge = path.join( __dirname, "../uploads", collection, model.img );

    if( fs.existsSync( pathIamge ) ){
      return res.sendFile( pathIamge );
    };
  };

   const placeholderImg = path.join( __dirname, "../assets", "no-image.jpg" );

  res.sendFile( placeholderImg );
};

module.exports = {
  loadFile,
  showImage,
  updateImage,
  updateImageCloudinary
};