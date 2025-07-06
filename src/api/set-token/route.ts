// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function POST(req: NextRequest) {
//   const { token } = await req.json();

//   cookies().set("token", token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//   });

//   return NextResponse.json({ success: true });
// }
