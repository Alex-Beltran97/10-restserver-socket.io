const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");
const fileUpload = require("express-fileupload");
const { createServer } = require("http");
const { socketController } = require("../sockets/controller");

class Server {
  constructor() {
    this.app    = express();
    this.port   = process.env.PORT || 3000;
    this.server = createServer( this.app );
    this.io     = require("socket.io")( this.server );

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      uploads: "/api/uploads",
      users: "/api/users",
    };

    // Connect to DB
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes from my app
    this.routes();

    //Sockets

    this.sockets();

  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS

    this.app.use(cors());

    // Public directory

    this.app.use(express.static("public"));

    // Read and parse of body
    this.app.use(express.json());

    // fileupload 
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));

  }

  routes() {
    const { auth, categories, users, products, search, uploads } = this.paths;

    this.app.use(auth, require("../routes/auth.routes"));
    this.app.use(categories, require("../routes/categories.routes"));
    this.app.use(products, require("../routes/products.routes"));
    this.app.use(search, require("../routes/search.routes"));
    this.app.use(uploads, require("../routes/uploads.routes"));
    this.app.use(users, require("../routes/users.routes"));
  }
  
  sockets(){

    this.io.on( "connection", socketController);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server listening in port http://localhost:${this.port}`);
    });
  }
};

module.exports = Server;
