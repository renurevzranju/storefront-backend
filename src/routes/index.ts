import express, { Request, Response } from "express";
import user from "./api/users";
import product from "./api/products";

const routes = express.Router();

routes.use("/api/users", user);
routes.use("/api/products", product);

routes.get("/", (_request: Request, response: Response) => {
    response.send("Welcome to Store-front backend!");
  });

export default routes;