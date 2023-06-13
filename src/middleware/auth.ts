import { Request, Response, NextFunction } from "express";
import { AuthenticationHelper } from "../helper/authentication";

/**
 * Middleware for JWT authentication
 * @param {Request} request express request.
 * @param {Response} response express response.
 * @param {NextFunction} next next function.
 * @return {void} returns nothing.
 */
export default function authenticate(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    try {
        const authToken = request.headers.authorization || "";
        const split = authToken.split(" ");
        const token = split.length > 1 ? split[1] : authToken;

        const authenticated = AuthenticationHelper.verifyToken(token);
        authenticated ? next() : response.status(400).send("Authentication failed");
    } catch (error) {
        response.status(401).send(`error authenticating: ${error}`);
    }
}
