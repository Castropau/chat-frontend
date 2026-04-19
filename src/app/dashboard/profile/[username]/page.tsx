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
export const runtime = 'edge';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
// import { FiMessageCircle, FiShare2, FiSmile } from "react-icons/fi";
import { getSocket, initSocket } from "@/utils/webSocket";
import ReactionStats from "../../timeline/_components/reactCount";
import CommentModal from "../../timeline/_components/commentModal";
import ReactionSection from "@/app/components/ReactionSection";
import axios from "axios";
interface Comment {
  id?: number;
  comment: string;
  created_at?: string;
  userId?: number;
  userName?: string;
  userImage?: string;
}
interface Emoji {
  id: number;
  emoji: string;
  label: string;
}

interface Post {
  id: number;
  title: string;
  category_name: string;
  post_image?: string;
  
}

interface Profile {
  profile_image: string;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  private: number;
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
   const [activePostId, setActivePostId] = useState<number | null>(null);
          const [comments, setComments] = useState<Record<number, Comment[]>>({});
      const [showCommentModal, setShowCommentModal] = useState(false);

  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
const [followersCount, setFollowersCount] = useState<number>(0);
const [followingCount, setFollowingCount] = useState<number>(0);
const [isFollowedBy, setIsFollowedBy] = useState(false);

  // 🔥 Load logged-in user from localStorage
useEffect(() => {
  const stored = localStorage.getItem("user");
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);

    // Ensure we get the real logged-in user's ID
    if (parsed.id) {
      setUserId(parsed.id);
    }
  } catch (err) {
    console.error("Error parsing stored user:", err);
  }
}, []);
const [isFollowing, setIsFollowing] = useState(false);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  if (!userId || !profile?.id) return; // ⛔ Prevent running early

  // const fetchStatus = async () => {
  //   try {
  //     const res = await fetch(
  //       `/api/follow?followerId=${userId}&followingId=${profile.id}`
  //     );

  //     const data = await res.json();
  //     setIsFollowing(data.isFollowing);
  //   } catch (err) {
  //     console.error("Follow status error:", err);
  //   }
  // };
// const fetchStatus = async () => {
//   if (!userId || !profile?.id) return; // ⛔ Prevent null crashes

//   try {
//     const res = await axios.get("/api/follow", {
//       params: {
//         followerId: userId,
//         followingId: profile.id,
//       },
//     });

//     setIsFollowing(res.data.isFollowing);
//   } catch (err) {
//     console.error("Follow status error:", err);
//   }
// };
const fetchStatus = async () => {
  if (!userId || !profile?.id) return;

  try {
    const res = await axios.get("/api/follow", {
      params: { followerId: userId, followingId: profile.id },
    });

    setIsFollowing(res.data.isFollowing);
    setIsFollowedBy(res.data.isFollowedBy);  // ⭐ IMPORTANT
  } catch (err) {
    console.error("Follow status error:", err);
  }
};


  fetchStatus();
}, [userId, profile]); // <-- runs only when BOTH are loaded


// const handleFollow = async () => {
//   setIsLoading(true);

//   const res = await fetch("/api/follow", {
//     method: "POST",
//     body: JSON.stringify({
//       followerId: userId,
//       followingId: profile!.id,
//     }),
//   });

//   const data = await res.json();
//   setIsFollowing(data.isFollowing);
//   setIsLoading(false);
// };
// const handleFollow = async () => {
//   setIsLoading(true);

//   const method = isFollowing ? "DELETE" : "POST";

//   const res = await fetch("/api/follow", {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       followerId: userId,
//       followingId: profile!.id,
//     }),
//   });

//   const data = await res.json();
//   setIsFollowing(data.isFollowing);

//   if (!data.isFollowing) {
//     // User unfollowed → delete notification
//     fetch("/api/notify", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: profile!.id,  // the user who was followed
//         notification: { id: `follow_${userId}` }, // your notification id or unique key
//         action: "delete",
//       }),
//     });
//   }

//   setIsLoading(false);
// };
// const handleFollow = async () => {
//   setIsLoading(true);

//   const method = isFollowing ? "DELETE" : "POST";

//   try {
//     const res = await fetch("/api/follow", {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ followerId: userId, followingId: profile!.id }),
//     });

//     if (!res.ok) {
//       console.error("Follow request failed", res.status);
//       setIsLoading(false);
//       return;
//     }

//     const data = await res.json(); // now guaranteed to have JSON
//     setIsFollowing(data.isFollowing);
//   } catch (err) {
//     console.error("Follow/unfollow error:", err);
//   } finally {
//     setIsLoading(false);
//   }
// };
// const handleFollow = async () => {
//   if (!userId || !profile?.id) return;

//   setIsLoading(true);

//   try {
//     const method = isFollowing ? "DELETE" : "POST";

//     const res = await fetch("/api/follow", {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ followerId: userId, followingId: profile.id }),
//     });

//     if (!res.ok) throw new Error("Follow request failed");

//     const data = await res.json();
//     setIsFollowing(data.isFollowing);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setIsLoading(false);
//   }
// };
//  useEffect(() => {
//     if (!userId) return;
//     const socket = initSocket(socketUrl);
//     socket.emit("joinUserRoom", { userId });

//     socket.on("follow:update", ({ followers, following }) => {
//       setFollowersCount(followers);
//       setFollowingCount(following);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [userId]);


  // Handle follow/unfollow
  // const handleFollow = async () => {
  //   if (!userId || !profile?.id) return;

  //   setIsLoading(true);
  //   try {
  //     const method = isFollowing ? "DELETE" : "POST";
  //     const res = await fetch("/api/follow", {
  //       method,
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ followerId: userId, followingId: profile.id }),
  //     });

  //     const data = await res.json();
  //     setIsFollowing(data.isFollowing);

  //     // Emit socket event to update counts in real-time
  //     const socket = initSocket(socketUrl);
  //     socket.emit("follow:change", { userId: profile.id }); // profile followers
  //     socket.emit("follow:change", { userId }); // your following
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
//   useEffect(() => {
//   if (!profile?.id) return;

//   const socket = initSocket(process.env.SOCKET_URL!);

//   // join follow update room
//   socket.emit("joinUserRoom", { userId: profile.id });

//   // 🔥 when someone follows/unfollows this user, refresh counts
//   socket.on("follow:update", async () => {
//     try {
//       const [followersRes, followingRes] = await Promise.all([
//         axios.get("/api/followers", { params: { userId: profile.id } }),
//         axios.get("/api/following", { params: { userId: profile.id } }),
//       ]);

//       setFollowersCount(followersRes.data.count);
//       setFollowingCount(followingRes.data.count);
//     } catch (err) {
//       console.error("Realtime follow count error:", err);
//     }
//   });

//   return () => {
//     socket.off("follow:update");
//   };
// }, [profile?.id]);
// useEffect(() => {
//   if (!profile?.id || !userId) return;

//   const socket = initSocket(process.env.SOCKET_URL!);

//   // join the profile owner's room (so we get counts when others follow them)
//   socket.emit("joinUserRoom", { userId: profile.id });

//   // also join the logged-in user's room so we receive when someone follows *us*
//   socket.emit("joinUserRoom", { userId });

//   // counts update (existing)
//   // socket.on("follow:update", async () => {
//   //   try {
//   //     const [followersRes, followingRes] = await Promise.all([
//   //       axios.get("/api/followers", { params: { userId: profile.id } }),
//   //       axios.get("/api/following", { params: { userId: profile.id } }),
//   //     ]);
//   //     setFollowersCount(followersRes.data.count || 0);
//   //     setFollowingCount(followingRes.data.count || 0);
//   //   } catch (err) {
//   //     console.error("Realtime follow count error:", err);
//   //   }
//   // });
//   socket.on("follow:update", async () => {
//   try {
//     // update counts
//     const [followersRes, followingRes] = await Promise.all([
//       axios.get("/api/followers", { params: { userId: profile.id } }),
//       axios.get("/api/following", { params: { userId: profile.id } }),
//     ]);

//     setFollowersCount(followersRes.data.count);
//     setFollowingCount(followingRes.data.count);

//     // ⭐⭐⭐ Important: Re-check follow / follow-back ⭐⭐⭐
//     const statusRes = await axios.get("/api/follow", {
//       params: {
//         followerId: userId,
//         followingId: profile.id,
//       },
//     });

//     setIsFollowing(statusRes.data.isFollowing);
//     setIsFollowedBy(statusRes.data.isFollowedBy);

//   } catch (e) {
//     console.error("Follow update error:", e);
//   }
// });


//   // NEW: follow status (this updates the follow-back / isFollowing flags)
//   // socket.on("follow:status", async ({ followerId, followingId }: { followerId: number; followingId: number }) => {
//   //   try {
//   //     // if this event is relevant to the profile page, re-check status
//   //     if ((followerId === profile.id && followingId === userId) ||
//   //         (followerId === userId && followingId === profile.id)) {
//   //       const res = await axios.get("/api/follow", {
//   //         params: { followerId: userId, followingId: profile.id },
//   //       });
//   //       setIsFollowing(res.data.isFollowing);
//   //       setIsFollowedBy(res.data.isFollowedBy);
//   //     }

//   //     // optionally refresh counts when status changes
//   //     const [followersRes, followingRes] = await Promise.all([
//   //       axios.get("/api/followers", { params: { userId: profile.id } }),
//   //       axios.get("/api/following", { params: { userId: profile.id } }),
//   //     ]);
//   //     setFollowersCount(followersRes.data.count || 0);
//   //     setFollowingCount(followingRes.data.count || 0);
//   //   } catch (err) {
//   //     console.error("Error handling follow:status:", err);
//   //   }
//   // });
//   socket.on("follow:status", async ({ followerId, followingId }) => {
//   // If this event involves the profile page currently open
//   if (
//     (followerId === profile.id && followingId === userId) ||
//     (followerId === userId && followingId === profile.id)
//   ) {
//     const res = await axios.get("/api/follow", {
//       params: { followerId: userId, followingId: profile.id },
//     });

//     setIsFollowing(res.data.isFollowing);
//     setIsFollowedBy(res.data.isFollowedBy);  // THIS FIXES FOLLOW BACK
//   }
// });


//   return () => {
//     socket.off("follow:update");
//     socket.off("follow:status");
//     socket.disconnect();
//   };
// }, [profile?.id, userId]);
useEffect(() => {
  if (!profile?.id || !userId) return;

  const socket = getSocket(process.env.NEXT_PUBLIC_SOCKET_URL!);

  socket!.emit("joinUserRoom", { userId: profile.id });
  socket!.emit("joinUserRoom", { userId });

  const updateCounts = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        axios.get("/api/followers", { params: { userId: profile.id } }),
        axios.get("/api/following", { params: { userId: profile.id } }),
      ]);
      setFollowersCount(followersRes.data.count);
      setFollowingCount(followingRes.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  socket.on("follow:update", updateCounts);
  socket.on("follow:status", updateCounts); // or update follow flags

  updateCounts(); // initial fetch

  return () => {
    socket.off("follow:update", updateCounts);
    socket.off("follow:status", updateCounts);
    // DO NOT disconnect here; socket is global
  };
}, [profile?.id, userId]);

const handleFollow = async () => {
  if (!userId || !profile?.id) return;

  setIsLoading(true);

  try {
    const method = isFollowing ? "DELETE" : "POST";

    const res = await fetch("/api/follow", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: userId, followingId: profile.id }),
    });

    if (!res.ok) throw new Error("Follow request failed");

    const data = await res.json();
    setIsFollowing(data.isFollowing);

    // 🔥 Notify both users via socket
    const socket = initSocket(process.env.SOCKET_URL!);

    socket.emit("follow:change", { userId: profile.id }); // profile owner
    socket.emit("follow:change", { userId }); // current logged in user
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};



  const handleAddComment = async (postId: number, comment: string) => {
    if (!comment.trim() || !userId) return;

    try {
      await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId, comment }),
      });

      // Don't update local state here
      // setComments(...); <-- remove this
    } catch (err) {
      console.error(err);
    }
  };
   const closeCommentModal = () => {
      setShowCommentModal(false);
      setActivePostId(null);
    };
  useEffect(() => {
                // const socket = initSocket("http://localhost:4000");
                const socket = initSocket(socketUrl!);
          
                if (activePostId) {
                  socket.emit("join", { postId: activePostId });
                }
          
               
          

            interface Comments {
              id?: number; // optional if not always from DB
              comment: string;
              created_at?: string;
              userId?: number;
              userName?: string;
              userImage?: string;
              firstname?: string;
              lastname?: string;
            }
            socket.on("reactions:update", ({ postId, payload }) => {
              if (!payload || !payload.comment) return;
          
              // ✅ Tell TS this object IS a Comment
              const newComment: Comments = {
                // id: payload.id ?? Date.now(),
                comment: payload.comment,
                created_at: payload.created_at ?? new Date().toISOString(),
                userId: payload.userId ?? 0,
                userName: payload.userName ?? "Anonymous",
                userImage: payload.userImage ?? "/default-avatar.png", // ✅ important
              firstname: payload.firstname || "",
              lastname: payload.lastname || "",
          
              };
          
              setComments((prev) => {
                const prevComments = prev[postId] ?? [];
          
                // ✅ Prevent duplicates by checking comment ID or text
                const alreadyExists = prevComments.some(
                  (c) => c.comment === newComment.comment && c.userId === newComment.userId
                );
                if (alreadyExists) return prev;
          
                return {
                  ...prev,
                  [postId]: [...prevComments, newComment], // ✅ pure Comment[]
                };
              });
            });
          
          
              }, [activePostId]);
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        if (!userId) return;
        if (!posts || posts.length === 0) return;

        const reactions = await Promise.all(
          posts.map(async (post) => {
            const res = await fetch(
              `/api/reacts?postId=${post.id}&userId=${userId}`
            );

            if (!res.ok) {
              return { postId: post.id, emojiId: null };
            }

            const data = await res.json();

            return {
              postId: post.id,
              emojiId: data.emojiId ? data.emojiId.toString() : null,
            };
          })
        );

        const mapped = reactions.reduce((acc, r) => {
          acc[r.postId] = r.emojiId;
          return acc;
        }, {} as Record<number, string | null>);

        setSelectedReactions(mapped);
      } catch (err) {
        console.error("Error fetching reactions:", err);
      }
    };

    fetchReactions();
  }, [posts, userId]);

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
  // Fetch followers and following counts
useEffect(() => {
  if (!profile?.id) return;

  const fetchFollowCounts = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        axios.get("/api/followers", { params: { userId: profile.id } }),
        axios.get("/api/following", { params: { userId: profile.id } }),
      ]);

      setFollowersCount(followersRes.data.count || 0);
      setFollowingCount(followingRes.data.count || 0);
    } catch (err) {
      console.error("Error fetching follow counts:", err);
    }
  };

  fetchFollowCounts();
}, [profile?.id]);

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
        // setUserId(profileData.user.id);

        // 2️⃣ Fetch posts/goals
        const goalsRes = await fetch(`/api/goals?user_id=${profileData.user.id}`);
        if (!goalsRes.ok) throw new Error("Failed to fetch goals");
        const goalsData = await goalsRes.json();
        console.log("➡️ Raw /api/goals response:", goalsData);

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
const openCommentModal = async (postId: number) => {
    setActivePostId(postId);
    setShowCommentModal(true);

    try {
      const res = await fetch(`/api/comment?postId=${postId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");

      // Expecting array of objects like { id, comment, created_at, userId, userName }
      const data: Comment[] = await res.json();

      setComments((prev) => ({
        ...prev,
        [postId]: data,
      }));
    } catch (err) {
      console.error(err);
      setComments((prev) => ({ ...prev, [postId]: [] }));
    }
  };
  //  const useCountClock = (value: number, duration = 300) => {
  //   const [display, setDisplay] = useState(value);
  //   const prev = useRef(value);

  //   useEffect(() => {
  //     const start = prev.current;
  //     const end = value;
  //     const diff = end - start;
  //     const startTime = performance.now();

  //     function animate(now: number) {
  //       const progress = Math.min((now - startTime) / duration, 1);
  //       const current = Math.round(start + diff * progress);
  //       setDisplay(current);
  //       if (progress < 1) requestAnimationFrame(animate);
  //     }

  //     requestAnimationFrame(animate);
  //     prev.current = value;
  //   }, [value, duration]);

  //   return display;
  // };

  // 🔥 Animated values
  // const animatedFollowers = useCountClock(followersCount);
  // const animatedFollowing = useCountClock(followingCount);
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
if (profile.private === 1) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
        🔒 This profile is private
      </p>

      <button
        onClick={() => router.push("/dashboard/timeline")}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Return to Timeline
      </button>
    </div>
  );
}

  const initials = `${profile.firstname?.[0] || ""}${profile.lastname?.[0] || ""}`.toUpperCase();

  return (
    <div className="p-6  dark:bg-gray-900 min-h-screen mt-15">
      {/* Profile Header */}
      {/* <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
          {initials}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.firstname} {profile.lastname}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{profile.username}</p>
      </div> */}
      <div className="flex flex-col items-center mb-8">
  {/* Avatar */}
  {/* <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
    {initials}
  </div> */}
  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-md overflow-hidden bg-blue-500 text-white text-3xl font-bold">
  {profile?.profile_image ? (
    <Image
      src={profile.profile_image}
      alt={`${profile.firstname} ${profile.lastname}`}
      className="w-full h-full object-cover"
      width={96}
      height={96}
    />
  ) : (
    <span>{initials}</span>
  )}
</div>


  {/* Name */}
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    {profile.firstname} {profile.lastname}
  </h1>

  {/* Username */}
  <p className="text-gray-600 dark:text-gray-400 mb-4">
    @{profile.username}
  </p>
  <div className="flex gap-4 text-gray-800 dark:text-gray-200 mb-4">
  {/* <div>
    <span className="font-semibold">{followersCount}</span> Followers
  </div>
  <div>
    <span className="font-semibold">{followingCount}</span> Following
  </div> */}
  <div className="flex items-center gap-8 mt-5">

    {/* <div className="flex flex-col items-center">
      <span className="countdown text-2xl font-bold leading-none">
        <span
          style={{ "--value": followersCount } as React.CSSProperties}
          aria-label={String(followersCount)}
        />
      </span>
      <span className="text-sm text-neutral-600">Followers</span>
    </div>

    <div className="flex flex-col items-center">
      <span className="countdown text-2xl font-bold leading-none">
        <span
          style={{ "--value": followingCount } as React.CSSProperties}
          aria-label={String(followingCount)}
        />
      </span>
      <span className="text-sm text-neutral-600">Following</span>
    </div> */}
    <div className="flex items-center gap-8 mt-5">
      {/* Followers */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => router.push(`/dashboard/profile/${profile.username}/followers`)}
      >
        <span className="text-2xl font-bold leading-none" aria-label={String(followersCount)}>
          {followersCount}
        </span>
        <span className="text-sm text-neutral-600">Followers</span>
      </div>

      {/* Following */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => router.push(`/dashboard/profile/${profile.username}/following`)}
      >
        <span className="text-2xl font-bold leading-none" aria-label={String(followingCount)}>
          {followingCount}
        </span>
        <span className="text-sm text-neutral-600">Following</span>
      </div>
    </div>
{/* <div className="flex items-center gap-8 mt-5">
  <div
    className="flex flex-col items-center cursor-pointer"
    onClick={() => router.push(`/dashboard/profile/${profile.username}/followers`)}
  >
    <span className="countdown text-2xl font-bold leading-none">
      <span
        style={{ "--value": followersCount } as React.CSSProperties}
        aria-label={String(followersCount)}
      />
    </span>
    <span className="text-sm text-neutral-600">Followers</span>
  </div>

  <div
    className="flex flex-col items-center cursor-pointer"
    onClick={() => router.push(`/dashboard/profile/${profile.username}/following`)}
  >
    <span className="countdown text-2xl font-bold leading-none">
      <span
        style={{ "--value": followingCount } as React.CSSProperties}
        aria-label={String(followingCount)}
      />
    </span>
    <span className="text-sm text-neutral-600">Following</span>
  </div>
</div> */}

</div>


</div>

  {/* Follow Button */}
  {/* <button
    onClick={handleFollow}
    disabled={isLoading}
    className={`px-6 py-2 rounded-full text-sm font-semibold transition shadow 
      ${isFollowing 
        ? "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-400" 
        : "bg-blue-600 text-white hover:bg-blue-700"}
      disabled:opacity-50`}
  >
    {isLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
  </button> */}
  <button
  onClick={handleFollow}
  disabled={isLoading}
  className={`px-6 py-2 rounded-full text-sm font-semibold transition shadow 
      ${isFollowing 
        ? "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-400" 
        : "bg-blue-600 text-white hover:bg-blue-700"}
      disabled:opacity-50`}
>
  {isLoading
    ? "..."
    : isFollowing
      ? "Unfollow"
      : isFollowedBy
        ? "Follow Back"
        : "Follow"}
</button>

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
                    Goal: {post.category_name}
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
               <div className="flex space-x-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <ReactionStats postId={post.id} />
                          </div>
              {/* <div className="flex space-x-8 border-t pt-4 dark:border-gray-700">
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
              </div> */}
              {/* <div className="flex space-x-8 border-t pt-4 dark:border-gray-700">
  <div className="relative flex items-center gap-2">
    {selectedReactions[post.id] && (
      <span className="text-2xl dark:text-gray-100">
        {(() => {
          const found = emojis.find((e) => e.id === Number(selectedReactions[post.id]));
          return found ? found.emoji : selectedReactions[post.id];
        })()}
      </span>
    )}

    <button
      onClick={() =>
        setReactionPickerPostId(reactionPickerPostId === post.id ? null : post.id)
      }
      className="flex items-center gap-2 text-yellow-600 font-semibold hover:underline focus:outline-none dark:text-yellow-400"
      title={selectedReactions[post.id] ? "Remove your reaction" : "React"}
    >
      <FiSmile className="text-xl" />
      <span>React</span>
    </button>

    {reactionPickerPostId === post.id && (
      <div className="absolute top-full mt-2 left-0 z-10 flex space-x-4 bg-white p-3 rounded shadow-md border dark:bg-gray-700 dark:border-gray-600">
        {emojis.map((r) => {
          const isSelected = selectedReactions[post.id]?.toString() === r.id.toString();
          return (
            <button
              key={r.id}
              onClick={() => handleReaction(post.id, r.id.toString())}
              title={r.label}
              className={`flex flex-col items-center px-2 py-1 rounded transition-transform hover:cursor-pointer hover:scale-110 ${
                isSelected ? "bg-gray-300 font-bold dark:bg-gray-600" : "bg-transparent"
              }`}
            >
              <span className="text-2xl">{r.emoji}</span>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{r.label}</span>
            </button>
          );
        })}
      </div>
    )}
  </div>

  <button
    onClick={() => openCommentModal(post.id)}

    className="flex items-center gap-2 text-blue-600 font-semibold hover:underline dark:text-blue-400"
  >
    <FiMessageCircle className="text-xl" /> Comment
  </button>

  <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline dark:text-green-400">
    <FiShare2 className="text-xl" /> Share
  </button>
</div> */}
 <ReactionSection
    post={post}
    emojis={emojis}
    selectedReactions={selectedReactions}
    reactionPickerPostId={reactionPickerPostId}
    setReactionPickerPostId={setReactionPickerPostId}
    handleReaction={handleReaction}
    openCommentModal={openCommentModal}
  />

            </article>
          ))
        )}
      </div>
       {showCommentModal && activePostId && (
            <CommentModal
              postId={activePostId}
              onAddComment={handleAddComment}
              comments={comments[activePostId] || []}
              onClose={closeCommentModal}
            />
          )}
    </div>
  );
}


