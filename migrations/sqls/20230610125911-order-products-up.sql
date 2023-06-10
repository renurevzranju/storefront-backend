CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id),
    CONSTRAINT FK_order_id FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT FK_product_id FOREIGN KEY (product_id) REFERENCES products(id)
);