"use client";
export const runtime = 'edge';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  profile_image?: string | null;
  isFollowing?: boolean;
}

interface FollowersListProps {
  type: "followers" | "following";
  profileUserId: number;
  loggedInUserId: number;
}

export default function FollowersList({
  type,
  profileUserId,
  loggedInUserId,
}: FollowersListProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  useEffect(() => {
    if (!profileUserId) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/${type}/list?userId=${profileUserId}`
        );
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [type, profileUserId]);

  const toggleFollow = async (userId: number, isFollowing: boolean) => {
    try {
      setUpdatingIds((prev) => [...prev, userId]);

      const res = await axios({
        method: isFollowing ? "DELETE" : "POST",
        url: "/api/follow",
        data: {
          followerId: loggedInUserId,
          followingId: userId,
        },
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: res.data.isFollowing } : u
        )
      );
    } catch (err) {
      console.error("Follow toggle error:", err);
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading...</p>
    );
  }

  if (!users.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No {type} yet.
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">{type}</h1>

      <ul className="divide-y divide-gray-200">
        {users.map((user) => {
          const initials = `${user.firstname?.[0] || ""}${
            user.lastname?.[0] || ""
          }`.toUpperCase();

          const isUpdating = updatingIds.includes(user.id);

          return (
            <li
              key={user.id}
              className="flex items-center justify-between py-4 px-2 rounded hover:bg-gray-100 transition"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => router.push(`/profile/${user.username}`)}
              >
                {user.profile_image ? (
                  <Image
                    src={user.profile_image}
                    alt={user.username}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {initials}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-900">
                    {user.firstname} {user.lastname}
                  </p>
                  <p className="text-sm text-gray-500">
                    @{user.username}
                  </p>
                </div>
              </div>

              {user.id !== loggedInUserId && (
                <button
                  disabled={isUpdating}
                  onClick={() =>
                    toggleFollow(user.id, !!user.isFollowing)
                  }
                  className={`px-4 py-1 rounded-full text-sm transition ${
                    user.isFollowing
                      ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } disabled:opacity-50`}
                >
                  {isUpdating
                    ? "..."
                    : user.isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
