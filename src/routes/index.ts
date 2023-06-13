import express, { Request, Response } from "express";
import user from "./api/users";
import product from "./api/products";
import order from "./api/orders";

const routes = express.Router();

routes.use("/api/users", user);
routes.use("/api/products", product);
routes.use("/api/orders", order);

routes.get("/", (_request: Request, response: Response) => {
  response.send("Welcome to Store-front backend!");
});

export default routes;