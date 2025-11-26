import { getPool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT id, username, image, online FROM users"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching online followers:", error);
    return NextResponse.json(
      { error: "Failed to fetch online followers" },
      { status: 500 }
    );
  }
}

