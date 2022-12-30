const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      users: "/api/users",
    };

    // Connect to DB
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes from my app
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS

    this.app.use(cors());

    // Public directory

    this.app.use(express.static("public"));

    // Public directory

    // Read and parse of body
    this.app.use(express.json());
  }

  routes() {
    const { auth, categories, users, products, search } = this.paths;

    this.app.use(auth, require("../routes/auth.routes"));
    this.app.use(categories, require("../routes/categories.routes"));
    this.app.use(products, require("../routes/products.routes"));
    this.app.use(search, require("../routes/search.routes"));
    this.app.use(users, require("../routes/users.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening in port http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
