"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./UserCard";
// import UserCard from "./UserCard";

interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profile_image?: string | null;
  isFollowing?: boolean;
}

interface UserListProps {
  type: "followers" | "following";
  userId: number;
}

export default function UserList({ type, userId }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [type, userId]);

  const fetchUsers = async () => {
    try {
      const endpoint = type === "followers" ? "/api/followers/list" : "/api/following/list";
      const res = await axios.get(endpoint, { params: { userId } });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleFollowToggle = async (user: User) => {
    try {
      if (user.isFollowing) {
        await axios.post("/api/unfollow", { targetId: user.id });
      } else {
        await axios.post("/api/follow", { targetId: user.id });
      }
      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, isFollowing: !u.isFollowing } : u))
      );
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 capitalize">{type}</h2>
      <div className="bg-white rounded-xl shadow-md p-4 max-h-[400px] overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No {type} yet.</p>
        ) : (
          users.map(user => (
            <UserCard key={user.id} user={user} onFollowToggle={handleFollowToggle} />
          ))
        )}
      </div>
    </div>
  );
}
