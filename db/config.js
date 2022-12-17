const mongoose = require("mongoose");

const dbConnection = async () =>{

  try{
    await mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Database online")

  }catch(error){
    console.log(error);
    throw new Error("Error while initializing the database");
  };

};

module.exports = {
  dbConnection
};