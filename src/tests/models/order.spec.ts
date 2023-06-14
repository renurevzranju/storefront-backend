import { Order, OrderModel } from "../../models/order";
import { User, UserModel } from "../../models/user";
import { Product, ProductModel } from "../../models/product";

const model = new OrderModel();
let order1: Order;
let order2: Order;

const productModel = new ProductModel();
let product1: Product;
let product2: Product;
let product3: Product;

const userModel = new UserModel();
let user1: User;
let user2: User;

describe("Order Model Test Suite", (): void => {
  beforeAll(async () => {
    user1 = await userModel.create({
      user_name: "tom_jerry",
      first_name: "Thomas",
      last_name: "Jasper Cat",
      password: "TomAndJerry",
    });

    user2 = await userModel.create({
      user_name: "fred_flintStone",
      first_name: "Fred",
      last_name: "FlintStone",
      password: "FlintStoneFamily",
    });

    product1 = await productModel.create({
      name: "Penne Pasta",
      price: 80,
      category: "food",
    });

    product2 = await productModel.create({
      name: "Vanilla Ice cream",
      price: 100,
      category: "dessert",
    });

    product3 = await productModel.create({
      name: "Sauce Pan",
      price: 150,
      category: "cookware",
    });
  });

  it("should have an index method", () => {
    expect(model.index).toBeDefined();
  });

  it("should have a create method", () => {
    expect(model.create).toBeDefined();
  });

  it("should have a show method", () => {
    expect(model.show).toBeDefined();
  });

  it("should have delete method", () => {
    expect(model.delete).toBeDefined();
  });

  it("should create a product", async (): Promise<void> => {
    order1 = await model.create({
      status: "active",
      user_id: user1.id as unknown as number,
      products: [
        {
          product_id: product1.id as unknown as number,
          quantity: 2,
        },
        {
          product_id: product2.id as unknown as number,
          quantity: 5,
        },
      ],
    });
    expect(Number(order1.user_id)).toEqual(user1.id as unknown as number);
    expect(order1.status).toEqual("active");
    expect(order1.id).toBeDefined();

    order2 = await model.create({
      status: "completed",
      user_id: user2.id as unknown as number,
      products: [
        {
          product_id: product1.id as unknown as number,
          quantity: 4,
        },
        {
          product_id: product2.id as unknown as number,
          quantity: 8,
        },
      ],
    });
    expect(Number(order2.user_id)).toEqual(user2.id as unknown as number);
    expect(order2.status).toEqual("completed");
    expect(order2.id).toBeDefined();
  });

  it("should get all orders", async (): Promise<void> => {
    const getAllOrders = await model.index();

    expect(getAllOrders.length).toBe(2);
    expect(getAllOrders[0].user_id).toEqual(order1.user_id);
    expect(getAllOrders[1].user_id).toEqual(order2.user_id);
    expect(getAllOrders[0].status).toEqual(order1.status);
    expect(getAllOrders[1].status).toEqual(order2.status);
  });

  it("should get order based on id", async (): Promise<void> => {
    const order = await model.show(order1.id as unknown as number);

    expect(order.user_id).toEqual(order1.user_id);
    expect(order.status).toEqual(order1.status);
  });

  it("should add product to the order", async (): Promise<void> => {
    const addedProduct = await model.addProduct({
      product_id: product3.id as unknown as number,
      order_id: order1.id as unknown as number,
      quantity: 1,
    });

    expect(Number(addedProduct.order_id)).toEqual(
      order1.id as unknown as number
    );
    expect(addedProduct.quantity).toEqual(1);
  });

  it("should get order by status", async (): Promise<void> => {
    const activeOrder = await model.getOrdersByStatus(
      "active",
      user1.id as unknown as number
    );
    //Returns number of products in the order
    expect(activeOrder.length).toEqual(3);
    expect(Number(activeOrder[0].id)).toEqual(order1.id as unknown as number);

    const completedOrder = await model.getOrdersByStatus(
      "completed",
      user2.id as unknown as number
    );

    //Returns number of products in the order
    expect(completedOrder.length).toEqual(2);
    expect(Number(completedOrder[0].id)).toEqual(
      order2.id as unknown as number
    );
  });

  it("should update order status", async (): Promise<void> => {
    const order = await model.updateStatus(
      order1.id as unknown as number,
      "completed"
    );

    expect(order.status).not.toEqual(order1.status);
  });

  it("should delete the user", async (): Promise<void> => {
    await model.delete(order1.id as unknown as number);
    const result = await model.index();

    expect(result.length).toBe(1);

    expect(result[0].user_id).toEqual(order2.user_id);
    expect(result[0].status).toEqual(order2.status);
  });

  // Clean up
  afterAll(async () => {
    await model.deleteAll();
    await productModel.deleteAll();
    await userModel.deleteAll();
  });
});
