import React, { useEffect, useState } from "react";
import Image from "next/image";
const UserProfile: React.FC = () => {
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname?: string;
    image?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setLoading(false);
      return;
    }

    const localUser = JSON.parse(stored);

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/my-profile/${localUser.id}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.error("Server returned error:", data);
          setUser(localUser); // fallback to localStorage
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setUser(localUser); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex items-center p-4 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
        <div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">Loading...</h2>
        </div>
      </div>
    );
  }

return (
  <div className="flex items-center p-4 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 gap-3">
    {/* Avatar */}
    {user.image ? (
      <Image
        width={40}
        height={40}
        src={user.image}
        alt={user.username}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-400 dark:bg-gray-600 text-white font-bold text-sm">
        {`${user.firstname?.[0]?.toUpperCase() || "U"}${user.lastname?.[0]?.toUpperCase() || ""}`}
      </div>
    )}

    {/* User info */}
    <div className="flex flex-col">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {user.firstname || "Unknown"} {user.lastname || ""}
      </h2>
      <p className="text-xs text-gray-600 dark:text-gray-400">{user.username || "No username"}</p>
    </div>
  </div>
);


};

export default UserProfile;
