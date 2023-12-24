const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productsRouters = require("./routes/Products");
const categoriesRouter = require("./routes/Categorys");
const brandRouter = require("./routes/Brands");
var cors = require("cors");

//middlewares
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); // to parse req.body
server.use("/products", productsRouters.router);
server.use("/categories", categoriesRouter.router);
server.use("/brands", brandRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("Databse connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(8080, () => {
  console.log("server started");
});
