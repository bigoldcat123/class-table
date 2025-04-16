import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
const dbFile =
  process.env.NODE_ENV == "development"
    ? process.env.DB_FILE_NAME_TEST!
    : process.env.DB_FILE_NAME!;
const db = drizzle(dbFile);

console.log(dbFile);

export default db;
