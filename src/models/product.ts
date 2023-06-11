import client from "../database/database";

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

export class ProductModel {
    /**
     * Create product in the database
     * @param {Product} product User object to create.
     * @param {string} product.name User name of the user.
     * @param {number} product.price First name of the user.
     * @param {string} product.category Last name of the user.
     * @return {Product} User object that was created.
     */
    async create(product: Product): Promise<Product> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const sql =
                "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *";

            const result = await connection.query(sql, [
                product.name,
                product.price,
                product.category
            ]);
            const createdProduct = result.rows[0];
            connection.release();

            return createdProduct;
        } catch (err) {
            throw new Error(
                `Unable to add new product ${product.name}. Error: ${err}`
            );
        }
    }

    /**
    * Delete product in the database
    * @param {number} id Id of the user.
    * @return {number} No of rows deleted.
    */
    async delete(id: number): Promise<number> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const sql = "DELETE FROM products WHERE id = ($1)";

            const result = await connection.query(sql, [id]);
            const count = result.rowCount;
            connection.release();

            return count;
        } catch (err) {
            throw new Error(
                `Unable to delete product ${id}. Error: ${err}`
            );
        }
    }

    /**
     * Get product based on category from the products table in the database
     * @param {string} category category of the product to be fetched.
     * @return {Product[]} List of Product object based on the category passed.
     */
    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const sql = `SELECT * FROM products WHERE LOWER(category) like LOWER('%${category}%')`;

            const result = await connection.query(sql);
            connection.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Unable to get products. Error: ${err}`);
        }
    }

    /**
     * Get all the products from database
     * @return {Product[]} list of products.
     */
    async index(): Promise<Product[]> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const sql = "SELECT * FROM products";

            const result = await connection.query(sql);
            connection.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Unable to get products. Error: ${err}`);
        }
    }

    /**
     * Get product based on id from the products table in the database
     * @param {number} id Id of the products to be fetched.
     * @return {Product} Products object based on the id passed.
     */
    async show(id: number): Promise<Product> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const sql = "SELECT * FROM products WHERE id=($1)";

            const result = await connection.query(sql, [id]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to get product. Error: ${err}`);
        }
    }

    /**
     * Update product in the database
     * @param {Product} product Product object to create.
     * @param {number} product.id Id of the product.
     * @param {string} product.name name of the product.
     * @param {string} product.price price of the product.
     * @param {string} product.category category of the product.
     * @return {Product} Product object that was edited.
     */
    async update(product: Product): Promise<Product> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const sql =
                "UPDATE products set name = $2, price = $3, category = $4 WHERE id = $1 RETURNING *";

            const result = await connection.query(sql, [
                product.id,
                product.name,
                product.price,
                product.category
            ]);
            const editedProduct = result.rows[0];
            connection.release();

            return editedProduct;
        } catch (err) {
            throw new Error(
                `Unable to update product ${product.name}. Error: ${err}`
            );
        }
    }
}
