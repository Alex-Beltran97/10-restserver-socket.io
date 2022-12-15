const { response } = require("express");

const usersGet = (req,res = response)=>{

  const { q, name = "No name" , apikey, page = "1", limit} = req.query;

  res.json({
    ok:true,
    msg:"get api - Controller",
    q, 
    name,
    apikey,
    page, 
    limit
  });
};

const usersPost = (req,res = response)=>{
  const { name, age } = req.body;
  res.json({
    msg: "Post api - Controller",
    name,
    age
  });
};
const usersPut = (req,res = response)=>{
  const id = req.params.id;

  res.json({
    ok:true,
    msg:"Put api - Controller",
    id
  });
};

const usersPatch = (req,res = response)=>{
  res.json({
    ok:true,
    msg:"Patch api - Controller"
  });
};

const usersDelete = (req,res = response)=>{
  res.json({
    ok:true,
    msg:"Delte api - Controller"
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete
};