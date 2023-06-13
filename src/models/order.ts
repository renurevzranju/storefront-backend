import client from "../database/database";

export type Order = {
  id?: number;
  user_id: string;
  products: OrderProduct[];
  status: string;
};

export type OrderProduct = {
  product_id: number;
  order_id: number;
  quantity: number;
  name?: string;
}

export class OrderModel {
  /**
   * Add Products to the order in the database
   * @param {OrderProduct} product Products object to create.
   * @param {number} product.order_id order id.
   * @param {number} product.product_id product id.
   * @param {number} product.quantity quantity of the product.
   * @return {OrderProduct} returns added product in the order.
   */
  async addProduct(product: OrderProduct): Promise<OrderProduct> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = `INSERT INTO order_products (order_id, product_id, quantity) VALUES(${Number(product.order_id)}, ${Number(product.product_id)}, ${Number(product.quantity)}) RETURNING *`;
      const result = await connection.query(sql);

      connection.release();

      return result.rows[0];

    } catch (err) {
      throw new Error(
        `Unable to add new order. ${err}`
      );
    }
  }

  /**
   * Create order in the database
   * @param {Order} order Order object to create.
   * @param {string} order.user_id User id of the user who places the order.
   * @param {string} order.status status of the order.
   * @param {OrderProduct} order.products Products that the user orders.
   * @return {void} returns nothing.
   */
  async create(order: Order): Promise<Order> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql =
        "INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *";

      const result = await connection.query(sql, [
        order.status,
        order.user_id
      ]);
      const createdOrder = result.rows[0];

      order.products.forEach(async p => {
        const sql = `INSERT INTO order_products (order_id, product_id, quantity) VALUES(${createdOrder.id}, ${Number(p.product_id)}, ${Number(p.quantity)})`;
        await connection.query(sql);
      });

      connection.release();

      return createdOrder;

    } catch (err) {
      throw new Error(
        `Unable to add new order. ${err}`
      );
    }
  }

  /**
  * Delete order in the database
  * @param {number} id Id of the order.
  * @return {number} No of rows deleted.
  */
  async delete(id: number): Promise<number> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = "DELETE FROM order_products WHERE order_id = ($1)";

      await connection.query(sql, [id]);

      const deleteOrderQuery = "DELETE FROM orders WHERE id = ($1)";
      const order = await connection.query(deleteOrderQuery, [id]);
      const count = order.rowCount;

      connection.release();

      return count;
    } catch (err) {
      throw new Error(
        `Unable to delete order ${id}. ${err}`
      );
    }
  }

  /**
   * Get order based on status from the orders table in the database
   * @param {string} status status of the order to be fetched.
   * @param {number} user_id order to be fetched based on userId.
   * @return {Order[]} List of order object based on the status passed.
   */
  async getOrdersByStatus(status: string, user_id: number): Promise<Order[]> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = `SELECT o.id AS order_id, p.name as product_name, op.quantity FROM orders o INNER JOIN order_products op ON o.id = op.order_id
                INNER JOIN products p ON p.id = op.product_id  WHERE LOWER(status) = LOWER('${status}') AND user_id = ${user_id}`;

      const result = await connection.query(sql);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get orders based on status[${status}]. Error: ${err}`);
    }
  }

  /**
   * Get all the orders from database
   * @return {Order[]} list of orders.
   */
  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = "SELECT * FROM orders";

      const result = await connection.query(sql);
      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get orders. ${err}`);
    }
  }

  /**
   * Get order based on id from the orders table in the database
   * @param {number} id Id of the order to be fetched.
   * @return {Order} Orders object based on the id passed.
   */
  async show(id: number): Promise<Order> {
    try {
      // @ts-ignore
      const connection = await client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1)";

      const result = await connection.query(sql, [id]);
      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get order. Error: ${err}`);
    }
  }
}
