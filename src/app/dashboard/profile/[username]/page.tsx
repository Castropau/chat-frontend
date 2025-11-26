// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import { FiMessageCircle, FiShare2, FiSmile } from "react-icons/fi";
// import { initSocket } from "@/utils/webSocket";

// export default function ProfilePage() {
//   const { username: usernameParam } = useParams(); // ✅ get username from URL
//   const [username, setUsername] = useState<string | null>(usernameParam || null);
//   const [profile, setProfile] = useState<any>(null);
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
//   const [reactionPickerPostId, setReactionPickerPostId] = useState<number | null>(null);
//   const [selectedReactions, setSelectedReactions] = useState<Record<number, string>>({});
//   const [emojis, setEmojis] = useState<{ id: number; emoji: string; label: string }[]>([]);
//   const [userId, setUserId] = useState<number | null>(null);

//   // Fetch emojis
//   useEffect(() => {
//     const fetchEmojis = async () => {
//       try {
//         const res = await fetch("/api/emojis");
//         if (!res.ok) throw new Error("Failed to fetch emojis");
//         const data = await res.json();
//         setEmojis(data);
//       } catch (err) {
//         console.error("Error fetching emojis:", err);
//       }
//     };
//     fetchEmojis();
//   }, []);

//   // Load profile and goals
//   useEffect(() => {
//     if (!username) return;

//     async function loadData() {
//       try {
//         // 1️⃣ Fetch profile by username
//         const profileRes = await fetch(`/api/profile/${username}`);
//         if (!profileRes.ok) throw new Error("Failed to fetch profile");
//         const profileData = await profileRes.json();
//         setProfile(profileData.user);
//         setUserId(profileData.user.id); // optional: set userId for reactions

//         // 2️⃣ Fetch goals using user_id
//         const goalsRes = await fetch(`/api/goals?user_id=${profileData.user.id}`);
//         if (!goalsRes.ok) throw new Error("Failed to fetch goals");
//         const goalsData = await goalsRes.json();
//         setPosts(goalsData.goals || []);
//       } catch (err) {
//         console.error("Error loading data:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, [username]);

//   // Handle reactions
//   const handleReaction = async (postId: number, emojiId: string) => {
//     if (!userId) return console.error("User not found.");

//     try {
//       setSelectedReactions((prev) => {
//         const current = prev[postId];
//         const newReaction = current === emojiId ? null : emojiId;
//         return { ...prev, [postId]: newReaction };
//       });

//       const method = selectedReactions[postId] === emojiId ? "DELETE" : "POST";

//       const res = await fetch("/api/reacts", {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ postId, emojiId, userId }),
//       });

//       if (!res.ok) throw new Error("Failed to update reaction");

//       const data = await res.json();

//       const socket = initSocket("http://localhost:4000");
//       socket.emit("reactions:update", { postId, payload: data });
//     } catch (err) {
//       console.error("Reaction error:", err);
//     } finally {
//       setReactionPickerPostId(null);
//     }
//   };

//   const toggleExpand = (postId: number) => {
//     setExpandedPosts((prev) => {
//       const next = new Set(prev);
//       next.has(postId) ? next.delete(postId) : next.add(postId);
//       return next;
//     });
//   };

//   if (loading)
//     return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>;
// if (!profile)
//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4">
//       <p className="text-red-500 text-lg font-semibold">Profile not found</p>
//       <button
//         onClick={() => setUsername(null)} // or navigate to timeline
//         className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
//       >
//         Return to Timeline
//       </button>
//     </div>
//   );

// //   if (!profile)
// //     return <div className="p-6 text-center text-red-500 dark:text-red-400">Profile not found</div>;

//   const initials = `${profile.firstname?.[0] || ""}${profile.lastname?.[0] || ""}`.toUpperCase();

//   return (
//     <div className="p-6 max-w-3xl mx-auto dark:bg-gray-900 min-h-screen">
//       {/* Profile Header */}
//       <div className="flex flex-col items-center mb-8">
//         <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
//           {initials}
//         </div>
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//           {profile.firstname} {profile.lastname}
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
//       </div>

//       {/* Posts Feed */}
//       <div>
//         {posts.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10 dark:text-gray-300">
//             No goals posted yet.
//           </p>
//         ) : (
//           posts.map((post) => (
//             <article
//               key={post.id}
//               className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
//             >
//               {/* User header */}
//               <div className="flex items-center space-x-4 mb-4">
//                 <div className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold">
//                   {initials}
//                 </div>
//                 <div>
//                   <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
//                     {profile.firstname} {profile.lastname}
//                   </h2>
//                   <p className="text-sm text-blue-600 dark:text-blue-400">
//                     Goal: {post.category_names}
//                   </p>
//                 </div>
//               </div>

//               {/* Post text */}
//               <p
//                 className={`text-gray-800 mb-4 leading-relaxed dark:text-gray-300 break-words ${
//                   expandedPosts.has(post.id) ? "max-h-full" : "line-clamp-3 overflow-hidden"
//                 }`}
//               >
//                 {post.title}
//               </p>

//               {post.title?.length > 120 && (
//                 <button
//                   onClick={() => toggleExpand(post.id)}
//                   className="text-blue-500 hover:underline font-medium"
//                 >
//                   {expandedPosts.has(post.id) ? "Less view" : "View more"}
//                 </button>
//               )}

//               {/* Post media */}
//               {post.post_image && (
//                 <Image
//                   src={post.post_image}
//                   alt="Goal Image"
//                   width={500}
//                   height={300}
//                   className="w-full rounded-lg mb-4 shadow-sm object-cover max-h-60"
//                 />
//               )}

//               {/* Reaction Section */}
//               <div className="flex space-x-8 border-t pt-4 dark:border-gray-700">
//                 <div className="relative flex items-center gap-2">
//                   {selectedReactions[post.id] && (
//                     <span className="text-2xl">
//                       {emojis.find((e) => e.id.toString() === selectedReactions[post.id])?.emoji}
//                     </span>
//                   )}

//                   <button
//                     onClick={() =>
//                       setReactionPickerPostId(
//                         reactionPickerPostId === post.id ? null : post.id
//                       )
//                     }
//                     className="flex items-center gap-2 text-yellow-600 font-semibold hover:underline dark:text-yellow-400"
//                   >
//                     <FiSmile className="text-xl" />
//                     React
//                   </button>

//                   {reactionPickerPostId === post.id && (
//                     <div className="absolute top-full mt-2 left-0 z-20 flex space-x-4 bg-white p-3 rounded shadow-md border dark:bg-gray-700 dark:border-gray-600">
//                       {emojis.map((r) => (
//                         <button
//                           key={r.id}
//                           onClick={() => handleReaction(post.id, r.id.toString())}
//                           className={`flex flex-col items-center px-2 py-1 rounded hover:scale-110 ${
//                             selectedReactions[post.id] === r.id.toString()
//                               ? "bg-gray-300 dark:bg-gray-600"
//                               : "bg-transparent"
//                           }`}
//                         >
//                           <span className="text-2xl">{r.emoji}</span>
//                           <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
//                             {r.label}
//                           </span>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <button className="flex items-center gap-2 text-blue-600 font-semibold hover:underline dark:text-blue-400">
//                   <FiMessageCircle className="text-xl" />
//                   Comment
//                 </button>

//                 <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline dark:text-green-400">
//                   <FiShare2 className="text-xl" />
//                   Share
//                 </button>
//               </div>
//             </article>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiMessageCircle, FiShare2, FiSmile } from "react-icons/fi";
import { initSocket } from "@/utils/webSocket";

interface Emoji {
  id: number;
  emoji: string;
  label: string;
}

interface Post {
  id: number;
  title: string;
  category_names: string;
  post_image?: string;
}

interface Profile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
}
const socketUrl = process.env.SOCKET_URL;
export default function ProfilePage() {
  const { username: usernameParam } = useParams();
  const router = useRouter();
const initialUsername: string | null =
  typeof usernameParam === "string" ? usernameParam : null;
  // const [username, setUsername] = useState<string | null>(usernameParam || null);
    // const [username] = useState<string | null>(usernameParam || null);
    const [username] = useState<string | null>(initialUsername);


  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [reactionPickerPostId, setReactionPickerPostId] = useState<number | null>(null);
  // const [selectedReactions, setSelectedReactions] = useState<Record<number, string>>({});
  const [selectedReactions, setSelectedReactions] = useState<Record<number, string | null>>({});

  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // Fetch emojis
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const res = await fetch("/api/emojis");
        if (!res.ok) throw new Error("Failed to fetch emojis");
        const data = await res.json();
        setEmojis(data);
      } catch (err) {
        console.error("Error fetching emojis:", err);
      }
    };
    fetchEmojis();
  }, []);

  // Fetch profile and posts
  useEffect(() => {
    if (!username) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch profile
        const profileRes = await fetch(`/api/profile/${username}`);
        const profileData = await profileRes.json();

        if (!profileData.user) {
          setProfile(null);
          setPosts([]);
          setLoading(false);
          return;
        }

        setProfile(profileData.user);
        setUserId(profileData.user.id);

        // 2️⃣ Fetch posts/goals
        const goalsRes = await fetch(`/api/goals?user_id=${profileData.user.id}`);
        if (!goalsRes.ok) throw new Error("Failed to fetch goals");
        const goalsData = await goalsRes.json();
        setPosts(goalsData.goals || []);
      } catch (err) {
        console.error("Error loading profile:", err);
        setProfile(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  // const toggleExpand = (postId: number) => {
  //   setExpandedPosts((prev) => {
  //     const next = new Set(prev);
  //     next.has(postId) ? next.delete(postId) : next.add(postId);
  //     return next;
  //   });
  // };
  const toggleExpand = (postId: number) => {
  setExpandedPosts((prev) => {
    const next = new Set(prev);
    if (next.has(postId)) {
      next.delete(postId);
    } else {
      next.add(postId);
    }
    return next;
  });
};


  const handleReaction = async (postId: number, emojiId: string) => {
    if (!userId) return console.error("User not found.");

    try {
      setSelectedReactions((prev) => {
        const current = prev[postId];
        const newReaction = current === emojiId ? null : emojiId;
        return { ...prev, [postId]: newReaction };
      });

      const method = selectedReactions[postId] === emojiId ? "DELETE" : "POST";

      const res = await fetch("/api/reacts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, emojiId, userId }),
      });

      if (!res.ok) throw new Error("Failed to update reaction");

      const data = await res.json();

      // const socket = initSocket("http://localhost:4000");
      const socket = initSocket(socketUrl!);
      socket.emit("reactions:update", { postId, payload: data });
    } catch (err) {
      console.error("Reaction error:", err);
    } finally {
      setReactionPickerPostId(null);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );

  if (!profile)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 text-lg font-semibold">Profile not found</p>
        <button
          onClick={() => router.push("/dashboard/timeline")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Return to Timeline
        </button>
      </div>
    );

  const initials = `${profile.firstname?.[0] || ""}${profile.lastname?.[0] || ""}`.toUpperCase();

  return (
    <div className="p-6 max-w-3xl mx-auto dark:bg-gray-900 min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
          {initials}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.firstname} {profile.lastname}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
      </div>

      {/* Posts Feed */}
      <div>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 dark:text-gray-300">
            No goals posted yet.
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
            >
              {/* User header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold">
                  {initials}
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {profile.firstname} {profile.lastname}
                  </h2>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Goal: {post.category_names}
                  </p>
                </div>
              </div>

              {/* Post text */}
              <p
                className={`text-gray-800 mb-4 leading-relaxed dark:text-gray-300 break-words ${
                  expandedPosts.has(post.id) ? "max-h-full" : "line-clamp-3 overflow-hidden"
                }`}
              >
                {post.title}
              </p>

              {post.title?.length > 120 && (
                <button
                  onClick={() => toggleExpand(post.id)}
                  className="text-blue-500 hover:underline font-medium"
                >
                  {expandedPosts.has(post.id) ? "Less view" : "View more"}
                </button>
              )}

              {/* Post media */}
              {post.post_image && (
                <Image
                  src={post.post_image}
                  alt="Goal Image"
                  width={500}
                  height={300}
                  className="w-full rounded-lg mb-4 shadow-sm object-cover max-h-60"
                />
              )}

              {/* Reaction Section */}
              <div className="flex space-x-8 border-t pt-4 dark:border-gray-700">
                <div className="relative flex items-center gap-2">
                  {selectedReactions[post.id] && (
                    <span className="text-2xl">
                      {emojis.find((e) => e.id.toString() === selectedReactions[post.id])?.emoji}
                    </span>
                  )}

                  <button
                    onClick={() =>
                      setReactionPickerPostId(
                        reactionPickerPostId === post.id ? null : post.id
                      )
                    }
                    className="flex items-center gap-2 text-yellow-600 font-semibold hover:underline dark:text-yellow-400"
                  >
                    <FiSmile className="text-xl" />
                    React
                  </button>

                  {reactionPickerPostId === post.id && (
                    <div className="absolute top-full mt-2 left-0 z-20 flex space-x-4 bg-white p-3 rounded shadow-md border dark:bg-gray-700 dark:border-gray-600">
                      {emojis.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleReaction(post.id, r.id.toString())}
                          className={`flex flex-col items-center px-2 py-1 rounded hover:scale-110 ${
                            selectedReactions[post.id] === r.id.toString()
                              ? "bg-gray-300 dark:bg-gray-600"
                              : "bg-transparent"
                          }`}
                        >
                          <span className="text-2xl">{r.emoji}</span>
                          <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                            {r.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="flex items-center gap-2 text-blue-600 font-semibold hover:underline dark:text-blue-400">
                  <FiMessageCircle className="text-xl" />
                  Comment
                </button>

                <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline dark:text-green-400">
                  <FiShare2 className="text-xl" />
                  Share
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}


