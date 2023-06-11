import { Response, Request } from "express";
import { UserModel } from "../models/user";
import { AuthenticationHelper } from "../helper/authentication";

const model = new UserModel();

export default class UserHandler {
    async index(_request: Request, response: Response) {
        try {
            const users = await model.index();
            response.status(200).json(users);
        } catch (error) {
            response.status(500).json(`error while fetching user list: ${error}`);
        }
    }

    async show(_request: Request, response: Response) {
        try {
            const id = _request.params.id;
            const users = await model.show(Number(id));
            response.status(200).json(users);
        } catch (error) {
            response.status(500).json(`error while fetch user: ${error}`);
        }
    }

    async create(_request: Request, response: Response) {
        try {
            const { user_name, first_name, last_name, password } = _request.body;
            if (user_name && first_name && last_name && password) {
                const hash = AuthenticationHelper.hashedPassword(password);
                const users = await model.create({
                    user_name, first_name, last_name, password: hash
                });

                const token = AuthenticationHelper.generateToken(Number(users.id));
                response.status(200).json({ message: "User created successfully", token: token });
            } else {
                response.status(400).json({ error: `user_name, first_name, last_name and password are required` });
            }

        } catch (error) {
            response.status(500).json(`error while creating user: ${error}`);
        }
    }

    async update(_request: Request, response: Response) {
        try {
            const { id } = _request.params;
            const { user_name, first_name, last_name, password } = _request.body;
            const hash = AuthenticationHelper.hashedPassword(password);

            const user = await model.update({
                id: Number(id), user_name, first_name, last_name, password: hash
            });

            response.status(200).json(user);
        }
        catch (error) {
            response.status(500).json(`error while update the user: ${error}`);
        }
    }

    async delete(_request: Request, response: Response) {
        try {
            const { id } = _request.params;
            const rowCount = await model.delete(Number(id));
            if (rowCount > 0) {
                response.status(200).json({ message: `Successfully deleted user with id: ${id}` });
            }
            else {
                response.status(400).json({ message: `Couldn't delete user with id: ${id}` });
            }
        }
        catch (error) {
            response.status(500).json(`error while update the user: ${error}`);
        }
    }

    async login(_request: Request, response: Response) {
        try {
            const { user_name, password } = _request.body;
            //user_name and password values are required check
            if(!(user_name && password)) return response.status(400).json({ error: `user_name and password are required` });

            const user = await model.getUserByUserName(user_name);
            //If user is empty check
            if(!user) return response.status(401).json({ error: `Invalid user_name or password provided` });

            const passwordMatches = AuthenticationHelper.verifyPassword(user.password, password);
            if (!passwordMatches) return response.status(401).json({ error: `Verify user_name and password again` });

            const token = AuthenticationHelper.generateToken(Number(user.id));
            response.status(200).json({ message: "Logged in successfully", token: token });

        } catch (error) {
            response.status(500).json(`error while creating user: ${error}`);
        }
    }
}