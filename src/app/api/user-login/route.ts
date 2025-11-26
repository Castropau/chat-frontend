
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const pool = getPool();
//     const userId = parseInt(params.id, 10);

//     if (isNaN(userId)) {
//       return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
//     }

//     const [rows]: any = await pool.execute(
//       "SELECT id, firstname, lastname, name, email FROM users WHERE id = ?",
//       [userId]
//     );

//     if (!rows.length) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const user = rows[0];

//     // Fallback: use Google name if firstname/lastname are empty
//     const firstname = user.firstname?.trim() || user.name?.split(" ")[0] || "";
//     const lastname =
//       user.lastname?.trim() || user.name?.split(" ").slice(1).join(" ") || "";

//     return NextResponse.json({
//       id: user.id,
//       email: user.email,
//       firstname,
//       lastname,
//       name: `${firstname} ${lastname}`.trim(),
//     });
//   } catch (error) {
//     console.error("❌ User fetch error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";
// import { RowDataPacket } from "mysql2/promise";

// // ----- Interface Types -----
// export interface UserRow extends RowDataPacket {
//   id: number;
//   firstname: string | null;
//   lastname: string | null;
//   name?: string | null; // fallback for Google name
//   email: string;
// }

// export interface UserResponse {
//   id: number;
//   email: string;
//   firstname: string;
//   lastname: string;
//   name: string;
// }

// export interface ApiError {
//   error: string;
// }

// // ----- API Route -----
// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   try {
//     const pool = getPool();
//     const userId = parseInt(params.id, 10);

//     if (isNaN(userId)) {
//       const errorResponse: ApiError = { error: "Invalid user ID" };
//       return NextResponse.json(errorResponse, { status: 400 });
//     }

//     const [rows] = await pool.execute<UserRow[] & RowDataPacket[]>(
//       "SELECT id, firstname, lastname, name, email FROM users WHERE id = ?",
//       [userId]
//     );

//     if (!rows.length) {
//       const errorResponse: ApiError = { error: "User not found" };
//       return NextResponse.json(errorResponse, { status: 404 });
//     }

//     const user = rows[0];

//     // Fallback: use Google name if firstname/lastname are empty
//     const firstname = user.firstname?.trim() || user.name?.split(" ")[0] || "";
//     const lastname =
//       user.lastname?.trim() || user.name?.split(" ").slice(1).join(" ") || "";

//     const response: UserResponse = {
//       id: user.id,
//       email: user.email,
//       firstname,
//       lastname,
//       name: `${firstname} ${lastname}`.trim(),
//     };

//     return NextResponse.json(response);
//   } catch (error: unknown) {
//     console.error("❌ User fetch error:", error);
//     const message = error instanceof Error ? error.message : "Server error";
//     const errorResponse: ApiError = { error: message };
//     return NextResponse.json(errorResponse, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";

// ----- Interface Types -----
export interface UserRow extends RowDataPacket {
  id: number;
  firstname: string | null;
  lastname: string | null;
  name?: string | null;
  email: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  name: string;
}

export interface ApiError {
  error: string;
}

// ----- API Route -----
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ params is a Promise
): Promise<NextResponse> {
  try {
    const { id } = await context.params; // ✅ unwrap Promise
    const pool = getPool();
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const [rows] = await pool.execute<UserRow[]>(
      "SELECT id, firstname, lastname, name, email FROM users WHERE id = ?",
      [userId]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    const firstname = user.firstname?.trim() || user.name?.split(" ")[0] || "";
    const lastname =
      user.lastname?.trim() || user.name?.split(" ").slice(1).join(" ") || "";

    const response: UserResponse = {
      id: user.id,
      email: user.email,
      firstname,
      lastname,
      name: `${firstname} ${lastname}`.trim(),
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("❌ User fetch error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
