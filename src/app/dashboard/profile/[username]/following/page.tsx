"use client";
export const runtime = 'edge';
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

export default function FollowingPage() {
  const params = useParams();
  const router = useRouter();
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Ensure username is a string
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

    const fetchFollowing = async () => {
      try {
        const decodedUsername = decodeURIComponent(username);
        console.log("Fetching following for username:", decodedUsername);

        const res = await axios.get("/api/following/list", {
          params: { username: decodedUsername },
        });

        console.log("API response:", res.data);

        setFollowing(res.data.users || []);
      } catch (err) {
        console.error("Error fetching following:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [username]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (following.length === 0)
    return <div className="flex items-center justify-center h-[calc(100vh-60px)] text-center text-gray-700 dark:text-gray-300">
  No followers yet.
</div>;

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">{decodeURIComponent(username!)} is Following</h1>
//       <ul className="space-y-4">
//         {following.map((user) => (
//           <li
//             key={user.id}
//             className="flex items-center gap-4 p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
//             onClick={() => router.push(`/dashboard/profile/${user.username}`)}
//           >
//             {/* <img
//               src={user.image || "/default-avatar.png"}
//               alt={user.firstname}
//               className="w-10 h-10 rounded-full object-cover"
//             /> */}
//              {user.image ? (
//   <Image
//     src={user.image}
//     alt={user.firstname}
//     className="w-10 h-10 rounded-full object-cover"
//       width={50}
//     height={50}
//   />
// ) : (
//   <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white font-bold">
//     {`${user.firstname[0] || ""}${user.lastname[0] || ""}`.toUpperCase()}
//   </div>
// )}
//             <div>
//               <p className="font-semibold text-gray-900 dark:text-gray-100">
//                 {user.firstname} {user.lastname}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 @{user.username}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
return (
  <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
    <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        {decodeURIComponent(username!)} is Following
      </h1>

      {following.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-lg">
          {decodeURIComponent(username!)} is not following anyone yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {following.map((user) => (
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
              {/* Avatar */}
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

              {/* User info */}
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
      )}
    </div>
  </div>
);


}
