// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import { getPool } from "@/lib/database/db"; // Assuming your DB logic is here
// import { RowDataPacket, OkPacket } from 'mysql2'; // Import relevant types from mysql2

// // Define types for incoming request body
// interface UpdatePasswordRequest {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// interface User extends RowDataPacket {
//   id: number;
//   password: string;
// }

// export async function PUT(req: Request, context: { params: { id: string } }): Promise<NextResponse> {
//   try {
//     const { id } = context.params; // Destructure directly as context.params is an object

//     console.log("Received ID:", id); // Log the received user ID

//     // Validate ID (ensure it's a number)
//     if (!id || isNaN(Number(id))) {
//       console.log("Invalid user ID");
//       return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
//     }

//     const pool = getPool();

//     // Parse the incoming JSON body with appropriate typing
//     const { currentPassword, newPassword, confirmPassword }: UpdatePasswordRequest = await req.json();

//     console.log("Received Data:", { currentPassword, newPassword, confirmPassword });

//     // Validate required fields
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       console.log("Missing required fields");
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Validate password match
//     if (newPassword !== confirmPassword) {
//       console.log("Passwords do not match");
//       return NextResponse.json({ error: "New password and confirm password must match" }, { status: 400 });
//     }

//     // Password length validation
//     if (newPassword.length < 8) {
//       console.log("New password too short");
//       return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
//     }

//     // Fetch the existing user data to verify the current password
//     const [existingUserRows] = await pool.execute<User[]>(
//       "SELECT * FROM users WHERE id = ?",
//       [id]
//     );

//     console.log("Existing User Rows:", existingUserRows); // Log the fetched user data

//     if (existingUserRows.length === 0) {
//       console.log("User not found");
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const existingUser = existingUserRows[0];

//     // Check if the current password matches
//     const passwordMatch = await bcrypt.compare(currentPassword, existingUser.password);

//     console.log("Password Match:", passwordMatch); // Log the result of password comparison

//     if (!passwordMatch) {
//       console.log("Current password is incorrect");
//       return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
//     }

//     // Hash the new password and update in the database
//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//     const [updateResult] = await pool.execute<OkPacket>(
//       "UPDATE users SET password = ? WHERE id = ?",
//       [hashedNewPassword, id]
//     );

//     console.log("Update Result:", updateResult); // Log the result of the update query

//     if (updateResult.affectedRows === 0) {
//       console.log("Password update failed");
//       return NextResponse.json({ error: "Password update failed" }, { status: 400 });
//     }

//     console.log("Password updated successfully");
//     return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
//   } catch (error: unknown) {
//     console.error("Error updating password:", error);
//     const message = error instanceof Error ? error.message : "Internal server error";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getPool } from "@/lib/database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Interface for request


interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
    }

    const pool = getPool();
    const formData = await req.formData();

    const oldPassword = formData.get("oldPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Old and new passwords are required" }, { status: 400 });
    }

    // Fetch user
    const [rows] = await pool.execute<UserRow[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [updateResult] = await pool.execute<ResultSetHeader>(
      "UPDATE users SET password=? WHERE id=?",
      [hashedPassword, id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ message: "Password update failed" }, { status: 400 });
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
