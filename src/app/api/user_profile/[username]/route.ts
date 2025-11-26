// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(
//   req: Request,
//   { params }: { params: { username: string } }
// ) {
//   try {
//     const pool = getPool();
//     const { username } = params;

//     // Fetch user by username
//     const [rows]: any = await pool.query(
//       `SELECT id, firstname, lastname, username, email, created_at
//        FROM users
//        WHERE username = ?`,
//       [username]
//     );

//     if (!rows.length) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(rows[0]);
//   } catch (error: any) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { error: "Database error", details: error.message },
//       { status: 500 }
//     );
//   }
// }


// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
//   try {
//     const { username } = params;
//     const pool = getPool();

//     const [rows]: any = await pool.execute(
//       "SELECT id, username, firstname, lastname, email, image FROM users WHERE username = ?",
//       [username]
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



















// completed
// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
//   const { username } = params;
//   const pool = getPool();

//   if (!username) {
//     return NextResponse.json({ message: "Invalid username" }, { status: 400 });
//   }

//   try {
//     // Get user info
//     const [users]: any = await pool.query(
//       "SELECT id, username, firstname, lastname, email, image FROM users WHERE username = ?",
//       [username]
//     );

//     if (!users.length) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     const user = users[0];

//     // Get user goals
//     const [goals]: any = await pool.query(
//       "SELECT id, title, category, duration, privacy, post_image, created_at FROM goals WHERE user_id = ? ORDER BY created_at DESC",
//       [user.id]
//     );

//     return NextResponse.json({ ...user, goals });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }



// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";
// import { RowDataPacket } from "mysql2/promise"; // ✅ Import RowDataPacket

// // ----- Define Types -----
// export interface Goal extends RowDataPacket {
//   id: number;
//   title: string;
//   category: string;
//   duration: string;
//   privacy: string;
//   post_image: string | null;
//   created_at: string;
// }

// export interface User extends RowDataPacket {
//   id: number;
//   username: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   image: string | null;
// }

// export interface UserWithGoals extends User {
//   goals: Goal[];
// }

// // ----- API Route -----
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { username: string } }
// ) {
//   const { username } = params;
//   const pool = getPool();

//   if (!username) {
//     return NextResponse.json({ message: "Invalid username" }, { status: 400 });
//   }

//   try {
//     // Query user
//     const [users] = await pool.query<User[] & RowDataPacket[]>(
//       "SELECT id, username, firstname, lastname, email, image FROM users WHERE username = ?",
//       [username]
//     );

//     if (!users.length) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     const user = users[0];

//     // Query goals
//     const [goals] = await pool.query<Goal[] & RowDataPacket[]>(
//       "SELECT id, title, category, duration, privacy, post_image, created_at FROM goals WHERE user_id = ? ORDER BY created_at DESC",
//       [user.id]
//     );

//     const response: UserWithGoals = { ...user, goals };

//     return NextResponse.json(response);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";

// ----- Define Types -----
export interface Goal extends RowDataPacket {
  id: number;
  title: string;
  category: string;
  duration: string;
  privacy: string;
  post_image: string | null;
  created_at: string;
}

export interface User extends RowDataPacket {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  image: string | null;
}

export interface UserWithGoals extends User {
  goals: Goal[];
}

// ----- API Route -----
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> } // ✅ params is a Promise
): Promise<NextResponse> {
  const { username } = await context.params; // ✅ unwrap Promise
  const pool = getPool();

  if (!username) {
    return NextResponse.json({ message: "Invalid username" }, { status: 400 });
  }

  try {
    // Query user
    const [users] = await pool.query<User[] & RowDataPacket[]>(
      "SELECT id, username, firstname, lastname, email, image FROM users WHERE username = ?",
      [username]
    );

    if (!users.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Query goals
    const [goals] = await pool.query<Goal[] & RowDataPacket[]>(
      "SELECT id, title, category, duration, privacy, post_image, created_at FROM goals WHERE user_id = ? ORDER BY created_at DESC",
      [user.id]
    );

    const response: UserWithGoals = { ...user, goals };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
