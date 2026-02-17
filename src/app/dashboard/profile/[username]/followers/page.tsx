"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  image?: string;
}

export default function FollowersPage() {
  const params = useParams();
  const router = useRouter();
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const username =
    typeof params.username === "string" ? params.username : params.username?.[0];
const [currentUserId, setCurrentUserId] = useState<number | null>(null);

useEffect(() => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    setCurrentUserId(parsed.id);
  }
}, []);

  useEffect(() => {
    if (!username) return;

    const fetchFollowers = async () => {
      try {
        const decodedUsername = decodeURIComponent(username);
        const res = await axios.get("/api/followers/list", {
          params: { username: decodedUsername },
        });
        setFollowers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching followers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [username]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300 pt-[60px]">
        Loading...
      </div>
    );

  if (followers.length === 0)
    return (
    <div className="flex items-center justify-center h-[calc(100vh-60px)] text-center text-gray-700 dark:text-gray-300">
  No followers yet.
</div>

    );

  return (
    <div className="min-h-screen flex-1 w-full bg-gray-50 dark:bg-gray-900 p-4 pt-[100] overflow-y-auto">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          {decodeURIComponent(username!)}s Followers
        </h1>

        <ul className="space-y-4">
          {followers.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              // onClick={() => router.push(`/dashboard/profile/${user.username}`)}
              onClick={() => {
    if (currentUserId === user.id) {
      router.push(`/dashboard/user_profile/${user.username}`);
    } else {
      router.push(`/dashboard/profile/${user.username}`);
    }
  }}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.firstname}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg uppercase border border-gray-200 dark:border-gray-600">
                  {`${user.firstname[0] || ""}${user.lastname[0] || ""}`}
                </div>
              )}

              <div className="flex flex-col">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
