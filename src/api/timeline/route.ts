import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getPool } from "@/lib/database/db";
// import { getPool } from "@/lib/db";

export async function POST(request: Request) {
  const { firstname, lastname, email, password } = await request.json();

  if (!firstname || !lastname || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = getPool();

    const sql =
      "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
    await pool.execute(sql, [firstname, lastname, email, hashedPassword]);

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}