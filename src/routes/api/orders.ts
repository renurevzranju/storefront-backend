import express from "express";
import authenticate from "../../middleware/auth";
import OrderHandler from "../../handlers/order";

const orders = express.Router();
const orderHandler = new OrderHandler();

//Add Products to an order
orders.post("/addProduct", authenticate, (request, response) => {
    orderHandler.addProduct(request, response);
});

//Create order
orders.post("/create/:user_id", authenticate, (request, response) => {
    orderHandler.create(request, response);
});

//Delete order based on order id
orders.delete("/deleteOrder/:id", authenticate, (request, response) => {
    orderHandler.delete(request, response);
});

//get orders based on status and user id
orders.get("/getOrderByStatus/:id/:status", authenticate, (request, response) => {
    orderHandler.getOrderByStatus(request, response);
});

//Index - Get all orders
orders.get("/", authenticate, (request, response) => {
    orderHandler.index(request, response);
});

//Show - Get order based on product id
orders.get("/:id", authenticate, (request, response) => {
    orderHandler.show(request, response);
});

export default orders;
