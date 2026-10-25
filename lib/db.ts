
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

const isProduction = process.env.DB_HOST !== undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "expense_tracker",
  ...(isProduction && {
    ssl: {
      ca: fs.readFileSync(
        path.join(process.cwd(), "certs", "ca.pem"),
        "utf8"
      ),
      rejectUnauthorized: true,
    },
  }),
});

export default pool;

