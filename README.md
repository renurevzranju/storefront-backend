# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

### Setting up the environment
After cloning/downloading this repo, create a file named '.env' and add the below environment variables.

```
POSTGRES_HOST = 127.0.0.1
POSTGRES_DB = store
POSTGRES_TEST_DB = store_test
POSTGRES_USER = test_user
POSTGRES_PASSWORD = test_user
ENV = dev
BCRYPT_PASSWORD = find_me_if_you_can
SALT_ROUNDS = 10
TOKEN_SECRET = gryffindor
```

### Setting up postgresql
I'm using Windows OS, so all my commands will be related to that.

1. Install the PostgreSQL from [here](https://www.postgresql.org/download/windows). Ignore if you have installed it already.
2. Run `psql postgres` and login to the PostgreSQL database.
3. Run `CREATE USER test_user CREATEDB CREATEROLE PASSWORD 'test_user' to create a user `test_user` with password `test_user` and have privileges to create db and new role.
4. Run `CREATE DATABASE store WITH OWNER = test_user;` and `CREATE DATABASE store_test WITH OWNER = test_user;` to create the database `store` and `store_test` is created for testing.
5. Run `psql -h localhost -U test_user -d store` to check if the user is able to access the database store.

### Run Locally

Clone the project
```
  git clone https://github.com/renurevzranju/storefront-backend.git
```

Go to the project directory
```
  cd storefront-backend
```

Install dependencies
```
  npm install
```

#### Scripts

Build script to compile TS to JS
```
  npm run build
```

Start the application after build
```
  npm run start
```

Start the application in watch mode
```
  npm run watch
```

Run Unit Test using Jasmine Library
```
  npm run test
```

Format the code
```
  npm run prettier
```

Lint the code
```
  npm run lint
```

## Usage

Server will be running on port 5000

### API Endpoints

#### Users
- POST http://localhost:5000/api/users -Create. Parameters are `user_name`, `password`, `first_name` and `last_name. On successful creation, JWT token will be returned. Use this token for authentication of other routes
- POST http://localhost:5000/api/users/login -Login. Parameters are `user_name` and `password`. on successful login, JWT token will generated and returned.
- GET http://localhost:5000/api/users -Index [token required].
- GET http://localhost:5000/api/users/:id -Show [token required]
- PUT http://localhost:5000/api/users/:id -Edit [token required]
- DELETE http://localhost:5000/api/users/:id -Delete [token required]

#### Products
- GET http://localhost:5000/api/products -Index
- GET http://localhost:5000/api/products/:id -Show
- POST http://localhost:5000/api/products -Create [token required]. Parameters are: `name`, `price` and `category`.
- GET http://localhost:5000/api/products/category/:category -Products by category
- GET http://localhost:5000/api/products/popular -Top 5 popular products
- PUT http://localhost:5000/api/products/:id -Edit. Parameters are: `name`, `price` and `category`.
- DELETE http://localhost:5000/api/products/:id -Delete

#### Orders
- GET http://localhost:5000/api/orders -Index [token required]
- GET http://localhost:5000/api/orders/:id -Show order by user_id [token required].
- GET http://localhost:5000/api/orders/getOrderByStatus/:id/:status - Orders by status and user_id [token required]
- PUT http://localhost:5000/api/orders/status/:user_id - Update order status [token required]
- DELETE http://localhost:5000/api/orders/:id -Delete order by order_id [token required]
- POST http://localhost:5000/api/orders/addProduct -Add products to order [token required]. Parameters are: `product_id`, `order_id` and `quantity`
- POST http://localhost:5000/api/orders/create/:user_id -Create [token required]. Parameters are: `status` and `products`. [`user_id`(provided in url)].
```
Create Order Example:
{
  "status": "active" // active or completed
  "products": [
    {
      "product_id": 1,
      "quantity": 3
    },
    {
      "product_id": 2,
      "quantity": 5
    }
  ]
}
```
