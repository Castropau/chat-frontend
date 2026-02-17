"use client";

import { FiSmile, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { Dispatch, SetStateAction } from "react";

interface Emoji {
  id: number;
  emoji: string;
  label: string;
}

interface PostActionsProps {
  postId: number;
  emojis: Emoji[];
  selectedReaction: string | null;
  setReactionPickerPostId: Dispatch<SetStateAction<number | null>>;
  reactionPickerPostId: number | null;
  handleReaction: (postId: number, emojiId: string) => void;
  openCommentModal: (postId: number) => void;
}

export default function PostActions({
  postId,
  emojis,
  selectedReaction,
  setReactionPickerPostId,
  reactionPickerPostId,
  handleReaction,
  openCommentModal,
}: PostActionsProps) {
  const foundEmoji = emojis.find((e) => e.id === Number(selectedReaction));

  return (
    <div className="flex items-center space-x-6 border-t pt-4 border-gray-200 dark:border-gray-700 relative">
      {/* React Button with Selected Emoji */}
      <div className="relative">
        <button
          onClick={() => setReactionPickerPostId(reactionPickerPostId === postId ? null : postId)}
          className="flex items-center gap-2 px-3 py-1 rounded-full text-yellow-600 font-semibold hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors"
          title={selectedReaction ? "Remove your reaction" : "React"}
        >
          {foundEmoji && <span className="text-2xl">{foundEmoji.emoji}</span>}
          <FiSmile className="text-xl" />
          <span>React</span>
        </button>

        {/* Emoji Picker Popup */}
        {reactionPickerPostId === postId && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 flex items-center space-x-2 bg-white p-3 rounded-xl shadow-lg border dark:bg-gray-700 dark:border-gray-600">
            {emojis.map((emoji) => {
              const isSelected = selectedReaction?.toString() === emoji.id.toString();
              return (
                <button
                  key={emoji.id}
                  onClick={() => handleReaction(postId, emoji.id.toString())}
                  title={emoji.label}
                  className={`flex flex-col items-center px-2 py-1 rounded transition-transform hover:scale-110 ${
                    isSelected ? "bg-gray-300 font-bold dark:bg-gray-600" : "bg-transparent"
                  }`}
                >
                  <span className="text-2xl">{emoji.emoji}</span>
                  <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{emoji.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Comment Button */}
      <button
        onClick={() => openCommentModal(postId)}
        className="flex items-center gap-2 px-3 py-1 rounded-full text-blue-600 font-semibold hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
      >
        <FiMessageCircle className="text-xl" /> Comment
      </button>

      {/* Share Button */}
      <button className="flex items-center gap-2 px-3 py-1 rounded-full text-green-600 font-semibold hover:bg-green-100 dark:hover:bg-gray-700 transition-colors">
        <FiShare2 className="text-xl" /> Share
      </button>
    </div>
  );
}
