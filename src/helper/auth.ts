import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

dotenv.config();

export class AuthenticationHelper {
  static saltRounds: string = process.env.SALT_ROUNDS || "0";
  static pepper: string = process.env.BCRYPT_PASSWORD || "";
  static tokenSecret: string = process.env.TOKEN_SECRET || "";

  /**
   * Generate JWT token
   * @param {number} id user id.
   * @return {string} returns JWT Token.
   */
  static generateToken(id: number): string {
    return jwt.sign({ id }, String(this.tokenSecret));
  }

  /**
   * Decode JWT token
   * @param {string} token JWT token.
   * @return {User} returns User object.
   */
  static decodeToken(token: string): User {
    return jwt.decode(token) as User;
  }

  /**
   * Generate hashed password using bcrypt
   * @param {string} password user password.
   * @return {string} returns hashed password.
   */
  static hashedPassword(password: string): string {
    return bcrypt.hashSync(password + this.pepper, Number(this.saltRounds));
  }

  /**
   * Verify password using bcrypt
   * @param {string} userPasswordFromDB user's password got from database.
   * @param {string} providedPassword password provided by user.
   * @return {boolean} returns true if password matches else false.
   */
  static verifyPassword(
    userPasswordFromDB: string,
    providedPassword: string
  ): boolean {
    return bcrypt.compareSync(
      providedPassword + this.pepper,
      userPasswordFromDB
    );
  }

  /**
   * Verifies Token provided
   * @param {string} token token provided by user.
   * @return {boolean} returns true if token id valid else false.
   */
  static verifyToken(token: string): boolean {
    const payload = jwt.verify(token, String(this.tokenSecret));
    if (!payload) return false;
    return true;
  }
}
