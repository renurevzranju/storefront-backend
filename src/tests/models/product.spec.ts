import { Product, ProductModel } from "../../models/product";

const model = new ProductModel();
let product1: Product;
let product2: Product;

describe("Product Model Test Suite", (): void => {
  it("should have an index method", () => {
    expect(model.index).toBeDefined();
  });

  it("should have a create method", () => {
    expect(model.create).toBeDefined();
  });

  it("should have a show method", () => {
    expect(model.show).toBeDefined();
  });

  it("should have update method", () => {
    expect(model.update).toBeDefined();
  });

  it("should have delete method", () => {
    expect(model.delete).toBeDefined();
  });

  it("should create a product", async (): Promise<void> => {
    product1 = await model.create({
      name: "Penne Pasta",
      price: 80,
      category: "food",
    });
    expect(product1.name).toEqual("Penne Pasta");
    expect(product1.price).toEqual(80);
    expect(product1.category).toEqual("food");
    expect(product1.id).toBeDefined();

    product2 = await model.create({
      name: "Vanilla Ice cream",
      price: 100,
      category: "dessert",
    });
    expect(product2.name).toEqual("Vanilla Ice cream");
    expect(product2.price).toEqual(100);
    expect(product2.category).toEqual("dessert");
    expect(product2.id).toBeDefined();
  });

  it("should get all products", async (): Promise<void> => {
    const getAllProducts = await model.index();

    expect(getAllProducts.length).toBe(2);
    expect(getAllProducts[0].name).toEqual(product1.name);
    expect(getAllProducts[1].name).toEqual(product2.name);
    expect(getAllProducts[0].price).toEqual(product1.price);
    expect(getAllProducts[1].price).toEqual(product2.price);
    expect(getAllProducts[0].category).toEqual(product1.category);
    expect(getAllProducts[1].category).toEqual(product2.category);
  });

  it("should get product based on id", async (): Promise<void> => {
    const product = await model.show(product1.id as unknown as number);

    expect(product.name).toEqual(product1.name);
    expect(product.price).toEqual(product1.price);
    expect(product.category).toEqual(product1.category);
  });

  it("should update product based on id", async (): Promise<void> => {
    const product = await model.update({
      id: product1.id,
      name: "Chocolate Ice cream",
      price: 60,
      category: "dessert",
    });

    expect(product.name).toEqual("Chocolate Ice cream");
    expect(product.price).toEqual(60);
    expect(product.category).toEqual("dessert");
  });

  it("should delete the user", async (): Promise<void> => {
    await model.delete(product1.id as unknown as number);
    const result = await model.index();

    expect(result.length).toBe(1);

    expect(result[0].name).toEqual(product2.name);
    expect(result[0].price).toEqual(product2.price);
    expect(result[0].category).toEqual(product2.category);
  });

  // Clean up
  afterAll(async () => {
    await model.deleteAll();
  });
});
