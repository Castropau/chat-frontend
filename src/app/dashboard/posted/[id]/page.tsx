// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Image from "next/image";
// interface Goal {
//   id: number;
//   title: string;
//   category_name: string;
//   duration: string;
//   privacy: string;
//   post_image?: string | null;
//   profile_image?: string | null;
//   firstname: string;
//   lastname: string;
//   username: string;
//   reactionCount: number;
//   commentCount: number;
// }

// export default function GoalPage({ params }: { params: { id: string } }) {
//   const { id } = params; // ✅ just get it directly

//   const [goal, setGoal] = useState<Goal | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGoal = async () => {
//       try {
//         const res = await axios.get(`/api/posted/${id}`);
//         setGoal(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGoal();
//   }, [id]);

//   if (loading) return <p className="p-4">Loading...</p>;
//   if (!goal) return <p className="p-4">Goal not found</p>;

//   return (
//     <div className="min-h-screen dark:bg-gray-900 dark:text-gray-100 p-4">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <Image
//               src={goal.profile_image || "/default-avatar.png"}
//               className="w-10 h-10 rounded-full border border-gray-700"
//               alt="Profile"
//             />
//             <div>
//               <p className="font-semibold">{goal.firstname} {goal.lastname}</p>
//               <p className="text-sm text-gray-400">@{goal.username}</p>
//             </div>
//           </div>
//           {/* Category and Duration on top-right */}
//           <div className="text-right text-gray-300">
//             <p>{goal.category_name}</p>
//             <p>{goal.duration}</p>
//           </div>
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-bold mb-2">{goal.title}</h1>

//         {/* Image (optional) */}
//         {goal.post_image && (
//           <Image
//             src={goal.post_image}
//             className="rounded-lg w-full mb-4 border border-gray-700"
//             alt="Goal"
//             width={500}    // provide width & height
//             height={300}   // adjust as needed
//           />
//         )}

//         {/* Privacy */}
//         <div className="text-gray-300 mb-3">
//           <p>Privacy: {goal.privacy}</p>
//         </div>

//         {/* Counters */}
//         <div className="flex gap-6 text-gray-300 font-medium mt-2">
//           <p>👍 {goal.reactionCount} reactions</p>
//           <p>💬 {goal.commentCount} comments</p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
export const runtime = 'edge';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import ReactionStats from "../../timeline/_components/reactCount";
// import { FiMessageCircle, FiShare2, FiSmile } from "react-icons/fi";
import CommentModal from "../../timeline/_components/commentModal";
import { initSocket } from "@/utils/webSocket";
import PostActions from "@/app/components/ReactionBar";

// ----- Types -----
interface Goal {
  id: number;
  title: string;
  category_name: string;
  duration: string;
  privacy: string;
  post_image?: string | null;
  profile_image?: string | null;
  firstname: string;
  lastname: string;
  username: string;
  reactionCount: number;
  commentCount: number;
}

interface ApiError {
  error: string;
}
 interface Comment {
  id?: number;
  comment: string;
  created_at?: string;
  userId?: number;
  userName?: string;
  userImage?: string;
}

// ----- Component -----
export default function GoalPage() {
  const params = useParams();        // ✅ Get params from hook
  const id = params?.id as string;   // TypeScript cast
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReactions, setSelectedReactions] = useState<Record<number, string | null>>({});
  const [reactionPickerPostId, setReactionPickerPostId] = useState<number | null>(null);
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; label: string }[]>([]);
     const [activePostId, setActivePostId] = useState<number | null>(null);
               const [comments, setComments] = useState<Record<number, Comment[]>>({});
                const [userId, setUserId] = useState<number | null>(null);

     
      const [showCommentModal, setShowCommentModal] = useState(false);
          useEffect(() => {
                      // const socket = initSocket("http://localhost:4000");
                      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
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
                      firstname: payload.firstname ?? "User",
                      lastname: payload.lastname ?? "",
                
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
                 const closeCommentModal = () => {
      setShowCommentModal(false);
      setActivePostId(null);
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
  useEffect(() => {
    if (!id) return;

    const fetchGoal = async () => {
      try {
        const res = await axios.get<Goal>(`/api/posted/${id}`);
        setGoal(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as ApiError;
          setError(data?.error || "Failed to fetch the goal data");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);
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
      //   useEffect(() => {
      //   const fetchReactions = async () => {
      //     try {
      //       const user = JSON.parse(localStorage.getItem("user") || "{}");
      //       if (!user?.id) return;
    
      //       const reactionsPromises = posts.map(async (post) => {
      //         if (!post.id) return { postId: post.id, emojiId: null };
    
      //         const res = await fetch(`/api/reacts?postId=${post.id}&userId=${user.id}`);
      //         if (!res.ok) return { postId: post.id, emojiId: null };
    
      //         const data = await res.json();
      //         // ✅ Ensure we get emojiId from backend
      //         return { postId: post.id, emojiId: data.emojiId?.toString() || null };
      //       });
    
      //       const reactionsData = await Promise.all(reactionsPromises);
    
      //       const map = reactionsData.reduce(
      //         (acc: Record<number, string | null>, { postId, emojiId }) => {
      //           acc[postId] = emojiId;
      //           return acc;
      //         },
      //         {}
      //       );
    
      //       setSelectedReactions(map);
      //     } catch (err) {
      //       console.error("Error fetching user reactions:", err);
      //     }
      //   };
    
      //   if (posts.length > 0) fetchReactions();
      // }, [posts]);
      useEffect(() => {
  const fetchReactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id || !goal?.id) return;

      const res = await fetch(`/api/reacts?postId=${goal.id}&userId=${user.id}`);
      if (!res.ok) {
        setSelectedReactions({ [goal.id]: null });
        return;
      }

      const data = await res.json();

      // Save selected emoji for this goal
      setSelectedReactions({
        [goal.id]: data.emojiId ? data.emojiId.toString() : null,
      });
    } catch (err) {
      console.error("Error fetching reactions:", err);
      setSelectedReactions({ [goal?.id || 0]: null });
    }
  };

  if (goal) fetchReactions();
}, [goal]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!goal) return <p className="p-4">Goal not found</p>;

  return (
<div className="min-h-screen dark:bg-gray-900 dark:text-gray-100 pt-25 "> 
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {/* <div className="flex items-center gap-3">
            <Image
              src={goal.profile_image || "/default-avatar.png"}
              alt={`${goal.firstname} ${goal.lastname}`}
              className="w-10 h-10 rounded-full border border-gray-700"
              width={40}
              height={40}
            />
            <div>
              <p className="font-semibold">
                {goal.firstname} {goal.lastname}
              </p>
              <p className="text-sm text-gray-400">@{goal.username}</p>
            </div>
          </div> */}
          <div className="flex items-center gap-3">
  {goal.profile_image && goal.profile_image.trim() !== "" ? (
    <Image
      src={goal.profile_image}
      alt={`${goal.firstname} ${goal.lastname}`}
      className="w-10 h-10 rounded-full border border-gray-700"
      width={40}
      height={40}
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold border border-gray-700">
      {(goal.firstname?.[0] || "U").toUpperCase()}
      {(goal.lastname?.[0] || "").toUpperCase()}
    </div>
  )}
  <div>
    <p className="font-semibold">
      {goal.firstname} {goal.lastname}
    </p>
    <p className="text-sm text-gray-400">@{goal.username}</p>
  </div>
</div>

          {/* Category and Duration */}
          <div className="text-right text-gray-300">
            <p>{goal.category_name}</p>
            <p>{goal.duration}</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">{goal.title}</h1>

        {/* Image */}
        {goal.post_image && (
          <Image
            src={goal.post_image}
            alt={goal.title || "Goal image"}
            className="rounded-lg w-full mb-4 border border-gray-700"
            width={500}
            height={300}
          />
        )}

        {/* Privacy */}
        <div className="text-gray-300 mb-3">
          <p>Privacy: {goal.privacy}</p>
        </div>

        {/* Counters */}
        {/* <div className="flex gap-6 text-gray-300 font-medium mt-2">
          <p>👍 {goal.reactionCount} reactions</p>
          <p>💬 {goal.commentCount} comments</p>
        </div> */}
         <div className="flex space-x-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <ReactionStats postId={goal.id} />
                    </div>
                    {/* <div className="flex space-x-8 border-t pt-4 dark:border-gray-700">
                      {selectedReactions[goal.id] && (
                        <span className="text-2xl dark:text-gray-100">
                          {(() => {
                            const found = emojis.find((e) => e.id === Number(selectedReactions[goal.id]));
                            return found ? found.emoji : selectedReactions[goal.id];
                          })()}
                        </span>
                      )}
        
                      <button
                        onClick={() =>
                          setReactionPickerPostId(reactionPickerPostId === goal.id ? null : goal.id)
                        }
                        className="flex items-center gap-2 text-yellow-600 font-semibold hover:underline focus:outline-none dark:text-yellow-400"
                        title={selectedReactions[goal.id] ? "Remove your reaction" : "React"}
                      >
                        <FiSmile className="text-xl" />
                        <span>React</span>
                      </button>
        
                      {reactionPickerPostId === goal.id && (
                        <div className="absolute top-full mt-2  z-10 flex space-x-4 bg-white p-3 rounded shadow-md border dark:bg-gray-700 dark:border-gray-600">
                          {emojis.map((r) => {
                            const isSelected = selectedReactions[goal.id]?.toString() === r.id.toString();
                            return (
                              <button
                                key={r.id}
                                onClick={() => handleReaction(goal.id, r.id.toString())}
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
                        onClick={() => openCommentModal(goal.id)}
                        className="flex items-center gap-2 text-blue-600 font-semibold hover:underline dark:text-blue-400"
                      >
                        <FiMessageCircle className="text-xl" /> Comment
                      </button>
                      <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline dark:text-green-400">
                        <FiShare2 className="text-xl" /> Share
                      </button>
                    </div> */}
                    <PostActions
  postId={goal.id}
  emojis={emojis}
  selectedReaction={selectedReactions[goal.id] || null}
  setReactionPickerPostId={setReactionPickerPostId}
  reactionPickerPostId={reactionPickerPostId}
  handleReaction={handleReaction}
  openCommentModal={openCommentModal}
/>
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
