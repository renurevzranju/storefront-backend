import express from "express";
import authenticate from "../../middleware/authentication";
import ProductHandler from "../../handlers/product";

const products = express.Router();
const productHandler = new ProductHandler();

//Create product
products.post("/create", authenticate, (request, response) => {
  productHandler.create(request, response);
});

//Delete product based on product id
products.delete("/:id", (request, response) => {
  productHandler.delete(request, response);
});

//get products based on category
products.get("/category/:category", (request, response) => {
  productHandler.getProductsByCategory(request, response);
});

//Index - Get all products
products.get("/", (request, response) => {
  productHandler.index(request, response);
});

//Get Top 5 popular products
products.get("/popular", (request, response) => {
  productHandler.getPopularProducts(request, response);
});

//Show - Get product based on product id
products.get("/:id", (request, response) => {
  productHandler.show(request, response);
});

//Edit product based on product id
products.put("/:id", (request, response) => {
  productHandler.update(request, response);
});

export default products;
