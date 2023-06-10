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

### Install the modules
Run `npm install` to install all required modules.

