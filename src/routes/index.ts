import express, { Request, Response } from "express";
import user from "./api/users";

const routes = express.Router();

routes.use("/api/users", user);

routes.get("/", (_request: Request, response: Response) => {
    response.send("Welcome to Store-front backend!");
  });

export default routes;