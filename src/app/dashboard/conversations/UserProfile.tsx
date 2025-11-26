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
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
        <div>
          <h2 className="text-sm font-medium text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center p-4 border-b border-gray-200 bg-white">
      <Image
        src={user.image || "https://via.placeholder.com/40"}
        alt={user.firstname || "User"}
        className="w-10 h-10 rounded-full object-cover mr-3"
        width={40}
        height={40}
      />
      <div>
        <h2 className="text-sm font-medium text-gray-900">
          {user.firstname} {user.lastname || ""}
        </h2>
        <p className="text-xs text-gray-600">{user.username}</p>
      </div>
    </div>
  );
};

export default UserProfile;
