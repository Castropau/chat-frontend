// app/api/reacts/add_react/route.ts
import { NextResponse } from "next/server";
const socketUrl = process.env.SOCKET_URL;
export async function POST(req: Request) {
  try {
    const { postId, emoji } = await req.json();

    if (!postId || !emoji) {
      return NextResponse.json({ error: "postId and emoji required" }, { status: 400 });
    }

    // 1️⃣ update database or mock reactions (for testing)
    const updatedReactions = [
      { emoji: "👍", count: 2 },
      { emoji: "❤️", count: 1 },
      { emoji: "😂", count: 1 },
      { emoji: "😢", count: 1 },
    ];

    // 2️⃣ broadcast update to socket server
    // await fetch("http://localhost:4000/broadcast", {
    await fetch(`${socketUrl}/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        payload: { reactions: updatedReactions },
      }),
    });

    // 3️⃣ return response
    return NextResponse.json({ ok: true, reactions: updatedReactions });
  } catch (err) {
    console.error("Error adding reaction:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
