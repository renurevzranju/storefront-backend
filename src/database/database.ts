import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV,
} = process.env;

const databaseName: string | undefined =
  (ENV || "").trim() === "test" ? POSTGRES_TEST_DB : POSTGRES_DB;

const client = new Pool({
  host: POSTGRES_HOST,
  database: databaseName,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

export default client;
