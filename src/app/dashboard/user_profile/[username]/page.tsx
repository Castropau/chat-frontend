// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import Image from "next/image";
// import { FiSmile, FiMessageCircle, FiShare2 } from "react-icons/fi";

// export default function UserProfilePage() {
//   const params = useParams();
//   const { username } = params;
//   const router = useRouter();

//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());


 
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`/api/user_profile/${username}`);
//         setUser(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (username) fetchUser();
//   }, [username]);

//   const toggleExpand = (postId: number) => {
//     setExpandedPosts((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(postId)) newSet.delete(postId);
//       else newSet.add(postId);
//       return newSet;
//     });
//   };

//   const handleEditGoal = (goalId: number) => {
//     router.push(`/dashboard/edit_goal/${goalId}`);
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-600">Loading...</p>
//       </div>
//     );

//   if (!user)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-red-500">User not found</p>
//       </div>
//     );

//   const initials = `${user.firstname?.[0] || "U"}${user.lastname?.[0] || ""}`;
//   const posts = user.goals || [];

//   return (
//     <div className="p-6 max-w-3xl mx-auto dark:bg-gray-900 min-h-screen">
//       {/* Profile Header */}
//       <div className="flex flex-col items-center mb-8">
//         <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
//           {initials}
//         </div>
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//           {user.firstname} {user.lastname}
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">{user.email}</p>

//         {/* Edit Profile Button */}
//         <button
//           onClick={() => router.push("/dashboard/edit-profile")}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
//         >
//           Edit Profile
//         </button>
//       </div>

//       {/* Goals / Posts Timeline */}
//       <div>
//         {posts.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10 dark:text-gray-300">
//             No goals posted yet.
//           </p>
//         ) : (
//           posts.map((post: any) => (
//             <article
//               key={post.id}
//               className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold">
//                     {initials}
//                   </div>
//                   <div>
//                     <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
//                       {user.firstname} {user.lastname}
//                     </h2>
//                     <p className="text-sm text-blue-600 dark:text-blue-400">
//                       Goal: {post.category}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleEditGoal(post.id)}
//                   className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition"
//                 >
//                   Edit
//                 </button>
//               </div>

//               {/* Post Text */}
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
//                   className="text-blue-500 hover:underline font-medium mb-2"
//                 >
//                   {expandedPosts.has(post.id) ? "Less view" : "View more"}
//                 </button>
//               )}

//               {/* Post Media */}
//               {post.post_image && (
//                 <Image
//                   src={post.post_image}
//                   alt="Goal Image"
//                   width={500}
//                   height={300}
//                   className="w-full rounded-lg mb-4 shadow-sm object-cover max-h-60"
//                 />
//               )}

//               {/* Reactions / Comments / Share */}
//               <div className="flex space-x-8 border-t pt-4 dark:border-gray-700">
//                 <button className="flex items-center gap-2 text-yellow-600 font-semibold hover:underline dark:text-yellow-400">
//                   <FiSmile className="text-xl" /> React
//                 </button>
//                 <button className="flex items-center gap-2 text-blue-600 font-semibold hover:underline dark:text-blue-400">
//                   <FiMessageCircle className="text-xl" /> Comment
//                 </button>
//                 <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline dark:text-green-400">
//                   <FiShare2 className="text-xl" /> Share
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
import axios from "axios";
import Image from "next/image";
import { FiSmile, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { useSession } from "next-auth/react";
import CommentModal from "../../timeline/_components/commentModal";
import { initSocket } from "@/utils/webSocket";
import ReactionStats from "../../timeline/_components/reactCount";
interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  image?: string | null;
  goals: PostItem[];
}

interface PostItem {
  id: number;
  title: string;
  category: string;
  post_image?: string | null;
}
 interface Comment {
  id?: number;
  comment: string;
  created_at?: string;
  userId?: number;
  userName?: string;
  userImage?: string;
}

  type Post = {
    user_image: string;
    id: number;
    name: string;
    goal: string;
    category: string;
    text: string;
    image?: string;
    video?: string;
    user_name: string;
    title: string;
    category_names: string;
    user_firstname: string;
    user_id: number | string;
    user_lastname: string;
    post_image: string;
  };

export default function UserProfilePage() {
  const params = useParams();
  const { username } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [user, setUser] = useState<UserProfile | null >(null);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
   const [activePostId, setActivePostId] = useState<number | null>(null);
   
      const [showCommentModal, setShowCommentModal] = useState(false);
          const [comments, setComments] = useState<Record<number, Comment[]>>({});
              const [userId, setUserId] = useState<number | null>(null);
                  const [selectedReactions, setSelectedReactions] = useState<Record<number, string | null>>({});
                  const [reactionPickerPostId, setReactionPickerPostId] = useState<number | null>(null);
                  const [emojis, setEmojis] = useState<{ id: number; emoji: string; label: string }[]>([]);
                         const [posts, setPosts] = useState<Post[]>([]);  // Holds the fetched posts
useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await fetch("/api/goal"); // Replace with your backend endpoint
          const data = await response.json();
          setPosts(data); // Assuming the response is an array of posts
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPosts();
    }, []);

    const handleReaction = async (postId: number, emojiId: string) => {
        setSelectedReactions((prev) => {
          const current = prev[postId];
          const newReaction = current === emojiId ? null : emojiId;
          return { ...prev, [postId]: newReaction };
        });
    
        try {
          if (!userId) {
            console.error("User not found.");
            return;
          }
    
          const method = selectedReactions[postId] === emojiId ? "DELETE" : "POST";
          const response = await fetch("/api/reacts", {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postId,
              emojiId, // ✅ FIXED HERE
              userId,
            }),
          });
    
          if (!response.ok) {
            console.error("Failed to save or delete reaction");
          }
        } catch (error) {
          console.error("Error saving or deleting reaction:", error);
        }
    
        setReactionPickerPostId(null);
      };
    
    
      useEffect(() => {
        const fetchReactions = async () => {
          try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (!user?.id) return;
    
            const reactionsPromises = posts.map(async (post) => {
              if (!post.id) return { postId: post.id, emojiId: null };
    
              const res = await fetch(`/api/reacts?postId=${post.id}&userId=${user.id}`);
              if (!res.ok) return { postId: post.id, emojiId: null };
    
              const data = await res.json();
              // ✅ Ensure we get emojiId from backend
              return { postId: post.id, emojiId: data.emojiId?.toString() || null };
            });
    
            const reactionsData = await Promise.all(reactionsPromises);
    
            const map = reactionsData.reduce(
              (acc: Record<number, string | null>, { postId, emojiId }) => {
                acc[postId] = emojiId;
                return acc;
              },
              {}
            );
    
            setSelectedReactions(map);
          } catch (err) {
            console.error("Error fetching user reactions:", err);
          }
        };
    
        if (posts.length > 0) fetchReactions();
      }, [posts]);
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
              useEffect(() => {
                  const fetchReactions = async () => {
                    try {
                      const user = JSON.parse(localStorage.getItem("user") || "{}");
                      if (!user?.id) return;
              
                      const reactionsPromises = posts.map(async (post) => {
                        if (!post.id) return { postId: post.id, emojiId: null };
              
                        const res = await fetch(`/api/reacts?postId=${post.id}&userId=${user.id}`);
                        if (!res.ok) return { postId: post.id, emojiId: null };
              
                        const data = await res.json();
                        // ✅ Ensure we get emojiId from backend
                        return { postId: post.id, emojiId: data.emojiId?.toString() || null };
                      });
              
                      const reactionsData = await Promise.all(reactionsPromises);
              
                      const map = reactionsData.reduce(
                        (acc: Record<number, string | null>, { postId, emojiId }) => {
                          acc[postId] = emojiId;
                          return acc;
                        },
                        {}
                      );
              
                      setSelectedReactions(map);
                    } catch (err) {
                      console.error("Error fetching user reactions:", err);
                    }
                  };
              
                  if (posts.length > 0) fetchReactions();
                }, [posts]);


const socketUrl = process.env.SOCKET_URL;

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
            // On component mount, check for user information in localStorage
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user?.id) {
              setUserId(user.id); // Set userId if present in localStorage
            }
          }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Wait until session is loaded
        if (status === "loading") return;

        // Redirect if username does not match session
        if (session?.user?.username && username !== session.user.username) {
          router.replace(`/dashboard/user_profile/${session.user.username}`);
          return;
        }

        const res = await axios.get<UserProfile>(`/api/user_profile/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUser();
  }, [username, session, status, router]);

  const toggleExpand = (postId: number) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
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
  const handleEditGoal = (goalId: number) => {
    router.push(`/dashboard/edit_goal/${goalId}`);
  };
  const closeCommentModal = () => {
      setShowCommentModal(false);
      setActivePostId(null);
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
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );

   if (!user) return null;



     


      

  const initials = `${user.firstname?.[0] || "U"}${user.lastname?.[0] || ""}`;
  // const posts = user.goals || [];

  return (
  <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
    {/* Profile Header */}
    <div className="flex flex-col items-center py-8 px-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
        {initials}
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {user.firstname} {user.lastname}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">{user.email}</p>

      {/* Edit Profile Button */}
      <button
        onClick={() => router.push("/dashboard/edit_profile")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Edit Profile
      </button>
    </div>

    {/* Goals / Posts Timeline */}
    <div className="flex-1 overflow-y-auto py-4 px-4 bg-gray-50 dark:bg-gray-900">
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold">
                  {initials}
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {user.firstname} {user.lastname}
                  </h2>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Goal: {post.category_names}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEditGoal(post.id)}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition"
              >
                Edit
              </button>
            </div>

            {/* Post Text */}
            <p
              className={`text-gray-800 mb-4 leading-relaxed dark:text-gray-300 break-words ${
                expandedPosts.has(post.id)
                  ? "max-h-full"
                  : "line-clamp-3 overflow-hidden"
              }`}
            >
              {post.title}
            </p>

            {post.title?.length > 120 && (
              <button
                onClick={() => toggleExpand(post.id)}
                className="text-blue-500 hover:underline font-medium mb-2"
              >
                {expandedPosts.has(post.id) ? "Less view" : "View more"}
              </button>
            )}

            {/* Post Media */}
            {post.post_image && (
              <Image
                src={post.post_image}
                alt="Goal Image"
                width={500}
                height={300}
                className="w-full rounded-lg mb-4 shadow-sm object-cover max-h-60"
              />
            )}

            {/* Reactions / Comments / Share */}
            <div className="flex space-x-6 border-t border-gray-200 pt-4 dark:border-gray-700">
              <ReactionStats postId={post.id} />
            </div>
            <div className="flex space-x-8 border-t pt-4 dark:border-gray-700">
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

              <button
                onClick={() => openCommentModal(post.id)}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline dark:text-blue-400"
              >
                <FiMessageCircle className="text-xl" /> Comment
              </button>
              <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline dark:text-green-400">
                <FiShare2 className="text-xl" /> Share
              </button>
            </div>
          </article>
        ))
      )}
    </div>

    {/* Comment Modal */}
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


