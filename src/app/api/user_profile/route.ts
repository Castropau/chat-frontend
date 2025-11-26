// import { getPool } from "@/lib/database/db";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id } = context.params;
//     const pool = getPool();

//     const [rows] = await pool.query(
//       `SELECT id, firstname, lastname, username, email, created_at 
//        FROM users 
//        WHERE id = ?`,
//       [id]
//     );

//     const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(user);
//   } catch (error: any) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { error: "Database error", details: error.message },
//       { status: 500 }
//     );
//   }
// }
// import { getPool } from "@/lib/database/db";
// import { NextRequest, NextResponse } from "next/server";
// import { RowDataPacket } from "mysql2/promise";

// // ----- Interface Types -----

// // A single user row from the database
// export interface User extends RowDataPacket {
//   id: number;
//   firstname: string;
//   lastname: string;
//   username: string;
//   email: string;
//   created_at: string;
// }

// // API response format for user
// export interface ApiResponseUser {
//   user?: User | null;
//   error?: string;
//   details?: string;
// }

// // ----- API Route -----
// export async function GET(
//   req: NextRequest,
//   context: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id } = context.params;
//   const pool = getPool();

//   try {
//     // Query the user
//     const [rows] = await pool.query<User[] & RowDataPacket[]>(
//       `SELECT id, firstname, lastname, username, email, created_at 
//        FROM users 
//        WHERE id = ?`,
//       [id]
//     );

//     const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

//     if (!user) {
//       const response: ApiResponseUser = { error: "User not found" };
//       return NextResponse.json(response, { status: 404 });
//     }

//     const response: ApiResponseUser = { user };
//     return NextResponse.json(response);
//   } catch (error: unknown) {
//     console.error("API Error:", error);

//     // Extract error message safely
//     const message =
//       error instanceof Error ? error.message : "Unknown database error";

//     const response: ApiResponseUser = { error: "Database error", details: message };
//     return NextResponse.json(response, { status: 500 });
//   }
// }

import { getPool } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

// ----- Interface Types -----
export interface User extends RowDataPacket {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  created_at: string;
}

export interface ApiResponseUser {
  user?: User | null;
  error?: string;
  details?: string;
}

// ----- API Route -----
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params must be a Promise
): Promise<NextResponse> {
  const { id } = await context.params; // ✅ unwrap Promise
  const pool = getPool();

  try {
    const [rows] = await pool.query<User[] & RowDataPacket[]>(
      `SELECT id, firstname, lastname, username, email, created_at 
       FROM users 
       WHERE id = ?`,
      [id]
    );

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user) {
      const response: ApiResponseUser = { error: "User not found" };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponseUser = { user };
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("API Error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown database error";

    const response: ApiResponseUser = { error: "Database error", details: message };
    return NextResponse.json(response, { status: 500 });
  }
}
