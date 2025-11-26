import mysql from "mysql2/promise";

let pool: mysql.Pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "", 
      database:  process.env.DB_NAME || "growup",
       charset: "utf8mb4_general_ci", // ✅ ensure emoji-safe charset

    //   waitForConnections: true,
    //   connectionLimit: 10,
    //   queueLimit: 0,
    });
  }
  return pool;
}