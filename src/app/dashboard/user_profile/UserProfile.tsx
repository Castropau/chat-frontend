"use client";

import axios from "axios";
import { useEffect, useState } from "react";
// import { api } from "@/lib/axios";

interface User {
  id: number;
  user_firstname: string;
  user_lastname: string;
  username: string;
  email: string;
  created_at: string;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`/api/user_profile/${params.id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user3:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [params.id]);

  if (loading) {
    return <p className="text-center mt-10">Loading user...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-red-500">User not found.</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 rounded-xl shadow-md 
                    bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-blue-600 text-white 
                        flex items-center justify-center text-3xl font-bold">
          {user.user_firstname.charAt(0)}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user.user_firstname} {user.user_lastname}
          </h1>

          <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-300 dark:border-gray-700" />

      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Contact Info
      </h2>

      <p className="text-gray-700 dark:text-gray-300 mb-1">
        <span className="font-semibold">Email:</span> {user.email}
      </p>
    </div>
  );
}
