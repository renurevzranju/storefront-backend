import { Response, Request } from "express";
import { OrderModel } from "../models/order";

const model = new OrderModel();

export default class ProductHandler {

    async create(_request: Request, response: Response) {

        try {
            const { user_id } = _request.params
            const { status, products } = _request.body;
            if (status && products.length > 0 && user_id) {
                const orderPlaced = await model.create({
                    user_id, status, products
                });
                response.status(200).json({ message: "Order created successfully" });
            } else {
                response.status(400).json({ error: `status and products are required to create an order` });
            }

        } catch (error) {
            response.status(500).json(`error while creating order: ${error}`);
        }
    }

    async addProduct(_request: Request, response: Response){

        try {
            const { order_id, product_id, quantity } = _request.body;
            if (order_id && product_id && quantity) {
                const addProductToOrder = await model.addProduct({
                    order_id, product_id, quantity
                });
                response.status(200).json({ message: "Products are added successfully", products: addProductToOrder });
            } else {
                response.status(400).json({ message: `order_id, product_id and quantity are required to add a product to an order` });
            }

        } catch (error) {
            response.status(500).json(`error while adding product to the order: ${error}`);
        }
    }

    async delete(_request: Request, response: Response) {
        try {
            const { id } = _request.params;
            const rowCount = await model.delete(Number(id));
            if (rowCount > 0) {
                response.status(200).json({ message: `Successfully deleted order with id: ${id}` });
            }
            else {
                response.status(400).json({ message: `Couldn't delete order with id: ${id}` });
            }
        }
        catch (error) {
            response.status(500).json(`error while deleting the order: ${error}`);
        }
    }

    async index(_request: Request, response: Response) {
        try {
            const orders = await model.index();
            response.status(200).json(orders);
        } catch (error) {
            response.status(500).json(`error while fetching the order list: ${error}`);
        }
    }

    async getOrderByStatus(_request: Request, response: Response) {
        const { status, id } = _request.params;
        try {
            const orders = await model.getOrdersByStatus(status, Number(id));
            //If product is empty check
            if (orders.length < 1) return response.status(200).json({ message: `Provide status as "active or completed" and valid user_id OR there are no orders with provided input` });

            response.status(200).json(orders);

        } catch (error) {
            response.status(500).json(`error while fetching the order by status [${status}]: ${error}`);
        }
    }

    async show(_request: Request, response: Response) {
        try {
            const id = _request.params.id;
            const orders = await model.show(Number(id));
            response.status(200).json(orders);
        } catch (error) {
            response.status(500).json(`error while fetching the order: ${error}`);
        }
    }
}