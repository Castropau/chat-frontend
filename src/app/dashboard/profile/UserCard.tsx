"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profile_image?: string | null;
  isFollowing?: boolean;
}

interface UserCardProps {
  user: User;
  onFollowToggle: (user: User) => void;
}

export default function UserCard({ user, onFollowToggle }: UserCardProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push(`/dashboard/profile/${user.username}`)}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          {user.profile_image ? (
            <Image
              src={user.profile_image}
              alt={user.username}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
              {user.firstname?.[0] || "U"}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium">{user.firstname} {user.lastname}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      <button
        onClick={() => onFollowToggle(user)}
        className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
          user.isFollowing
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {user.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}
