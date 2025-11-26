// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ username: string }> }
// ) {
//   try {
//     const { username } = await context.params; // ✅ await here

//     const pool = getPool();
//     const [rows] = await pool.execute(
//       "SELECT id, firstname, lastname, email, username FROM users WHERE username = ?",
//       [username]
//     );

//     const users = rows as any[];

//     if (users.length === 0) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ user: users[0] });
//   } catch (error) {
//     console.error("Profile fetch error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ username: string }> }
// ) {
//   try {
//     const { username } = await context.params; // ✅ get username

//     if (!username) {
//       return NextResponse.json(
//         { error: "Username parameter is required" },
//         { status: 400 }
//       );
//     }

//     const pool = getPool();

//     const [rows] = await pool.execute(
//       "SELECT id, firstname, lastname, email, username FROM users WHERE username = ?",
//       [username]
//     );

//     const users = rows as any[];

//     if (users.length === 0) {
//       // User not found
//       return NextResponse.json({ user: null }, { status: 200 });
//     }

//     // Return the user
//     return NextResponse.json({ user: users[0] }, { status: 200 });
//   } catch (error) {
//     console.error("Profile fetch error:", error);
//     return NextResponse.json(
//       { user: null, error: "Internal server error" },
//       { status: 500 }
//     );
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
  email: string;
  username: string;
}

export interface UserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
}

export interface ApiError {
  error: string;
}

// ----- API Route -----
export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
): Promise<NextResponse> {
  try {
    const { username } = await context.params;

    if (!username) {
      const errorResponse: ApiError = { error: "Username parameter is required" };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const pool = getPool();

    const [rows] = await pool.execute<UserRow[] & RowDataPacket[]>(
      "SELECT id, firstname, lastname, email, username FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      // User not found
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user: UserResponse = {
      id: rows[0].id,
      firstname: rows[0].firstname || "",
      lastname: rows[0].lastname || "",
      email: rows[0].email,
      username: rows[0].username,
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    console.error("Profile fetch error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const errorResponse: ApiError = { error: message };
    return NextResponse.json({ user: null, ...errorResponse }, { status: 500 });
  }
}

