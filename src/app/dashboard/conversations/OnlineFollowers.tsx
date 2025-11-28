// "use client";
// import { initSocket } from "@/utils/webSocket";
// import React, { useState, useEffect } from "react";
// // import { initSocket, getSocket } from "@/utils/websocket";

// interface User {
//   id: string;
//   username: string;
//   image?: string;
//   online?: number;
// }

// interface Props {
//   onSelectUser: (user: User) => void;
// }

// const OnlineFollowers: React.FC<Props> = ({ onSelectUser }) => {
//   const [onlineFollowers, setOnlineFollowers] = useState<User[]>([]);

//   const fetchOnlineFollowers = async () => {
//     const res = await fetch("/api/online-followers");
//     const data = await res.json();
//     setOnlineFollowers(data);
//   };

//   useEffect(() => {
//     fetchOnlineFollowers();

//     const socket = initSocket("http://localhost:4000");

//     // 🔥 Realtime listener
//     socket.on("onlineStatus:update", ({ userId, online }) => {
//       setOnlineFollowers((prev) =>
//         prev.map((u) =>
//           u.id == userId ? { ...u, online } : u
//         )
//       );
//     });

//     return () => {
//       socket.off("onlineStatus:update");
//     };
//   }, []);

//   return (
//     <div className="flex-1 overflow-y-auto p-2">
//       <h4 className="text-sm font-semibold mb-2">Online users</h4>

//       {onlineFollowers.length ? (
//         <div>
//           {onlineFollowers.map((user) => (
//             <div
//               key={user.id}
//               className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
//               onClick={() => onSelectUser(user)}
//             >
//               <img
//                 src={user.image || "https://i.pravatar.cc/40"}
//                 className="w-10 h-10 rounded-full object-cover"
//               />

//               <div className="flex-1 flex items-center gap-2">
//                 <p className="font-medium text-gray-900">{user.username}</p>

//                 {/* 🔥 online color indicator */}
//                 <span
//                   className={`w-3 h-3 rounded-full ${
//                     user.online === 1 ? "bg-blue-500" : "bg-red-500"
//                   }`}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-sm text-gray-500">No online</p>
//       )}
//     </div>
//   );
// };

// export default OnlineFollowers;
"use client";
import { initSocket } from "@/utils/webSocket";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface User {
  id: number | string;
  username: string;
  image?: string;
  online?: number;
}

interface Props {
    // currentUser: User;                     // add this

  onSelectUser: (user: User) => void;
}
// const socketUrl = process.env.SOCKET_URL;
const OnlineFollowers: React.FC<Props> = ({ onSelectUser }) => {
  const [onlineFollowers, setOnlineFollowers] = useState<User[]>([]);

  const fetchOnlineFollowers = async () => {
    const res = await fetch("/api/online-followers");
    const data: User[] = await res.json();

    // Sort initially: online first, then alphabetically
    const sorted = data.sort((a, b) => {
      if (b.online! - a.online!) return b.online! - a.online!;
      return a.username.localeCompare(b.username);
    });

    setOnlineFollowers(sorted);
  };

  useEffect(() => {
    fetchOnlineFollowers();

    // const socket = initSocket("http://localhost:4000");
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    const socket = initSocket(socketUrl!);

    // const socketUrl = process.env.SOCKET_URL;
    // const socket = initSocket(socketUrl!);

    socket.on("onlineStatus:update", ({ userId, online }: { userId: number; online: number }) => {
      setOnlineFollowers((prev) => {
        const updated = prev.map((u) => (u.id === userId ? { ...u, online } : u));

        // Sort: online first, then alphabetically
        updated.sort((a, b) => {
          if (b.online! - a.online!) return b.online! - a.online!;
          return a.username.localeCompare(b.username);
        });

        return [...updated];
      });
    });

    return () => {
      socket.off("onlineStatus:update");
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <h4 className="text-sm font-semibold mb-2">Online users</h4>

      {onlineFollowers.length ? (
        <div>
          {onlineFollowers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectUser(user)}
            >
              <Image
                src={user.image || "https://i.pravatar.cc/40"}
                className="w-10 h-10 rounded-full object-cover"
                alt={user.username}
                width={40}
                height={40}
              />

              <div className="flex-1 flex items-center gap-2">
                <p className="font-medium text-gray-900">{user.username}</p>

                {/* Online status indicator */}
                <span
                  className={`w-3 h-3 rounded-full ${
                    user.online === 1 ? "bg-blue-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No online</p>
      )}
    </div>
  );
};

export default OnlineFollowers;

