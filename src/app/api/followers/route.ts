// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";
// import { RowDataPacket } from "mysql2/promise";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");
//   const pool = getPool();

//   // Explicitly type rows
//   const [rows] = await pool.query<RowDataPacket[]>(
//     `SELECT COUNT(*) as count FROM follows WHERE following_id = ?`,
//     [userId]
//   );

//   return NextResponse.json({ count: rows[0]?.count || 0 });
// }
import { getPool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ count: 0 });

  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM follows WHERE following_id = ?`,
    [userId]
  );

  return NextResponse.json({ count: rows[0]?.count ?? 0 });
}
