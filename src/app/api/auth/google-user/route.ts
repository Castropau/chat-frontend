// File: /app/api/auth/google-user/route.ts
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT id, firstname, lastname, email, image FROM users WHERE email = ?",
      [email]
    );

    const users = rows as {
      id: number;
      firstname: string;
      lastname: string;
      email: string;
      image: string;
    }[];

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error("❌ Error fetching Google user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
