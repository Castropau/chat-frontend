// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import { getPool } from "@/lib/database/db"; // Ensure this path is correct

// export async function POST(request: Request) {
//   try {
//     // const { email, username, password } = await request.json();
//     const { email, username, password, firstname, lastname } = await request.json();


//     // Validate required fields
//     // if (!email || !username || !password) {
//     //   return NextResponse.json(
//     //     { error: "Missing required fields" },
//     //     { status: 400 }
//     //   );
//     // }
//     if (!email || !username || !password || !firstname || !lastname) {
//   return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
// }


//     // Password length check
//     if (password.length < 8) {
//       return NextResponse.json(
//         { error: "Password must be at least 8 characters long" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const pool = getPool();

//     // Check if email already exists
//     const [existingUsers] = await pool.execute(
//       "SELECT id FROM users WHERE email = ?",
//       [email]
//     );

//     if (Array.isArray(existingUsers) && existingUsers.length > 0) {
//       // Email exists → update username and password
//       await pool.execute(
//         "UPDATE users SET username = ?, password = ? WHERE email = ?",
//         [username, hashedPassword, email]
//       );

//       return NextResponse.json(
//         { message: "User updated successfully" },
//         { status: 200 }
//       );
//     }

//     // Email does not exist → insert new user
//     // await pool.execute(
//     //   "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
//     //   [email, username, hashedPassword]
//     // );
//     await pool.execute(
//   "INSERT INTO users (email, username, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)",
//   [email, username, hashedPassword, firstname, lastname]
// );


//     return NextResponse.json(
//       { message: "User registered successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Registration error:", error);
//     return NextResponse.json(
//       { error: "Server error during registration" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getPool } from "@/lib/database/db";

export async function POST(request: Request) {
  try {
    const { email, username, password, firstname, lastname } = await request.json();

    if (!email || !username || !password || !firstname || !lastname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if email exists
    const [emailRows] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (Array.isArray(emailRows) && emailRows.length > 0) {
      return NextResponse.json(
        { error: "Email is already used" },
        { status: 400 }
      );
    }

    // Check if username exists
    const [usernameRows] = await pool.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (Array.isArray(usernameRows) && usernameRows.length > 0) {
      return NextResponse.json(
        { error: "Username is already used" },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (email, username, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)",
      [email, username, hashedPassword, firstname, lastname]
    );

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Server error during registration" },
      { status: 500 }
    );
  }
}
