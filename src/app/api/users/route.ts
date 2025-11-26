// // /app/api/users/route.ts
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request) {
//   const pool = getPool();
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("q") || "";

//   try {
//     const [rows]: any = await pool.query(
//       `SELECT id, username, image
//        FROM users
//        WHERE username LIKE ?
//        LIMIT 10`,
//       [`%${query}%`]
//     );

//     return NextResponse.json(rows);
//   } catch (err) {
//     console.error("GET /api/users error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request) {
//   const pool = getPool();
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("q") || "";

//   try {
//     const [rows]: any = await pool.query(
//       `SELECT id, username, image, online
//        FROM users
//        WHERE username LIKE ?
//        LIMIT 10`,
//       [`%${query}%`]
//     );

//     // Sort: online first, then username alphabetically
//     rows.sort((a: any, b: any) => {
//       if (b.online - a.online) return b.online - a.online;
//       return a.username.localeCompare(b.username);
//     });

//     return NextResponse.json(rows);
//   } catch (err) {
//     console.error("GET /api/users error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";

// ----- Interface Types -----
export interface UserSearchResult extends RowDataPacket {
  id: number;
  username: string;
  image: string | null;
  online: boolean; // assuming online is stored as TINYINT(1) in MySQL
}

// ----- API Route -----
export async function GET(req: Request): Promise<NextResponse> {
  const pool = getPool();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  try {
    // Query matching users
    const [rows] = await pool.query<UserSearchResult[] & RowDataPacket[]>(
      `SELECT id, username, image, online
       FROM users
       WHERE username LIKE ?
       LIMIT 10`,
      [`%${query}%`]
    );

    // Sort: online first, then username alphabetically
    const sortedRows = rows.sort((a, b) => {
      if (b.online !== a.online) return (b.online ? 1 : 0) - (a.online ? 1 : 0);
      return a.username.localeCompare(b.username);
    });

    return NextResponse.json(sortedRows);
  } catch (err: unknown) {
    console.error("GET /api/users error:", err);

    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
