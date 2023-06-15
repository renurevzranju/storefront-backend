import supertest from "supertest";
import app from "../../server";
import { AuthenticationHelper } from "../../helper/auth";
import { User } from "../../models/user";
import { Product } from "../../models/product";
import { Order } from "../../models/order";

const request = supertest(app);

describe("order endpoint test suites", (): void => {
  let token: string;
  let user: User;
  let product1: Product;
  let product2: Product;
  let order1: Order;
  let order2: Order;

  beforeAll(async () => {
    let response = await request.post("/api/users/").send({
      first_name: "Aisha",
      last_name: "William",
      user_name: "aisha_blogs",
      password: "enjoyEveryDay",
    });
    token = response.body.token as string;
    user = AuthenticationHelper.decodeToken(token) as User;

    response = await request
      .post("/api/products/create")
      .send({
        name: "Pepsi",
        price: 100,
        category: "beverages",
      })
      .set("Authorization", token);

    product1 = response.body.product as Product;

    response = await request
      .post("/api/products/create")
      .send({
        name: "Maggi Noodles",
        price: 95,
        category: "food",
      })
      .set("Authorization", token);

    product2 = response.body.product as Product;
  });

  it("should create orders: POST /api/orders/create/user_id", async (): Promise<void> => {
    let response = await request
      .post(`/api/orders/create/${user.id}`)
      .send({
        status: "active",
        products: [
          {
            product_id: product1.id,
            quantity: 2,
          },
          {
            product_id: product2.id,
            quantity: 3,
          },
        ],
      })
      .set("Authorization", token);

    order1 = response.body.order as Order;

    response = await request
      .post(`/api/orders/create/${user.id}`)
      .send({
        status: "completed",
        products: [
          {
            product_id: product2.id,
            quantity: 5,
          },
        ],
      })
      .set("Authorization", token);

    order2 = response.body.order as Order;
  });

  it("should get order based on status. GET /api/orders/getOrderByStatus/:id/active", async (): Promise<void> => {
    const response = await request
      .get(`/api/orders/getOrderByStatus/${user.id}/active`)
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should get order based on status. GET /api/orders/getOrderByStatus/:id/completed", async (): Promise<void> => {
    const response = await request
      .get(`/api/orders/getOrderByStatus/${user.id}/completed`)
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
  });

  it("should get order based on id. GET /api/orders/:id", async (): Promise<void> => {
    const response = await request
      .get(`/api/orders/${order1.id}`)
      .set("Authorization", token);

    expect(response.body.status).toEqual("active");
    expect(Number(response.body.user_id)).toEqual(user.id as unknown as number);
  });

  it("should get all orders. GET /api/orders/", async (): Promise<void> => {
    const response = await request
      .get("/api/orders/")
      .set("Authorization", token);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].status).toEqual("active");
    expect(response.body[1].status).toEqual("completed");
  });

  it("should update a status of the order. PUT /api/orders/status/:user_id", async (): Promise<void> => {
    const response = await request
      .put(`/api/orders/status/${user.id}`)
      .set("Authorization", token)
      .send({
        id: order1.id,
        status: "completed",
      });

    expect(response.body.order.status).not.toEqual(order1.status);
  });

  it("should delete orders", async (): Promise<void> => {
    let response = await request
      .delete(`/api/orders/deleteOrder/${order1.id}`)
      .set("Authorization", token);
    expect(response.status).toEqual(200);

    response = await request
      .delete(`/api/orders/deleteOrder/${order2.id}`)
      .set("Authorization", token);
    expect(response.status).toEqual(200);
  });

  // Clean up
  afterAll(async (): Promise<void> => {
    await request
      .delete("/api/products/")
      .send({ id: product1.id })
      .set("Authorization", token);

    await request
      .delete("/api/products/")
      .send({ id: product2.id })
      .set("Authorization", token);

    await request
      .delete("/api/users/")
      .send({ id: user.id })
      .set("Authorization", token);
  });
});
