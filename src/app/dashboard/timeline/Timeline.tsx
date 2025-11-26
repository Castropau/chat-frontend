  "use client";
  import React, { useState, useEffect } from "react";
  import FilterBar from "./FilterBar"; // your multi-select version
  import { FiMessageCircle, FiShare2, FiSmile } from "react-icons/fi";
  import CreateGoal from "./CreateGoal";
  import Image from "next/image";
  import ReactionStats from "./_components/reactCount";
  import CommentModal from "./_components/commentModal";
  import { initSocket } from "@/utils/webSocket";
import Link from "next/link";

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
  type Category = {
    id: number;
    name: string;
  };
  // interface Comments {
  //   id?: number; // optional if not always from DB
  //   comment: string;
  //   created_at?: string;
  //   userId?: number;
  //   userName?: string;
  // }
  interface Comment {
  id?: number;
  comment: string;
  created_at?: string;
  userId?: number;
  userName?: string;
  userImage?: string;
}

  interface BackendCategory {
  category_name: string;
  id?: number; // optional if your backend sends it
}

  const Timeline: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
    // const [commentOpenFor, setCommentOpenFor] = useState<number | null>(null);
     const [commentOpenFor] = useState<number | null>(null);
    // const [comments, setComments] = useState<Record<number, string[]>>({});
    // const [comments, setComments] = useState<Record<number, Comments[]>>({});
    const [comments, setComments] = useState<Record<number, Comment[]>>({});


    const [posts, setPosts] = useState<Post[]>([]);  // Holds the fetched posts
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [categories, setCategories] = useState<Category[]>([]); // Holds the fetched categories
    const [userId, setUserId] = useState<number | null>(null);
  const [activePostId, setActivePostId] = useState<number | null>(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
  // const [commentInput, setCommentInput] = useState("");

const socketUrl = process.env.SOCKET_URL;

    useEffect(() => {
      // const socket = initSocket("http://localhost:4000");
      const socket = initSocket(socketUrl!);

      if (activePostId) {
        socket.emit("join", { postId: activePostId });
      }

      // socket.on("reactions:update", ({ postId, payload }: any) => {
      //   if (!payload.comment) return;
      //   setComments((prev) => {
      //     const prevComments = prev[postId] || [];
      //     return { ...prev, [postId]: [...prevComments, payload] };
      //   });
      // });
  //     socket.on("reactions:update", ({ postId, payload }: any) => {
  //   if (!payload.comment) return;
  //   setComments((prev) => {
  //     const prevComments = prev[postId] || [];
  //     return { ...prev, [postId]: [...prevComments, payload.comment] }; // only text
  //   });
  // });
  // socket.on("reactions:update", ({ postId, payload }: any) => {
  //   if (!payload.comment) return;

  //   setComments((prev) => {
  //     const prevComments = prev[postId] || [];

  //     // Avoid duplicates
  //     if (prevComments.includes(payload.comment)) return prev;
  //     return { ...prev, [postId]: [...prevComments, payload.comment] };
  //   });
  // });
  // socket.on("reactions:update", ({ postId, payload }) => {
  //   setComments((prev) => {
  //     const prevComments = prev[postId] || [];
  //     if (prevComments.includes(payload.comment)) return prev; // duplicate check
  //     return { ...prev, [postId]: [...prevComments, payload.comment] }; // second addition
  //   });
  // });
  // socket.on("reactions:update", ({ postId, payload }) => {
  //   setComments((prev) => {
  //     const prevComments = prev[postId] || [];
  //     if (prevComments.includes(payload.comment)) return prev;
  //     return { ...prev, [postId]: [...prevComments, payload.comment] };
  //   });
  // });
  // socket.on("reactions:update", ({ postId, payload }) => {
  //   // ✅ Ignore any reaction updates that aren't actual comments
  //   if (!payload || !payload.comment || typeof payload.comment !== "string") return;

  //   setComments((prev) => {
  //     const prevComments = prev[postId] || [];

  //     // ✅ Prevent duplicates
  //     if (prevComments.includes(payload.comment)) return prev;

  //     return { ...prev, [postId]: [...prevComments, payload.comment] };
  //   });
  // }

  // );











  // socket.on("reactions:update", ({ postId, payload }) => {
  //   if (!payload || !payload.comment) return;

  //   // ✅ Normalize payload into an object
  //   const newComment = {
  //     id: payload.id || Date.now(), // fallback ID
  //     comment: payload.comment,
  //     created_at: payload.created_at || new Date().toISOString(),
  //     userId: payload.userId,
  //     userName: payload.userName || "Anonymous",
  //   };

  //   setComments((prev) => {
  //     const prevComments = prev[postId] || [];

  //     // ✅ Prevent duplicates by checking comment ID or text
  //     const alreadyExists = prevComments.some(
  //       (c) => c.comment === newComment.comment && c.userId === newComment.userId
  //     );
  //     if (alreadyExists) return prev;

  //     return { ...prev, [postId]: [...prevComments, newComment] };
  //   });
  // });
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
    // Fetch posts from backend
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

    const filteredPosts = selectedCategories.includes("All")
      ? posts
      : posts.filter((post) => selectedCategories.includes(post.category_names));


    // const handleAddComment = (postId: number, comment: string) => {
    //   if (!comment.trim()) return;
    //   setComments((prev) => {
    //     const prevComments = prev[postId] || [];
    //     return { ...prev, [postId]: [...prevComments, comment.trim()] };
    //   });
    // };
  //   const handleAddComment = async (postId: number, comment: string) => {
  //   if (!comment.trim() || !userId) return;

  //   try {
  //     // Send POST to API
  //     const res = await fetch("/api/comment", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ postId, userId, comment }),
  //     });

  //     if (!res.ok) throw new Error("Failed to add comment");

  //     const data = await res.json();

  //     // Update local state with new comment
  //     // setComments((prev) => {
  //     //   const prevComments = prev[postId] || [];
  //     //   return { ...prev, [postId]: [...prevComments, comment] };
  //     // });
  //     setComments((prev) => {
  //   const prevComments = prev[postId] || [];
  //   return { ...prev, [postId]: [...prevComments, comment] }; // first addition
  // });

  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
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

  // Timeline
  // const handleAddComment = async (postId: number, comment: string) => {
  //   if (!comment.trim()) return;

  //   await fetch("/api/comment", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ postId, comment }),
  //   });

  //   // Do NOT update local state here — wait for Socket broadcast
  // };


    const handleShare = (post: Post) => {
      alert(`Shared post by ${post.name} about "${post.goal}"!`);
    };

    const [reactionPickerPostId, setReactionPickerPostId] = useState<number | null>(null);
    const [selectedReactions, setSelectedReactions] = useState<Record<number, string | null>>({});
    const [emojis, setEmojis] = useState<{ id: number; emoji: string; label: string }[]>([]);

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

    // const handleReaction = (postId: number, emoji: string) => {
    //   setSelectedReactions((prev) => {
    //     const current = prev[postId];
    //     const newReaction = current === emoji ? null : emoji;
    //     return { ...prev, [postId]: newReaction };
    //   });
    //   setReactionPickerPostId(null); // close picker
    // };
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




  // const openCommentModal = async (postId: number) => {
  //   setActivePostId(postId);
  //   setShowCommentModal(true);

  //   try {
  //     const res = await fetch(`/api/comment?postId=${postId}`);
  //     if (!res.ok) throw new Error("Failed to fetch comments");

  //     const data: { comment: string }[] = await res.json();

  //     setComments((prev) => ({
  //       ...prev,
  //       [postId]: data.map((c) => c.comment),
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //     setComments((prev) => ({ ...prev, [postId]: [] }));
  //   }
  // };
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


  //  const openCommentModal = (postId: number) => {
  //     setActivePostId(postId);
  //     setShowCommentModal(true);
  //   };
    const closeCommentModal = () => {
      setShowCommentModal(false);
      setActivePostId(null);
    };

    // const mockFollowers = [
    //   { id: 1, name: "Anna Lee", online: true },
    //   { id: 2, name: "John Smith", online: false },
    //   { id: 3, name: "Michael Jordan", online: true },
    //   { id: 4, name: "Sarah Park", online: true },
    // ];
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch("/api/categories");
  //       const data = await response.json();

  //       // 👇 Use the correct field name
  //       if (Array.isArray(data)) {
  //         // if backend returns [{ category_name: "..." }]
  //         if (typeof data[0] === "object" && data[0]?.category_name) {
  //           setCategories(data.map((c: any) => c.category_name));
  //         } else {
  //           // if backend returns ["Sports", "Music", ...]
  //           setCategories(data);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };

  //   fetchCategories();
  // }, []);
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        if (typeof data[0] === "object" && data[0] !== null && "category_name" in data[0]) {
          // backend returns objects
          const mapped: Category[] = (data as BackendCategory[]).map(c => ({
            name: c.category_name,
            id: c.id ?? 0,
          }));
          setCategories(mapped);
        } else if (typeof data[0] === "string") {
          // backend returns array of strings
          // const mapped: Category[] = (data as string[]).map(c => ({ name: c }));
          // setCategories(mapped);
          const mapped: Category[] = (data as string[]).map((c, index) => ({
  name: c,
  id: index, // assign a unique id for each category
}));
setCategories(mapped);

        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, []);

  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  const toggleExpand = (postId: number) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  // const maxLength = 50;


    return (
      <div className="min-h-screen flex dark:bg-gray-900">
    
        <div className="fixed left-0 top-19 h-full w-1/4 bg-gray-100 p-6 overflow-y-auto shadow-lg dark:bg-gray-800">
    <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-gray-100">Settings</h3>
    <div className="space-y-4">
      <button className="block w-full text-left bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500">
        Change Theme
      </button>
      <button className="block w-full text-left bg-green-500 text-white p-3 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500">
        Manage Notifications
      </button>
      <button className="block w-full text-left bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500">
        Update Profile
      </button>
    </div>
  </div>


      
        <div className="flex-1 p-6 max-w-xl mx-auto pt-16 mt-10">
    <FilterBar
      // categories={categories}
        categories={categories.map(c => c.name)}

      selected={selectedCategories}
      onSelect={setSelectedCategories}
    />
    <CreateGoal />

    {loading ? (
      <p className="text-center text-gray-500 mt-20 text-lg font-light dark:text-gray-300">
        Loading...
      </p>
    ) : filteredPosts.length === 0 ? (
      <p className="text-center text-gray-500 mt-20 text-lg font-light dark:text-gray-300">
        No posts found for selected.
      </p>
    ) : (
      Array.isArray(filteredPosts) &&
      filteredPosts.map((post) => (
        <article
          key={post.id}
          className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          {/* User Info */}
          <div className="flex items-center space-x-5 mb-4">
            <div className="avatar">
              {post.user_image ? (
                <div className="w-14 h-14 rounded-full border-2 border-blue-400">
                  <Image
                    src={post.user_image}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-400 text-white flex items-center justify-center border-2 border-blue-400">
                  {post.user_firstname.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              {/* <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {post.user_firstname}, {post.user_lastname}
              </h2> */}
              {/* <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">
  {`${post.user_firstname} ${post.user_lastname}`}
</h2> */}
{/* <div className="relative group inline-block">
  <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 
                 hover:underline cursor-pointer">
    {`${post.user_firstname} ${post.user_lastname}`}
  </h2>

  
  <div className="absolute left-0 top-full mt-2 hidden group-hover:block 
                  bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 
                  w-48 z-20 border border-gray-200 dark:border-gray-700">
    <p className="font-medium text-gray-900 dark:text-gray-100">
      {post.user_firstname} {post.user_lastname}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      @{post.user_name}
    </p>
    
  </div>
</div> */}
{/* <div className="relative group inline-block">
      <Link href={`/dashboard/user_profile/${post.user_name}`}  target="_blank">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 
                       hover:underline cursor-pointer">
          {`${post.user_firstname} ${post.user_lastname}`}
        </h2>
      </Link>

      <div className="absolute left-0 top-full mt-2 hidden group-hover:block 
                      bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4
                      w-56 z-20 border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {post.user_firstname} {post.user_lastname}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          @{post.user_name}
        </p>
      </div>
    </div> */}
   <div className="relative group inline-block">
  {/* Profile Link */}
  <Link
    href={
      userId === post.user_id
        ? `/dashboard/user_profile/${post.user_name}` // own profile
        : `/dashboard/profile/${post.user_name}` // other user's profile
     }
      target="_blank"
  >
    <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">
      {`${post.user_firstname} ${post.user_lastname}`}
    </h2>
  </Link>

  {/* Hover Card */}
  <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-56 z-20 border border-gray-200 dark:border-gray-700">
    <p className="font-medium text-gray-900 dark:text-gray-100">
      {post.user_firstname} {post.user_lastname}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      @{post.user_name}
    </p>
  </div>
</div>




              <p className="text-sm text-blue-600 font-medium dark:text-blue-400">
                Goal: {post.category_names}{post.user_id}
              </p>
            </div>
          </div>

          {/* Post Text */}
          {/* <p className="text-gray-800 mb-4 leading-relaxed dark:text-gray-300">
            {post.title}
          </p> */}
          {/* Post Text with View More / Less */}
  {/* Post Text with View More / Less */}
  <p
    className={`text-gray-800 mb-4 leading-relaxed dark:text-gray-300 break-words transition-all duration-300 ${
      expandedPosts.has(post.id)
        ? "max-h-full"
        : "line-clamp-3 overflow-hidden" // ✅ show "..." after 3 lines
    }`}
  >
    {post.title}
  </p>
  <button
    onClick={() => toggleExpand(post.id)}
    className="text-blue-500 hover:underline font-medium mt-1"
  >
    {expandedPosts.has(post.id) ? "Less view" : "View more"}
  </button>




          {/* Media */}
          {post.post_image && (
            <Image
              src={post.post_image}
              alt="Goal Image"
              width={500}
              height={300}
              className="w-full rounded-lg mb-4 shadow-sm object-cover max-h-60"
            />
          )}

          {post.image && (
            <Image
              src={post.image}
              alt="Progress"
              width={50}
              height={50}
              className="w-full rounded-lg mb-4 shadow-sm object-cover max-h-60"
            />
          )}

          {post.video && (
            <video controls className="w-full rounded-lg mb-4 shadow-sm max-h-60">
              <source src={post.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Reactions */}
          <div className="flex space-x-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <ReactionStats postId={post.id} />
          </div>

          {/* Comment & Share */}
          <div className="flex space-x-10 mt-6 border-t border-gray-200 pt-4 relative items-center dark:border-gray-700">
            <button
              onClick={() => openCommentModal(post.id)}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:underline focus:outline-none dark:text-blue-400"
            >
              <FiMessageCircle className="text-xl" />
              {commentOpenFor === post.id ? "Hide Comments" : "Comment"}
            </button>

            <button
              onClick={() => handleShare(post)}
              className="flex items-center gap-2 text-green-600 font-semibold hover:underline focus:outline-none dark:text-green-400"
            >
              <FiShare2 className="text-xl" />
              Share
            </button>

            {/* Reaction Button */}
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
                className="flex items-center gap-2 text-yellow-600 font-semibold hover:underline focus:outline-none hover:cursor-pointer dark:text-yellow-400"
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
          </div>
        </article>
      ))
    )}
  </div>
 <div className="fixed right-0 top-19 h-full w-1/4 bg-gray-100 p-6 overflow-y-auto shadow-lg z-30 dark:bg-gray-800">
  <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-gray-100">
    Online Followers
  </h3>
  <div className="space-y-4">{/* list here */}</div>
</div>




        {showCommentModal && activePostId && (
          // <CommentModal
          //   postId={activePostId}
          //   comments={comments[activePostId] || []}
          //   onAddComment={handleAddComment}
          //   onClose={closeCommentModal}
          // />
          <CommentModal
    postId={activePostId}
    comments={comments[activePostId] || []}
    onAddComment={handleAddComment}
    // input={commentInput}
    // setInput={setCommentInput}
    onClose={closeCommentModal}
  />
        )}
      </div>
      
    );
  };



  export default Timeline;
