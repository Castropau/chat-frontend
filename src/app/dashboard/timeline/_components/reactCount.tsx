// "use client";

// import { useEffect, useState } from "react";

// interface Reaction {
//   emoji: string; // This is literally the emoji, e.g. "🔥"
//   count: number;
// }

// export default function ReactionStats({ postId }: { postId: number }) {
//   const [reactions, setReactions] = useState<Reaction[]>([]);

//   useEffect(() => {
//     async function fetchReactions() {
//       try {
//         const res = await fetch(`/api/reacts/get_reacts?postId=${postId}`);
//         if (!res.ok) throw new Error("Failed to fetch reactions");
//         const data = await res.json();
//         setReactions(data.reactions || []);
//       } catch (error) {
//         console.error("Error fetching reaction counts:", error);
//       }
//     }

//     fetchReactions();
//   }, [postId]);

//   return (
//     <div className="flex space-x-6 border-t border-gray-200 pt-4">
//       {reactions.length > 0 ? (
//         reactions.map((r, index) => (
//           <div
//             key={`${r.emoji}-${index}`} // ✅ unique key per emoji
//             className="flex items-center gap-2 text-lg"
//           >
//             <span>{r.emoji}</span>
//             <span className="font-medium text-gray-700">{r.count}</span>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-400 text-sm">No reactions yet</p>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";

// interface Reaction {
//   emoji: string;
//   count: number;
// }

// export default function ReactionStats({ postId }: { postId: number }) {
//   const [reactions, setReactions] = useState<Reaction[]>([]);

//   async function fetchReactions() {
//     const res = await fetch(`/api/reacts/get_reacts?postId=${postId}`);
//     if (res.ok) {
//       const data = await res.json();
//       setReactions(data.reactions || []);
//     }
//   }

//   useEffect(() => {
//     fetchReactions();

//     // 🔁 Poll every 2 seconds for live updates
//     const interval = setInterval(fetchReactions, 2000);
//     return () => clearInterval(interval);
//   }, [postId]);

//   return (
//     <div className="flex space-x-6 border-t border-gray-200 pt-4">
//       {reactions.length > 0 ? (
//         reactions.map((r, i) => (
//           <div key={i} className="flex items-center gap-2 text-lg">
//             <span>{r.emoji}</span>
//             <span className="font-medium text-gray-700">{r.count}</span>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-400 text-sm">No reactions yet</p>
//       )}
//     </div>
//   );
// }


// src/app/dashboard/timeline/ReactionStats.tsx
"use client";
import { initSocket } from "@/utils/webSocket";
import { useEffect, useState } from "react";
// import { initSocket } from "@/hooks/useSocket";

interface Reaction {
  emoji: string;
  count: number;
}
// interface ReactionPayload {
//   postId: string;
//   payload: {
//     reactions: {
//       [reactionType: string]: number; // or your exact structure
//     };
//   };
// }
// interface ReactionPayload {
//   postId: string | number;
//   payload: {
//     reactions?: Record<string, number>;
//   };
// }
interface IncomingReaction {
  emojiId: number;
  emoji: string;
  count: number;
}

interface ReactionPayload {
  postId: string | number;
  payload: {
    reactions: Record<string, IncomingReaction>; // key can be emoji or emojiId
  };
}
export default function ReactionStats({ postId }: { postId: number }) {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  // useEffect(() => {
  //   let mounted = true;

  //   async function fetchInitial() {
  //     try {
  //       const res = await fetch(`/api/reacts/get_reacts?postId=${postId}`);
  //       if (!res.ok) throw new Error("fetch failed");
  //       const data = await res.json();
  //       if (!mounted) return;
  //       setReactions(data.reactions || []);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  //   fetchInitial();

  //   // init socket and join room
  //   const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
  //   const sock = initSocket(SOCKET_URL);

  //   sock.emit("join", { postId });

  //   function handler(payload: any) {
  //     if (payload?.postId === postId) {
  //       setReactions(payload.payload?.reactions || payload.payload || []);
  //     }
  //   }

  //   sock.on("reactions:update", handler);

  //   return () => {
  //     mounted = false;
  //     sock.off("reactions:update", handler);
  //     sock.emit("leave", { postId });
  //   };
  // }, [postId]);
// useEffect(() => {
//   let mounted = true;

//   async function fetchInitial() {
//     try {
//       const res = await fetch(`/api/reacts/get_reacts?postId=${postId}`);
//       if (!res.ok) throw new Error("fetch failed");
//       const data = await res.json();
//       if (!mounted) return;
//       setReactions(data.reactions || []);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   fetchInitial();

//   const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
//   const sock = initSocket(SOCKET_URL);

//   sock.emit("join", { postId });

// function handler(payload: any) {
//   if (payload?.postId !== postId) return;

//   if (payload.payload?.reactions) {
//     setReactions(payload.payload.reactions);
//   }
//   // ignore payloads without reactions
// }


//   sock.on("reactions:update", handler);

//   return () => {
//     mounted = false;
//     sock.off("reactions:update", handler);
//     sock.emit("leave", { postId });
//   };
// }, [postId]);
// useEffect(() => {
//   let mounted = true;

//   async function fetchInitial() {
//     try {
//       const res = await fetch(`/api/reacts/get_reacts?postId=${postId}`);
//       if (!res.ok) throw new Error("fetch failed");
//       const data = await res.json();
//       if (!mounted) return;
//       setReactions(data.reactions || []);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   fetchInitial();

//   const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
//   const sock = initSocket(SOCKET_URL);

//   sock.emit("join", { postId });

//   function handler(payload: any) {
//     if (payload?.postId !== postId) return;

//     // Only update reactions if payload has reactions array
//     if (payload.payload?.reactions) {
//       setReactions(payload.payload.reactions);
//     }
//     // You can also handle comments separately here if needed
//   }

//   sock.on("reactions:update", handler);

//   return () => {
//     mounted = false;
//     sock.off("reactions:update", handler);
//     sock.emit("leave", { postId });
//   };
// }, [postId]);
// useEffect(() => {
//   let mounted = true;

//   async function fetchInitial() {
//     try {
//       const res = await fetch(`/api/reacts/get_reacts?postId=${postId}`);
//       if (!res.ok) throw new Error("fetch failed");
//       const data = await res.json();
//       if (!mounted) return;
//       setReactions(data.reactions || []);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   fetchInitial();

//   const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
//   const sock = initSocket(SOCKET_URL);

//   sock.emit("join", { postId });

//   const handleReactionUpdate = ({ postId: incomingId, payload }: any) => {
//     if (incomingId !== postId) return;
//     if (!payload?.reactions) return; // only update when reactions exist
//     setReactions(payload.reactions);
//   };

//   sock.on("reactions:update", handleReactionUpdate);

//   return () => {
//     mounted = false;
//     sock.off("reactions:update", handleReactionUpdate);
//     sock.emit("leave", { postId });
//   };
// }, [postId]);
// useEffect(() => {
//   let mounted = true;

//   async function fetchInitial() {
//     try {
//       const res = await fetch(`/api/reacts/get_reacts?postId=${postId}`);
//       if (!res.ok) throw new Error("fetch failed");
//       const data = await res.json();
//       if (!mounted) return;
//       setReactions(data.reactions || []);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   fetchInitial();

//   const SOCKET_URL =
//     process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
//   const socket = initSocket(SOCKET_URL);

//   // ✅ Only join once per postId
//   socket.emit("join", { postId });

//   const handleReactionUpdate = ({ postId: incomingId, payload }: any) => {
//     if (incomingId !== postId) return;
//     if (!payload?.reactions) return;
//     setReactions(payload.reactions);
//   };

//   socket.on("reactions:update", handleReactionUpdate);

//   return () => {
//     mounted = false;
//     socket.off("reactions:update", handleReactionUpdate);
//     // ⚠️ Don't emit "leave" here — keep joined so it stays subscribed
//     // socket.emit("leave", { postId });
//   };
// }, [postId]);
// const socketUrl = process.env.SOCKET_URL;
useEffect(() => {
  let isMounted = true;

  const fetchInitial = async () => {
    try {
      const res = await fetch(`/api/reacts/get_reacts?postId=${postId}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      if (isMounted) setReactions(data.reactions || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchInitial();

  // ⚙️ Always reuse the same socket connection
  const SOCKET_URLS =
    // process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
     process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
  const socket = initSocket(SOCKET_URLS);

  // Join the room (if not already joined)
  socket.emit("join", { postId });

  const handleReactionUpdate = ({ postId: incomingId, payload }: ReactionPayload) => {
    // if (incomingId !== postId) return;
    if (String(incomingId) !== String(postId)) return;

    // if (payload?.reactions) {
    //   setReactions(payload.reactions);
    // }
     if (payload?.reactions) {
    // const reactionArray: Reaction[] = Object.entries(payload.reactions).map(
    //   ([emoji, count]) => ({ emoji, count })
    // );
//     const reactionArray: Reaction[] = Object.entries(payload.reactions).map(
//   ([emoji, count]) => ({ emoji, count })
// );
const reactionArray: Reaction[] = Object.values(payload.reactions).map(
  (r: IncomingReaction) => ({
    emoji: r.emoji,
    count: r.count,
  })
);


    
    setReactions(reactionArray);
  }
  };

  socket.on("reactions:update", handleReactionUpdate);

  // 🧠 Optional: listen to comments too, but ignore them
  socket.on("comments:update", () => {});

  // ✅ Cleanup correctly — don’t close global socket
  return () => {
    isMounted = false;
    socket.off("reactions:update", handleReactionUpdate);
    socket.emit("leave", { postId });
  };
}, [postId]);


  return (
    <div className="flex space-x-6 border-t border-gray-200 pt-4">
      {reactions.length > 0 ? (
        reactions.map((r, i) => (
          <div key={`${r.emoji}-${i}`} className="flex items-center gap-2 text-lg">
            <span>{r.emoji}</span>
            <span className="font-medium text-gray-700 dark:text-white">{r.count}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No reactions yet</p>
      )}
    </div>
  );
}
