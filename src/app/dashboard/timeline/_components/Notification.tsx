// "use client";

// import { useEffect, useState, useRef, startTransition } from "react";
// import { FiBell, FiX } from "react-icons/fi";
// import { useRouter } from "next/navigation";
// import { io, Socket } from "socket.io-client";
// import { hashId } from "@/lib/hash";

// interface Notification {
//   id: number;
//   message: string;
//   created_at?: string;
//   is_read?: boolean;
//   actorName?: string;
//   title?: string;
//   type?: string;      // reaction | comment | others
//   post_id?: number;   // goal id
// }

// let socket: Socket | null = null;

// export default function NotificationBell() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [userId, setUserId] = useState<number | null>(null);
//   const router = useRouter();
//   const routerRef = useRef(router);
//   routerRef.current = router;

//   useEffect(() => {
//     if (!socket) socket = io("http://localhost:4000", { transports: ["websocket"] });

//     socket.on("connect", () => console.log("✅ Socket connected"));
//     socket.on("disconnect", () => console.log("Socket disconnected"));

//     return () => {
//       socket?.disconnect();
//       socket = null;
//     };
//   }, []);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user?.id) setUserId(user.id);
//   }, []);

//   useEffect(() => {
//     if (!userId) return;
//     (async () => {
//       const res = await fetch(`/api/notification?userId=${userId}`);
//       const data = await res.json();
//       setNotifications(data);
//     })();
//   }, [userId]);

// //   useEffect(() => {
// //     if (!socket || !userId) return;

// //     socket.emit("joinUserRoom", { userId });

// // //  const handleNew = (notif: Notification) => {
// // //   console.log("🟢 New socket notification received: ", notif);

// // //   // Debug post_id for realtime notification
// // //   if (notif.post_id) {
// // //     console.log("🎯 Realtime notification goal id (post_id) is:", notif.post_id);
// // //   } else {
// // //     console.warn("⚠️ Realtime notification missing post_id");
// // //   }

// // //   setNotifications((prev) => {
// // //     if (prev.find((n) => n.id === notif.id)) return prev;
// // //     return [notif, ...prev];
// // //   });

// // //   // ⚠️ Remove auto-redirect here
// // //   // Redirect will only happen when user clicks
// // // };
// // const handleNew = (notif: Notification) => {
// //   console.log("🟢 New socket notification received: ", notif);

// //   // Ensure required fields exist
// //   const normalizedNotif: Notification = {
// //     ...notif,
// //     post_id: notif.post_id || null,
// //     type: notif.type || "reaction",
// //     title: notif.title || "",
// //     actorName: notif.actorName || "",
// //     is_read: notif.is_read ?? false,
// //     created_at: notif.created_at || new Date().toISOString(),
// //   };

// //   setNotifications((prev) => {
// //     if (prev.find((n) => n.id === normalizedNotif.id)) return prev;
// //     return [normalizedNotif, ...prev];
// //   });
// // };



// //     socket.on("notification:new", handleNew);

// //     return () => {
// //       socket.off("notification:new", handleNew);
// //     };
// //   }, [userId]);





// // halos okay na
// // useEffect(() => {
// //   if (!socket || !userId) return;

// //   socket.emit("joinUserRoom", { userId });

// //   const handleNew = (notif: Notification) => {
// //     const normalizedNotif: Notification = {
// //       ...notif,
// //       post_id: notif.post_id || null,
// //       type: notif.type || "reaction",
// //       title: notif.title || "",
// //       actorName: notif.actorName || "",
// //       is_read: notif.is_read ?? false,
// //       created_at: notif.created_at || new Date().toISOString(),
// //     };

// //     setNotifications((prev) => {
// //       if (prev.find((n) => n.id === normalizedNotif.id)) return prev;
// //       return [normalizedNotif, ...prev];
// //     });
// //   };

// //   const handleDelete = (notif: Notification) => {
// //     setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
// //   };

// //   socket.on("notification:new", handleNew);
// //   socket.on("notification:delete", handleDelete);

// //   return () => {
// //     socket.off("notification:new", handleNew);
// //     socket.off("notification:delete", handleDelete);
// //   };
// // }, [userId]);
// // useEffect(() => {
// //   if (!socket || !userId) return;

// //   socket.emit("joinUserRoom", { userId });

// //   const handleNew = (notif: Notification) => {
// //     const normalizedNotif: Notification = {
// //       ...notif,
// //       post_id: notif.post_id || null,
// //       type: notif.type || "reaction",
// //       title: notif.title || "",
// //       actorName: notif.actorName || "",
// //       is_read: notif.is_read ?? false,
// //       created_at: notif.created_at || new Date().toISOString(),
// //     };

// //     setNotifications((prev) => {
// //       if (prev.find((n) => n.id === normalizedNotif.id)) return prev;
// //       return [normalizedNotif, ...prev];
// //     });
// //   };

// //   const handleUpdate = (notif: Notification) => {
// //     const normalizedNotif: Notification = {
// //       ...notif,
// //       post_id: notif.post_id || null,
// //       type: notif.type || "reaction",
// //       title: notif.title || "",
// //       actorName: notif.actorName || "",
// //       is_read: notif.is_read ?? false,
// //       created_at: notif.created_at || new Date().toISOString(),
// //     };

// //     setNotifications((prev) =>
// //       prev.map((n) => (n.id === normalizedNotif.id ? normalizedNotif : n))
// //     );
// //   };

// //   const handleDelete = (notif: Notification) => {
// //     setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
// //   };

// //   socket.on("notification:new", handleNew);
// //   socket.on("notification:update", handleUpdate);
// //   socket.on("notification:delete", handleDelete);

// //   return () => {
// //     socket.off("notification:new", handleNew);
// //     socket.off("notification:update", handleUpdate);
// //     socket.off("notification:delete", handleDelete);
// //   };
// // }, [userId]);
// useEffect(() => {
//   if (!socket || !userId) return;

//   socket.emit("joinUserRoom", { userId });

//   const handleNew = (notif: Notification) => {
//     const normalizedNotif: Notification = {
//       ...notif,
//       post_id: notif.post_id || null,
//       type: notif.type || "reaction",
//       title: notif.title || "",
//       actorName: notif.actorName || "",
//       is_read: notif.is_read ?? false,
//       created_at: notif.created_at || new Date().toISOString(),
//     };

//     setNotifications((prev) => {
//       if (prev.find((n) => n.id === normalizedNotif.id)) return prev;
//       return [normalizedNotif, ...prev];
//     });
//   };

//   const handleUpdate = (notif: Notification) => {
//     const normalizedNotif: Notification = {
//       ...notif,
//       post_id: notif.post_id || null,
//       type: notif.type || "reaction",
//       title: notif.title || "",
//       actorName: notif.actorName || "",
//       is_read: notif.is_read ?? false,
//       created_at: notif.created_at || new Date().toISOString(),
//     };

//     setNotifications((prev) =>
//       prev.map((n) => (n.id === normalizedNotif.id ? normalizedNotif : n))
//     );
//   };

//   const handleDelete = (notif: Notification) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
//   };

//   socket.on("notification:new", handleNew);
//   socket.on("notification:update", handleUpdate);
//   socket.on("notification:delete", handleDelete);

//   return () => {
//     if (!socket) return; // ✅ Check if socket exists before calling off
//     socket.off("notification:new", handleNew);
//     socket.off("notification:update", handleUpdate);
//     socket.off("notification:delete", handleDelete);
//   };
// }, [userId]);

//   const markAsRead = async (id: number) => {
//     await fetch("/api/notification", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });

//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
//     );
//   };

// const handleNotificationClick = async (notif: Notification) => {
//   await markAsRead(notif.id);

//   console.log("🔵 Notification clicked: ", notif);

//   // Debug the post_id
//   if (notif.post_id) {
//     console.log("🎯 Your goal id (post_id) is:", notif.post_id);
//   } else {
//     console.warn("⚠️ Missing post_id for this notification");
//   }

//   // if ((notif.type === "reaction" || notif.type === "comment") && notif.post_id) {
//   //   router.push(`/dashboard/posted/${notif.post_id}`);
//   // } 
//   if ((notif.type === "reaction" || notif.type === "comment") && notif.post_id) {
//     const hash = hashId(notif.post_id);
//     router.push(`/dashboard/posted/${hash}`);
//   }
//   else {
//     console.warn("⚠️ No redirect: missing type or post_id");
//   }
// };


//   const unreadCount = notifications.filter((n) => !n.is_read).length;
//   const toggleDropdown = () => setIsOpen((p) => !p);

//   return (
//     <div className="relative">
//       <button
//         onClick={toggleDropdown}
//         className="relative p-2 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//       >
//         <FiBell className="text-2xl" />
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 z-50">
//           <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
//             <h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4>
//             <button
//               onClick={toggleDropdown}
//               className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
//             >
//               <FiX />
//             </button>
//           </div>

//           <div className="max-h-64 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <p className="text-center p-4 text-gray-500 dark:text-gray-400">
//                 No notifications
//               </p>
//             ) : (
//               notifications.map((n) => (
//                 <div
//                   key={n.id}
//                   onClick={() => handleNotificationClick(n)}
//                   className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
//                     n.is_read ? "opacity-70" : ""
//                   }`}
//                 >
//                   <p className="text-gray-800 dark:text-white">
//                     {n.message}{" "}
//                     <span
//                       className="truncate max-w-[150px] inline-block align-middle"
//                       title={n.title}
//                     >
//                       {n.title}
//                     </span>
//                   </p>
//                   <small className="text-gray-500 dark:text-gray-400">
//                     {new Date(n.created_at || "").toLocaleString()}
//                   </small>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useRef } from "react";
import { FiBell, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { hashId } from "@/lib/hash";

interface Notification {
  id: number;
  message: string;
  created_at?: string;
  updated_at?: string;
  is_read?: boolean;
  actorName?: string;
  title?: string;
  type?: string;      // reaction | comment | others
  post_id?: number | null;   // goal id
}

let socket: Socket | null = null;

// Sort notifications by updated_at or created_at
const sortByUpdatedAt = (notifications: Notification[]) => {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || "").getTime();
    const dateB = new Date(b.updated_at || b.created_at || "").getTime();
    return dateB - dateA;
  });
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
const socketUrl = process.env.SOCKET_URL;
  // Socket initialization
  useEffect(() => {
    // if (!socket) socket = io("http://localhost:4000", 
    if (!socket) socket = io(socketUrl!,
      { transports: ["websocket"] });

    socket.on("connect", () => console.log("✅ Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  // Load user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) setUserId(user.id);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const res = await fetch(`/api/notification?userId=${userId}`);
      const data = await res.json();
      setNotifications(sortByUpdatedAt(data));
    })();
  }, [userId]);

  // Socket handlers
  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("joinUserRoom", { userId });

    const handleNew = (notif: Notification) => {
      const normalized: Notification = {
        ...notif,
        post_id: notif.post_id || null,
        type: notif.type || "reaction",
        title: notif.title || "",
        actorName: notif.actorName || "",
        is_read: notif.is_read ?? false,
        created_at: notif.created_at || new Date().toISOString(),
      };
      setNotifications((prev) => sortByUpdatedAt([normalized, ...prev]));
    };

    const handleUpdate = (notif: Notification) => {
      const normalized: Notification = {
        ...notif,
        post_id: notif.post_id || null,
        type: notif.type || "reaction",
        title: notif.title || "",
        actorName: notif.actorName || "",
        is_read: notif.is_read ?? false,
        created_at: notif.created_at || new Date().toISOString(),
      };
      setNotifications((prev) =>
        sortByUpdatedAt(prev.map((n) => (n.id === normalized.id ? normalized : n)))
      );
    };

    const handleDelete = (notif: Notification) => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    };

    socket.on("notification:new", handleNew);
    socket.on("notification:update", handleUpdate);
    socket.on("notification:delete", handleDelete);

    return () => {
      if (!socket) return;
      socket.off("notification:new", handleNew);
      socket.off("notification:update", handleUpdate);
      socket.off("notification:delete", handleDelete);
    };
  }, [userId]);

  const markAsRead = async (id: number) => {
    await fetch("/api/notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      sortByUpdatedAt(prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    );
  };

  const handleNotificationClick = async (notif: Notification) => {
    await markAsRead(notif.id);
    if ((notif.type === "reaction" || notif.type === "comment") && notif.post_id) {
      const hash = hashId(notif.post_id);
      router.push(`/dashboard/posted/${hash}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const toggleDropdown = () => setIsOpen((p) => !p);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <FiBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 z-50">
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4>
            <button
              onClick={toggleDropdown}
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <FiX />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center p-4 text-gray-500 dark:text-gray-400">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    n.is_read ? "opacity-70" : ""
                  }`}
                >
                  <p className="text-gray-800 dark:text-white">
                    {n.message}{" "}
                    <span className="truncate max-w-[150px] inline-block align-middle" title={n.title}>
                      {n.title}
                    </span>
                  </p>
                  <small className="text-gray-500 dark:text-gray-400">
                    {new Date(n.created_at || "").toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

