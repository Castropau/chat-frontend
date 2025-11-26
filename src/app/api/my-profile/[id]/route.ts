
// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const pool = getPool();
//     const [rows]: any = await pool.execute(
//       "SELECT id, email, firstname FROM users WHERE id = ?",
//       [params.id]
//     );

//     if (!rows.length) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(rows[0]);
//   } catch (error) {
//     console.error("❌ Profile fetch error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }










// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const pool = getPool();
//     const [rows]: any = await pool.execute(
//       "SELECT id, firstname, lastname, name, email FROM users WHERE id = ?",
//       [params.id]
//     );

//     if (!rows.length) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const user = rows[0];
//     return NextResponse.json(user);
//   } catch (error) {
//     console.error("❌ Profile fetch error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const pool = getPool();

//     // ✅ DEBUG LOG
//     console.log("📥 Fetching user profile for ID:", params.id);

//     const [rows]: any = await pool.execute(
//       "SELECT id, firstname, lastname, firstname, email FROM users WHERE id = ?",
//       [params.id]
//     );

//     if (!rows.length) {
//       console.warn("⚠️ User not found:", params.id);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const user = rows[0];
//     console.log("✅ User fetched successfully:", user);
//     return NextResponse.json(user);
//   } catch (error: any) {
//     console.error("❌ Profile fetch error:", error.message || error);
//     return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // ✅ parse the id
//     const userId = params.id;

//     console.log("📥 Fetching user profile for ID:", userId);

//     const pool = getPool();
//     const [rows]: any = await pool.execute(
//       "SELECT id, firstname, lastname, email, username, image FROM users WHERE id = ?",
//       [userId]
//     );

//     if (!rows.length) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const user = rows[0];

//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     // ⬅️ FIXED: params is now async
//     const { id } = await context.params;

//     console.log("📥 Fetching user profile for ID:", id);

//     const pool = getPool();
//     const [rows]: any = await pool.execute(
//       "SELECT id, firstname, lastname, email, username, image FROM users WHERE id = ?",
//       [id]
//     );

//     if (!rows.length) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(rows[0], { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";
// import { RowDataPacket } from "mysql2/promise";
// export interface UserRow extends RowDataPacket {
//   id: number;
//   firstname: string | null;
//   lastname: string | null;
//   email: string;
//   username: string;
//   image: string | null;
// }

// export interface UserResponse {
//   id: number;
//   firstname: string;
//   lastname: string;
//   email: string;
//   username: string;
//   image: string | null;
// }

// export interface ApiError {
//   error: string;
// }

// // ----- API Route -----
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ): Promise<NextResponse> {
//   try {
//     const { id } = await context.params;

//     console.log("📥 Fetching user profile for ID:", id);

//     const pool = getPool();
//     const [rows] = await pool.execute<UserRow[] & RowDataPacket[]>(
//       "SELECT id, firstname, lastname, email, username, image FROM users WHERE id = ?",
//       [id]
//     );

//     if (!rows.length) {
//       const errorResponse: ApiError = { error: "User not found" };
//       return NextResponse.json(errorResponse, { status: 404 });
//     }

//     const user: UserResponse = {
//       id: rows[0].id,
//       firstname: rows[0].firstname || "",
//       lastname: rows[0].lastname || "",
//       email: rows[0].email,
//       username: rows[0].username,
//       image: rows[0].image,
//     };

//     return NextResponse.json(user, { status: 200 });
//   } catch (error: unknown) {
//     console.error("API Error:", error);
//     const message = error instanceof Error ? error.message : "Server error";
//     const errorResponse: ApiError = { error: message };
//     return NextResponse.json(errorResponse, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/server/db";
import type { RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/database/db";

interface UserRow extends RowDataPacket {
  id: number;
  firstname?: string | null;
  lastname?: string | null;
  email: string;
  username: string;
  image?: string | null;
}

interface UserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  image?: string | null;
}

// interface ApiError {
//   error: string;
// }

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params; // ✅ await because it's a Promise

  console.log("Fetching user with ID or email:", id);

  const pool = getPool();

  const isEmail = id.includes("@");
  const query = isEmail
    ? "SELECT id, firstname, lastname, email, username, image FROM users WHERE email = ?"
    : "SELECT id, firstname, lastname, email, username, image FROM users WHERE id = ?";

  const [rows] = await pool.execute<UserRow[] & RowDataPacket[]>(query, [id]);

  if (!rows.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user: UserResponse = {
    id: rows[0].id,
    firstname: rows[0].firstname || "",
    lastname: rows[0].lastname || "",
    email: rows[0].email,
    username: rows[0].username,
    image: rows[0].image || null,
  };

  return NextResponse.json(user);
}
