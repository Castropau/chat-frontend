// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// // import { getPool } from "@/lib/db";
// import { cookies } from "next/headers"; // ✅ Import cookies
//  import crypto from "crypto";
// import { getPool } from "@/lib/database/db";

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password required" }, { status: 400 });
//     }

//     const pool = getPool();
//     const [rows] = await pool.execute(
//       "SELECT id, email, password, firstname FROM users WHERE email = ?",
//       [email]
//     );
//     const users = rows as { id: number; email: string; password: string, firstname: string }[];

//     if (users.length === 0) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//     }

//     const user = users[0];
//     const isValid = await bcrypt.compare(password, user.password);

//     if (!isValid) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//     }

//     // ✅ Set cookie (simple token or just user ID for now)
//     // (await
//     //       // ✅ Set cookie (simple token or just user ID for now)
//     //       cookies()).set("token", String(user.id), {
//     //   httpOnly: true,
//     //   path: "/",
//     //   maxAge: 60 * 60 * 24, // 1 day
//     // });
   
// console.log("User ID:", user.id);

// const token = crypto.randomBytes(32).toString("hex");

// (await cookies()).set("token", token, {
//   httpOnly: true,
//   path: "/",
//   maxAge: 60 * 60 * 24, // 1 day
// });

//     // return NextResponse.json({ message: "Login successful" });
//     return NextResponse.json({ 
//   message: "Login successful", 
//   user: { id: user.id, email: user.email, firstname: user.firstname } // Include any other necessary data
// });

//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

