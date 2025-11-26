import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Comment = {
  id?: number;
  comment: string;
  created_at?: string;
  userId?: number;
  userName?: string;
  userImage?: string; 
};

type CommentModalProps = {
  postId: number;
  comments: Comment[];
  onAddComment: (postId: number, comment: string) => void;
  onClose: () => void;
};

const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  comments,
  onAddComment,
  onClose,
}) => {
  const [input, setInput] = useState("");
  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to the latest comment
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]); // runs whenever comments update

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAddComment(postId, input);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Comments</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {comments.map((c, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
              >
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                   {/* <img
  className="mr-2 w-8 h-8 rounded-full"
  src={c.userImage || "/default-avatar.png"}
  alt={c.userName ? `${c.userName}'s profile` : `User ${i + 1}`}
/> */}
<Image
  className="mr-2 rounded-full"
  src={c.userImage || "/default-avatar.png"}
  alt={c.userName ? `${c.userName}'s profile` : `User ${i + 1}`}
  width={32}   // w-8 = 32px
  height={32}  // h-8 = 32px
  unoptimized={false} // optional: true if using external URLs not in next.config.js
/>

                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {c.userName}
                    </p>
                  </div>
                  <button
                    className="inline-flex items-center p-2 text-sm text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 3"
                    >
                      <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                    <span className="sr-only">Comment settings</span>
                  </button>
                </footer>

                {/* Comment Text */}
                <div className="max-h-40 overflow-y-auto">
                  <p className="text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap">
                    {c.comment}
                  </p>
                </div>

                <div className="flex items-center mt-4 space-x-4">
                  <button
                    type="button"
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
            {/* 👇 Scroll target */}
            <div ref={commentsEndRef} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No comments yet.</p>
        )}

        {/* Add Comment */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex gap-3 items-center border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-600 dark:text-white dark:bg-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
