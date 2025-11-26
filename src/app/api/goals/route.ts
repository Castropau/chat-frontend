// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("user_id");

//     const pool = getPool();

//     let query = `
//       SELECT 
//         g.id,
//         g.title,
//         g.post_image,
//         u.firstname,
//         u.lastname
//       FROM goals g
//       JOIN users u ON g.user_id = u.id
//     `;
//     const params: any[] = [];

//     // If user_id is provided, filter by it
//     if (userId) {
//       query += " WHERE g.user_id = ?";
//       params.push(userId);
//     }

//     query += " ORDER BY g.created_at DESC";

//     const [rows] = await pool.execute(query, params);
//     const goals = rows as any[];

//     return NextResponse.json({ goals });
//   } catch (error) {
//     console.error("Goals fetch error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";

// ----- Interface Types -----
export interface GoalRow extends RowDataPacket {
  id: number;
  title: string;
  post_image: string | null;
  firstname: string;
  lastname: string;
}

export interface GoalResponse {
  id: number;
  title: string;
  postImage: string | null;
  firstname: string;
  lastname: string;
}

// ----- API Route -----
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    const pool = getPool();

    let query = `
      SELECT 
        g.id,
        g.title,
        g.post_image,
        u.firstname,
        u.lastname
      FROM goals g
      JOIN users u ON g.user_id = u.id
    `;
    const params: (string | number)[] = [];

    // If user_id is provided, filter by it
    if (userId) {
      query += " WHERE g.user_id = ?";
      params.push(userId);
    }

    query += " ORDER BY g.created_at DESC";

    const [rows] = await pool.execute<GoalRow[]>(query, params);
    const goals: GoalResponse[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      postImage: row.post_image,
      firstname: row.firstname,
      lastname: row.lastname,
    }));

    return NextResponse.json({ goals });
  } catch (error: unknown) {
    console.error("Goals fetch error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
