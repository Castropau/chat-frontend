import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getPool } from "@/lib/database/db"; // Ensure this path is correct

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Password length check
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = getPool();

    // Check if email already exists
    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      // Email exists → update username and password
      await pool.execute(
        "UPDATE users SET username = ?, password = ? WHERE email = ?",
        [username, hashedPassword, email]
      );

      return NextResponse.json(
        { message: "User updated successfully" },
        { status: 200 }
      );
    }

    // Email does not exist → insert new user
    await pool.execute(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashedPassword]
    );

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Server error during registration" },
      { status: 500 }
    );
  }
}
