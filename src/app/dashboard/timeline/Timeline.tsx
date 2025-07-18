"use client";
import React, { useState } from "react";
import FilterBar from "./FilterBar"; // your multi-select version
import { FiMessageCircle, FiShare2, FiSmile } from "react-icons/fi";
import CreateGoal from "./CreateGoal";

type Post = {
  id: number;
  name: string;
  goal: string;
  category: string;
  text: string;
  image?: string;
  video?: string;
};

const mockPosts: Post[] = [
  {
    id: 1,
    name: "Jane Doe",
    goal: "Run a Marathon",
    category: "Fitness",
    text: "Completed a 10K run this morning. Feeling strong! 🏃‍♀️",
    image: "https://via.placeholder.com/300x150",
  },
  {
    id: 2,
    name: "Tom Smith",
    goal: "Study for Exams",
    category: "Study",
    text: "Finished 5 chapters of calculus today. 📚",
  },
  {
    id: 3,
    name: "Lena Park",
    goal: "Improve Mindfulness",
    category: "Mental Health",
    text: "Meditated for 20 minutes and journaled. Feeling centered 🧘‍♀️",
  },
  {
    id: 4,
    name: "Chris Lee",
    goal: "Daily Jogging",
    category: "Jogging",
    text: "Jogged 3km around the park this morning 🌄",
  },
];

const Timeline: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [commentOpenFor, setCommentOpenFor] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, string[]>>({});

  const filteredPosts = selectedCategories.includes("All")
    ? mockPosts
    : mockPosts.filter((post) => selectedCategories.includes(post.category));

  const toggleCommentBox = (postId: number) => {
    setCommentOpenFor((prev) => (prev === postId ? null : postId));
  };

  const handleAddComment = (postId: number, comment: string) => {
    if (!comment.trim()) return;
    setComments((prev) => {
      const prevComments = prev[postId] || [];
      return { ...prev, [postId]: [...prevComments, comment.trim()] };
    });
  };

  const handleShare = (post: Post) => {
    // Placeholder for share functionality
    alert(`Shared post by ${post.name} about "${post.goal}"!`);
  };
  const [reactionPickerPostId, setReactionPickerPostId] = useState<
    number | null
  >(null);

  // Store selected reaction per post
  const [selectedReactions, setSelectedReactions] = useState<
    Record<number, string | null>
  >({});

  const reactions = [
    { emoji: "👍", label: "Like" },
    { emoji: "❤️", label: "Love" },
    { emoji: "😂", label: "Haha" },
    { emoji: "😮", label: "Wow" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "👋", label: "Hi" },
  ];

  const handleReaction = (postId: number, emoji: string) => {
    setSelectedReactions((prev) => {
      const current = prev[postId];
      // If user clicks the same emoji again → remove it
      const newReaction = current === emoji ? null : emoji;
      return { ...prev, [postId]: newReaction };
    });
    setReactionPickerPostId(null); // close picker
  };

  return (
    <div className="max-w-xl mx-auto p-6  min-h-screen">
      <FilterBar
        selected={selectedCategories}
        onSelect={setSelectedCategories}
      />
      <CreateGoal />

      {filteredPosts.length === 0 ? (
        <p className="text-center text-gray-500 mt-20 text-lg font-light">
          No posts found for selected.
        </p>
      ) : (
        filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* User Info */}
            <div className="flex items-center space-x-5 mb-4">
              <img
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${post.name}`}
                alt="Avatar"
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
              />
              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  {post.name}
                </h2>
                <p className="text-sm text-blue-600 font-medium">
                  Goal: {post.goal}
                </p>
              </div>
            </div>

            {/* Post Text */}
            <p className="text-gray-800 mb-4 leading-relaxed">{post.text}</p>

            {/* Media */}
            {post.image && (
              <img
                src={post.image}
                alt="Progress"
                className="w-full rounded-lg mb-4 shadow-sm object-cover max-h-60"
              />
            )}
            {post.video && (
              <video
                controls
                className="w-full rounded-lg mb-4 shadow-sm max-h-60"
              >
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Reactions */}
            <div className="flex space-x-6 border-t border-gray-200 pt-4">
              <button
                aria-label="Say Hi"
                className="text-2xl hover:scale-125 transition transform"
                title="Say Hi"
              >
                👋
              </button>
              <button
                aria-label="Muscle"
                className="text-2xl hover:scale-125 transition transform"
                title="Muscle"
              >
                💪
              </button>
              <button
                aria-label="Fire"
                className="text-2xl hover:scale-125 transition transform"
                title="Fire"
              >
                🔥
              </button>
            </div>

            {/* Comment & Share */}
            {/* Comment / Share / Reaction */}
            {/* Comment / Share / React */}
            <div className="flex space-x-10 mt-6 border-t border-gray-200 pt-4 relative items-center">
              <button
                onClick={() => toggleCommentBox(post.id)}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline focus:outline-none"
              >
                <FiMessageCircle className="text-xl" />
                {commentOpenFor === post.id ? "Hide Comments" : "Comment"}
              </button>

              <button
                onClick={() => handleShare(post)}
                className="flex items-center gap-2 text-green-600 font-semibold hover:underline focus:outline-none"
              >
                <FiShare2 className="text-xl" />
                Share
              </button>

              {/* Reaction Button */}
              <div className="relative">
                <button
                  onClick={() =>
                    setReactionPickerPostId(
                      reactionPickerPostId === post.id ? null : post.id
                    )
                  }
                  className="flex items-center gap-2 text-yellow-600 font-semibold hover:underline focus:outline-none hover:cursor-pointer"
                  title={
                    selectedReactions[post.id]
                      ? `Remove "${selectedReactions[post.id]}" reaction`
                      : "React"
                  }
                >
                  <FiSmile className="text-xl" />
                  {selectedReactions[post.id]
                    ? selectedReactions[post.id]
                    : "React"}
                </button>

                {/* Emoji Picker (only for this post) */}
                {reactionPickerPostId === post.id && (
                  <div className="absolute top-full mt-2 left-0 z-10 flex space-x-4 bg-white p-3 rounded shadow-md border">
                    {/* {reactions.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => handleReaction(post.id, r.emoji)}
                        title={r.label}
                        className="flex flex-col items-center hover:scale-110 transition-transform"
                      >
                        <span className="text-2xl">{r.emoji}</span>
                        <span className="text-xs mt-1 text-gray-600">
                          {r.label}
                        </span>
                      </button>
                    ))} */}
                    {/* <div className="absolute top-full mt-2 left-0 z-10 flex space-x-4 bg-white p-3 rounded shadow-md border"> */}
                    {reactions.map((r) => {
                      const isSelected = selectedReactions[post.id] === r.emoji;
                      return (
                        <button
                          key={r.label}
                          onClick={() => handleReaction(post.id, r.emoji)}
                          title={r.label}
                          className={`flex flex-col items-center px-2 py-1 rounded transition-transform hover:cursor-pointer ${
                            isSelected ? "bg-gray-200 font-bold" : ""
                          } hover:scale-110`}
                        >
                          <span className="text-2xl">{r.emoji}</span>
                          <span className="text-xs mt-1 text-gray-600">
                            {r.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  //   </div>
                )}
              </div>
            </div>

            {/* Comment Section */}
            {commentOpenFor === post.id && (
              <CommentSection
                postId={post.id}
                comments={comments[post.id] || []}
                onAddComment={handleAddComment}
              />
            )}
          </article>
        ))
      )}
    </div>
  );
};

type CommentSectionProps = {
  postId: number;
  comments: string[];
  onAddComment: (postId: number, comment: string) => void;
};

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onAddComment,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(postId, input);
    setInput("");
  };

  return (
    <section className="mt-6">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 items-center border rounded-lg border-gray-300 p-3 bg-gray-50"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post
        </button>
      </form>

      {comments.length > 0 && (
        <ul className="mt-4 max-h-40 overflow-y-auto space-y-3">
          {comments.map((c, i) => (
            <li
              key={i}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-gray-800"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Timeline;
