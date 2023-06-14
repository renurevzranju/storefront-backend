import supertest from "supertest";
import app from "../../server";
import { AuthenticationHelper } from "../../helper/auth";
import { User } from "../../models/user";
import { Product } from "../../models/product";

const request = supertest(app);

describe("product endpoint test suites", (): void => {
  let token: string;
  let user: User;
  let product1: Product;
  let product2: Product;

  beforeAll(async () => {
    const response = await request.post("/api/users/").send({
      "first_name": "Aisha",
      "last_name": "William",
      "user_name": "aisha_blogs",
      "password": "enjoyEveryDay",
    });
    token = response.body.token as string;
    user = AuthenticationHelper.decodeToken(token) as User;
  });

  it("should create product: POST /api/products/create", async (): Promise<void> => {
    let response = await request.post("/api/products/create").send({
      name: "Pepsi",
      price: 100,
      category: "beverages",
    }).set("Authorization", token);

    product1 = response.body.product as Product;

    expect(response.status).toEqual(200);
    expect(product1.id).toBeDefined();
    expect(product1.name).toEqual("Pepsi");
    expect(product1.price).toEqual(100);
    expect(product1.category).toEqual("beverages");

    response = await request.post("/api/products/create").send({
      name: "Maggi Noodles",
      price: 95,
      category: "food",
    }).set("Authorization", token);

    product2 = response.body.product as Product;

    expect(response.status).toEqual(200);
    expect(product1.id).toBeDefined();
    expect(product2.name).toEqual("Maggi Noodles");
    expect(product2.price).toEqual(95);
    expect(product2.category).toEqual("food");
  });

  it("should get product based on id. GET /api/products/:id", async (): Promise<void> => {
    const response = await request.get(`/api/products/${product1.id}`).set("Authorization", token);

    expect(response.body.name).toEqual("Pepsi");
    expect(response.body.price).toEqual(100);
    expect(response.body.category).toEqual("beverages");
  });

  it("should get all products. GET /api/products/", async (): Promise<void> => {
    const response = await request.get("/api/products/").set("Authorization", token);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].name).toEqual("Pepsi");
    expect(response.body[0].price).toEqual(100);
    expect(response.body[0].category).toEqual("beverages");
    expect(response.body[1].name).toEqual("Maggi Noodles");
    expect(response.body[1].price).toEqual(95);
    expect(response.body[1].category).toEqual("food");
  });

  it("should update a product. PUT /api/products/:id", async (): Promise<void> =>{
    const response = await request.put(`/api/products/${product2.id}`).set("Authorization", token).send({
      name: "Johnson Baby oil",
      price: 52,
      category: "toiletries",
    });

    expect(response.body.name).toEqual("Johnson Baby oil");
    expect(response.body.price).toEqual(52);
    expect(response.body.category).toEqual("toiletries");
  });

  // Clean up
  afterAll(async () => {
    await request
      .delete("/api/products")
      .send({ id: product1.id })
      .set("Authorization", token);

    await request
      .delete("/api/products")
      .send({ id: product2.id })
      .set("Authorization", token);

    await request
      .delete("/api/users")
      .send({ id: user.id })
      .set("Authorization", token);
  });
});
