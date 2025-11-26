// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const goalId = params.id;
//   const pool = getPool();

//   try {
//     const [rows]: any = await pool.query(
//       `
//       SELECT 
//         g.*, 
//         u.username, 
//         u.firstname,
//         u.lastname,
//         u.image,
//         (SELECT COUNT(*) FROM reactions r WHERE r.post_id = g.id) AS reactionCount,
//         (SELECT COUNT(*) FROM comments c WHERE c.post_id = g.id) AS commentCount
//       FROM goals g
//       JOIN users u ON g.user_id = u.id
//       WHERE g.id = ?
//       `,
//       [goalId]
//     );

//     if (rows.length === 0)
//       return NextResponse.json({ error: "Goal not found" }, { status: 404 });

//     return NextResponse.json(rows[0]);
//   } catch (error) {
//     console.error("GET /api/goals/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";
// import { unhashId } from "@/lib/hash"; // from /lib/hash.ts

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id: hash } = params;

//   // Decode hash to real post ID
//   const goalId = unhashId(hash);
//   if (!goalId) {
//     return NextResponse.json({ error: "Invalid post hash" }, { status: 400 });
//   }

//   const pool = getPool();

//   try {
//     const [rows]: any = await pool.query(
//       `
//       SELECT 
//         g.*, 
//         u.username, 
//         u.firstname,
//         u.lastname,
//         c.category_name,
//         u.image AS profile_image,
//         (SELECT COUNT(*) FROM reactions r WHERE r.post_id = g.id) AS reactionCount,
//         (SELECT COUNT(*) FROM comments c WHERE c.post_id = g.id) AS commentCount
//       FROM goals g
//       JOIN users u ON g.user_id = u.id
//       JOIN categories c ON g.category = c.category_id
//       WHERE g.id = ?
//       `,
//       [goalId]
//     );

//     if (rows.length === 0) {
//       return NextResponse.json({ error: "Goal not found" }, { status: 404 });
//     }

//     return NextResponse.json(rows[0]);
//   } catch (error) {
//     console.error("GET /api/posted/[id] error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";
// import { unhashId } from "@/lib/hash";
// import { RowDataPacket } from "mysql2/promise";

// // ----- Interface Types -----
// export interface GoalRow extends RowDataPacket {
//   id: number;
//   user_id: number;
//   title: string;
//   description: string | null;
//   category: number;
//   duration: string | null;
//   privacy: string | null;
//   post_image: string | null;
//   created_at: Date;
//   username: string;
//   firstname: string | null;
//   lastname: string | null;
//   category_name: string;
//   profile_image: string | null;
//   reactionCount: number;
//   commentCount: number;
// }

// export interface ApiError {
//   error: string;
// }

// // ----- API Route -----
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   const { id: hash } = params;

//   // Decode hash to real post ID
//   const goalId = unhashId(hash);
//   if (!goalId) {
//     const errorResponse: ApiError = { error: "Invalid post hash" };
//     return NextResponse.json(errorResponse, { status: 400 });
//   }

//   const pool = getPool();

//   try {
//     const [rows] = await pool.query<GoalRow[] & RowDataPacket[]>(
//       `
//       SELECT 
//         g.*, 
//         u.username, 
//         u.firstname,
//         u.lastname,
//         c.category_name,
//         u.image AS profile_image,
//         (SELECT COUNT(*) FROM reactions r WHERE r.post_id = g.id) AS reactionCount,
//         (SELECT COUNT(*) FROM comments c WHERE c.post_id = g.id) AS commentCount
//       FROM goals g
//       JOIN users u ON g.user_id = u.id
//       JOIN categories c ON g.category = c.category_id
//       WHERE g.id = ?
//       `,
//       [goalId]
//     );

//     if (rows.length === 0) {
//       const errorResponse: ApiError = { error: "Goal not found" };
//       return NextResponse.json(errorResponse, { status: 404 });
//     }

//     return NextResponse.json(rows[0]);
//   } catch (error: unknown) {
//     console.error("GET /api/posted/[id] error:", error);
//     const message = error instanceof Error ? error.message : "Internal server error";
//     const errorResponse: ApiError = { error: message };
//     return NextResponse.json(errorResponse, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";
// import { unhashId } from "@/lib/hash";
// import { RowDataPacket } from "mysql2/promise";

// export interface GoalRow extends RowDataPacket {
//   id: number;
//   user_id: number;
//   title: string;
//   description: string | null;
//   category: number;
//   duration: string | null;
//   privacy: string | null;
//   post_image: string | null;
//   created_at: Date;
//   username: string;
//   firstname: string | null;
//   lastname: string | null;
//   category_name: string;
//   profile_image: string | null;
//   reactionCount: number;
//   commentCount: number;
// }

// export interface ApiError {
//   error: string;
// }

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse<GoalRow | ApiError>> {
//   const hash = params.id;

//   const goalId = unhashId(hash);
//   if (!goalId) {
//     return NextResponse.json(
//       { error: "Invalid post hash" },
//       { status: 400 }
//     );
//   }

//   const pool = getPool();

//   try {
//     const [rows] = await pool.query<GoalRow[]>(`
//       SELECT 
//         g.*, 
//         u.username, 
//         u.firstname,
//         u.lastname,
//         c.category_name,
//         u.image AS profile_image,
//         (SELECT COUNT(*) FROM reactions r WHERE r.post_id = g.id) AS reactionCount,
//         (SELECT COUNT(*) FROM comments c WHERE c.post_id = g.id) AS commentCount
//       FROM goals g
//       JOIN users u ON g.user_id = u.id
//       JOIN categories c ON g.category = c.category_id
//       WHERE g.id = ?
//     `, [goalId]);

//     if (rows.length === 0) {
//       return NextResponse.json(
//         { error: "Goal not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(rows[0]);
//   } catch (err: unknown) {
//     const message =
//       err instanceof Error ? err.message : "Internal server error";

//     return NextResponse.json(
//       { error: message },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { unhashId } from "@/lib/hash";
import { RowDataPacket } from "mysql2/promise";
export interface GoalRow extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  category: number;
  duration: string | null;
  privacy: string | null;
  post_image: string | null;
  created_at: Date;
  username: string;
  firstname: string | null;
  lastname: string | null;
  category_name: string;
  profile_image: string | null;
  reactionCount: number;
  commentCount: number;
}
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }   // 👈 FIXED
// ) {
//   const { id: hash } = await context.params;       // 👈 AWAIT IT

//   const goalId = unhashId(hash);
//   if (!goalId) {
//     return NextResponse.json(
//       { error: "Invalid post hash" },
//       { status: 400 }
//     );
//   }

//   const pool = getPool();

//   try {
//  const [rows] = await pool.query<GoalRow[]>(`
//   SELECT 
//     g.*, 
//     u.username, 
//     u.firstname,
//     u.lastname,
//     c.category_name,
//     u.image AS profile_image,
//     (SELECT COUNT(*) FROM reactions r WHERE r.post_id = g.id) AS reactionCount,
//     (SELECT COUNT(*) FROM comments c WHERE c.post_id = g.id) AS commentCount
//   FROM goals g
//   JOIN users u ON g.user_id = u.id
//   JOIN categories c ON g.category = c.category_id
//   WHERE g.id = ?
// `, [goalId]);

// if (rows.length === 0) {
//   return NextResponse.json(
//     { error: "Goal not found" },
//     { status: 404 }
//   );
// }

// return NextResponse.json(rows[0]);


//     return NextResponse.json(rows[0]);
//   } catch (err) {
//     const message = err instanceof Error ? err.message : "Internal server error";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Next.js expects this
) {
  const { id: hash } = await context.params; // must await

  const goalId = unhashId(hash);
  if (!goalId) {
    return NextResponse.json({ error: "Invalid post hash" }, { status: 400 });
  }

  const pool = getPool();

  try {
    const [rows] = await pool.query<GoalRow[]>(`
      SELECT 
        g.*, 
        u.username, 
        u.firstname,
        u.lastname,
        c.category_name,
        u.image AS profile_image,
        (SELECT COUNT(*) FROM reactions r WHERE r.post_id = g.id) AS reactionCount,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = g.id) AS commentCount
      FROM goals g
      JOIN users u ON g.user_id = u.id
      JOIN categories c ON g.category = c.category_id
      WHERE g.id = ?
    `, [goalId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
