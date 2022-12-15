const express = require("express");
const cors = require("cors");

class Server {
  constructor(){
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usersPath = "/api/users";

    // Middlewares
    this.middlewares();

    // Routes from my app
    this.routes();
  };

  middlewares(){
    // CORS

    this.app.use( cors() );

    // Public directory

    this.app.use(express.static("public"));
    
    // Public directory

    // Read and parse of body
    this.app.use( express.json() );
  };

  routes() {

    this.app.use(this.usersPath, require("../routes/users.routes"));

  };

  listen(){
    this.app.listen(this.port,()=>{
      console.log(`Server listening in port http://localhost:${ this.port }`);
    });
  };
};

module.exports = Server;
