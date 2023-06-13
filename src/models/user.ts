import client from "../database/database";

export type User = {
  id?: number;
  user_name: string;
  first_name: string;
  last_name: string;
  password: string;
};

export class UserModel {
  /**
   * Create user in the database
   * @param {User} user User object to create.
   * @param {string} user.user_name User name of the user.
   * @param {string} user.first_name First name of the user.
   * @param {string} user.last_name Last name of the user.
   * @param {string} user.password Hashed Password of user.
   * @return {User} User object that was created.
   */
  async create(user: User): Promise<User> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql =
        "INSERT INTO users (first_name, last_name, user_name, password) VALUES($1, $2, $3, $4) RETURNING *";

      const result = await connection.query(sql, [
        user.first_name,
        user.last_name,
        user.user_name,
        user.password,
      ]);
      const createdUser = result.rows[0];
      connection.release();

      return createdUser;
    } catch (err) {
      throw new Error(
        `Unable to add new user ${user.user_name}. Error: ${err}`
      );
    }
  }

  /**
  * Delete user in the database
  * @param {number} id Id of the user.
  * @return {number} No of rows deleted.
  */
  async delete(id: number): Promise<number> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = "DELETE FROM users WHERE id = ($1)";

      const result = await connection.query(sql, [id]);
      const count = result.rowCount;
      connection.release();

      return count;
    } catch (err) {
      throw new Error(
        `Unable to delete user ${id}. Error: ${err}`
      );
    }
  }

  /**
   * Get user based on user_name from the users table in the database
   * @param {string} user_name username of the user to be fetched.
   * @return {User} User object based on the id passed.
   */
  async getUserByUserName(user_name: string): Promise<User> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = `SELECT * FROM users WHERE user_name='${user_name}'`;

      const result = await connection.query(sql);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get user. Error: ${err}`);
    }
  }

  /**
   * Get all the users from database
   * @return {User[]} list of users.
   */
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = "SELECT * FROM users";

      const result = await connection.query(sql);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get users. Error: ${err}`);
    }
  }

  /**
   * Get user based on id from the users table in the database
   * @param {number} id Id of the user to be fetched.
   * @return {User} User object based on the id passed.
   */
  async show(id: number): Promise<User> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = "SELECT * FROM users WHERE id=($1)";

      const result = await connection.query(sql, [id]);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get user. Error: ${err}`);
    }
  }

  /**
   * Update user in the database
   * @param {User} user User object to create.
   * @param {number} user.id Id of the user.
   * @param {string} user.user_name User name of the user.
   * @param {string} user.first_name First name of the user.
   * @param {string} user.last_name Last name of the user.
   * @param {string} user.password Hashed Password of user.
   * @return {User} User object that was edited.
   */
  async update(user: User): Promise<User> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql =
        "UPDATE users set first_name = $2, last_name = $3, user_name = $4, password = $5 WHERE id = $1 RETURNING *";

      const result = await connection.query(sql, [
        user.id,
        user.first_name,
        user.last_name,
        user.user_name,
        user.password,
      ]);
      const editedUser = result.rows[0];
      connection.release();

      return editedUser;
    } catch (err) {
      throw new Error(
        `Unable to update user ${user.user_name}. Error: ${err}`
      );
    }
  }
}
