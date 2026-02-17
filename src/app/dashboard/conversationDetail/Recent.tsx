// "use client";
// import React, { useState, useEffect } from "react";

// interface User {
//   id: string;
//   username: string;
//   image?: string;
// }

// interface Props {
//   onSelectUser: (user: User) => void;
// }

// const RecentConversations: React.FC<Props> = ({ onSelectUser }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     if (storedUser?.id) setUserId(storedUser.id);
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     const fetchRecent = async () => {
//       const res = await fetch(`/api/conversations/recent?userId=${userId}`);
//       const data = await res.json();
//       setUsers(data);
//     };

//     fetchRecent();
//   }, [userId]);

//   return (
//     <div className="border-r border-gray-200 w-80 flex flex-col bg-gray-50">
//       <div className="p-2 font-semibold border-b border-gray-200">Recent Chats</div>
//       <div className="flex-1 overflow-y-auto">
//         {users.map((user) => (
//           <div
//             key={user.id}
//             className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
//             onClick={() => onSelectUser(user)}
//           >
//             <img
//               src={user.image || "https://i.pravatar.cc/40"}
//               alt={user.username}
//               className="w-10 h-10 rounded-full mr-3"
//             />
//             <span className="font-medium">{user.username}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecentConversations;
"use client";
import React, { useState, useEffect, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import Image from "next/image";

interface User {
  id: string;
  username: string;
  image?: string;
  firstname?: string;
  lastname?: string;
}

interface Props {
  onSelectUser: (user: User) => void;
}

let socket: Socket;
// const socketUrl = process.env.SOCKET_URL;
const RecentConversations: React.FC<Props> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Get logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.id) setUserId(storedUser.id);
  }, []);

  // 🔵 Fetch recent conversations (shared function)
  const fetchRecent = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/conversations/recent?userId=${userId}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch recent conversations:", err);
    }
  }, [userId]);

  // 🔥 Initialize socket + realtime listener
  useEffect(() => {
    if (!userId) return;

    // socket = io("http://localhost:4000");
    // const socketUrl = process.env.SOCKET_URL;
    // socket = io(socketUrl!);
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
socket = io(socketUrl, { transports: ["websocket"] });

    socket.emit("joinUserRoom", { userId });

    // ⬇ Realtime listener — refresh recent conversations automatically
    socket.on("inbox:update", () => {
      fetchRecent(); // Re-fetch on every new message
    });

    socket.on("message:new", () => {
      fetchRecent(); // For safety (in case chat room emits only message:new)
    });

    // Load initial list
    fetchRecent();

    return () => {
      socket.off("inbox:update");
      socket.off("message:new");
      socket.disconnect();
    };
  }, [userId, fetchRecent]);

  return (
    // <div className="border-r border-gray-200 w-80 flex flex-col bg-gray-50">
    // <div className="border-r border-gray-200 flex flex-col bg-gray-50">
    //   <div className="p-2 font-semibold border-b border-gray-200">Recent Chats</div>

    //   <div className="flex-1 overflow-y-auto">
    //     {users.map((user) => (
    //       <div
    //         key={user.id}
    //         className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
    //         onClick={() => onSelectUser(user)}
    //       >
    //         <Image
    //           src={user.image || "https://i.pravatar.cc/40"}
    //           alt={user.username}
    //           className="w-10 h-10 rounded-full mr-3"
    //           width={40}
    //           height={40}
    //         />
    //         <span className="font-medium">{user.username}</span>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
  <div className="p-2 font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
    Recent Chats
  </div>

  <div className="flex-1 overflow-y-auto">
  {users.map((user) => (
    <div
      key={user.id}
      className="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 mb-2" // Increased padding and added margin-bottom
      onClick={() => onSelectUser(user)}
    >
      {/* Avatar */}
      {user.image ? (
        <Image
          width={40}
          height={40}
          src={user.image}
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover mr-3" // Margin-right to add space between avatar and text
        />
      ) : (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-400 text-white font-bold mr-3">
          {`${user.firstname?.[0]?.toUpperCase() || "U"}${user.lastname?.[0]?.toUpperCase() || ""}`}
        </div>
      )}

      {/* Username */}
      <span className="font-medium text-gray-900 dark:text-gray-100">{user.username}</span>
    </div>
  ))}
</div>

</div>

  );
};

export default RecentConversations;

