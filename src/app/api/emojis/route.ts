import { getPool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT id, emoji, label FROM emojis ORDER BY id ASC");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error fetching emojis:", err);
    return NextResponse.json({ error: "Failed to fetch emojis" }, { status: 500 });
  }
}
