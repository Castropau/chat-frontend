import React, { useState, useEffect } from "react";
import ConversationItem from "./ConversationItem";
import UserProfile from "./UserProfile";
import OnlineFollowers from "./OnlineFollowers";
import { initSocket } from "@/utils/webSocket";

export interface User {
  id: string | number;
  username: string;
  image?: string;
  online?: number;
}

interface Props {
  // currentUser: User;                  // required
  onSelectUser: (user: User) => void; 
}

// const socketUrl = process.env.SOCKET_URL;
const ConversationList: React.FC<Props> = ({  onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     if (!search.trim()) return setUsers([]);
  //     const res = await fetch(`/api/users?q=${search}`);
  //     const data = await res.json();
  //     setUsers(data);
  //   };
  //   fetchUsers();
  // }, [search]);
 const fetchUsers = async (query = "") => {
    try {
      const res = await fetch(`/api/users?q=${query}`);
      const data: User[] = await res.json();

      // Sort online first, then username
      data.sort((a, b) => {
        if (b.online! - a.online!) return b.online! - a.online!;
        return a.username.localeCompare(b.username);
      });

      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  // Fetch users on mount and when search changes
  useEffect(() => {
    fetchUsers(search);
  }, [search]);

  // Socket listener for realtime online status
  useEffect(() => {
    // const socket = initSocket("http://localhost:4000");
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    const socket = initSocket(socketUrl!);

    socket.on("onlineStatus:update", ({ userId, online }: { userId: number; online: number }) => {
      // setUsers((prev) => {
      //   const updated = prev.map((u) => (u.id === userId ? { ...u, online } : u));
      //   // Keep online users on top
      //   updated.sort((a, b) => {
      //     if (b.online! - a.online!) return b.online! - a.online!;
      //     return a.username.localeCompare(b.username);
      //   });
      //   return [...updated];
      // });
    setUsers((prev) => {
  const updated = prev.map((u) =>
    u.id === userId.toString() ? { ...u, online } : u
  );

  // Keep online users on top
  updated.sort((a, b) => {
    if ((b.online || 0) - (a.online || 0)) return (b.online || 0) - (a.online || 0);
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
    <div className="border-r border-gray-200 flex flex-col h-full bg-gray-50">
      <UserProfile />

      {/* Search */}
      <div className="p-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full px-3 py-2 rounded border border-gray-300"
        />
      </div>

      {/* Search results */}
      {search.trim() && (
        <div className="overflow-y-auto flex-1 p-2">
          {users.length > 0 ? (
            users.map((user) => (
              <ConversationItem
                key={user.id}
                id={user.id}
                name={user.username}
                avatar={user.image || "https://i.pravatar.cc/40"}
                  online={user.online}

                onClick={() => onSelectUser(user)}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 p-2">No users found</div>
          )}
        </div>
      )}

      {/* Online Followers — FIXED */}
      <OnlineFollowers
        // currentUser={currentUser}
        onSelectUser={onSelectUser}
      />
    </div>
  );
};

export default ConversationList;
