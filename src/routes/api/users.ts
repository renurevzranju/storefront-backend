import express from "express";
import authenticate from "../../middleware/authentication";
import UserHandler from "../../handlers/user";

const users = express.Router();
const userHandler = new UserHandler();

//Create user
users.post("/", (request, response) => {
  userHandler.create(request, response);
});

//Delete user based on user id
users.delete("/:id", authenticate, (request, response) => {
  userHandler.delete(request, response);
});

//Login - verify password and generate token again
users.post("/login", (request, response) => {
  userHandler.login(request, response);
});

//Index - Get all users
users.get("/", authenticate, (request, response) => {
  userHandler.index(request, response);
});

//Show - Get user based on user id
users.get("/:id", authenticate, (request, response) => {
  userHandler.show(request, response);
});

//Edit user based on user id
users.put("/:id", authenticate, (request, response) => {
  userHandler.update(request, response);
});

export default users;
