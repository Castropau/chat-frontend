// import { getPool } from "@/lib/database/db";

// export async function GET() {
//   try {
//     const pool = await getPool();

//     // For MySQL2, the query returns [rows, fields]
//     const [rows] = await pool.query(
//       "SELECT category_name FROM categories ORDER BY category_name ASC"
//     );

//     console.log("Query rows:", rows);

//     if (!rows || rows.length === 0) {
//       return new Response(JSON.stringify([]), {
//         headers: { "Content-Type": "application/json" },
//         status: 200,
//       });
//     }

//     // rows is an array of objects like { category_name: '...' }
//     const categories = rows.map((r: any) => r.category_name);

//     return new Response(JSON.stringify(categories), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error: any) {
//     console.error("Error fetching categories:", error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       headers: { "Content-Type": "application/json" },
//       status: 500,
//     });
//   }
// }
// app/api/categories/route.ts
import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";

export interface CategoryRow extends RowDataPacket {
  category_name: string;
}

export async function GET() {
  try {
    const pool = await getPool();

    // Tell TS this will return rows compatible with RowDataPacket[]
    const [rows] = await pool.query<CategoryRow[] & RowDataPacket[]>(
      "SELECT category_name FROM categories ORDER BY category_name ASC"
    );

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const categories = rows.map((r) => r.category_name);

    return new Response(JSON.stringify(categories), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

