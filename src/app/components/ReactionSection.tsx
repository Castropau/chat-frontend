// "use client";

// import { FiMessageCircle, FiShare2, FiSmile } from "react-icons/fi";

// // ---------- INTERFACES ----------
// interface Emoji {
//   id: number;
//   emoji: string;
//   label: string;
// }

// interface PostType {
//   id: number;
// }

// interface ReactionSectionProps {
//   post: PostType;
//   emojis: Emoji[];
//   selectedReactions: { [postId: number]: string | null };
//   reactionPickerPostId: number | null;
//   setReactionPickerPostId: (id: number | null) => void;
//   handleReaction: (postId: number, emojiId: string) => void;
//   openCommentModal: (postId: number) => void;
// }

// // ---------- COMPONENT ----------
// export default function ReactionSection({
//   post,
//   emojis,
//   selectedReactions,
//   reactionPickerPostId,
//   setReactionPickerPostId,
//   handleReaction,
//   openCommentModal,
// }: ReactionSectionProps) {
//   return (
//     <div className="flex space-x-8 border-t pt-4 dark:border-gray-700">
//       {/* Reaction Picker Block */}
//       <div className="relative flex items-center gap-2">

//         {/* Selected Reaction Emoji */}
//         {selectedReactions[post.id] && (
//           <span className="text-2xl dark:text-gray-100">
//             {
//               emojis.find(e => e.id.toString() === selectedReactions[post.id])
//                 ?.emoji
//             }
//           </span>
//         )}

//         {/* React Button */}
//         <button
//           onClick={() =>
//             setReactionPickerPostId(
//               reactionPickerPostId === post.id ? null : post.id
//             )
//           }
//           className="flex items-center gap-2 text-yellow-600 font-semibold hover:underline dark:text-yellow-400"
//         >
//           <FiSmile className="text-xl" />
//           <span>React</span>
//         </button>

//         {/* Picker Popup */}
//         {reactionPickerPostId === post.id && (
//           <div className="absolute top-full mt-2 left-0 z-20 flex space-x-4 bg-white p-3 rounded shadow-md border dark:bg-gray-700 dark:border-gray-600">
//             {emojis.map((r) => {
//               const isSelected =
//                 selectedReactions[post.id] === r.id.toString();

//               return (
//                 <button
//                   key={r.id}
//                   onClick={() => handleReaction(post.id, r.id.toString())}
//                   className={`flex flex-col items-center px-2 py-1 rounded transition-transform hover:scale-110
//                   ${
//                     isSelected
//                       ? "bg-gray-300 font-bold dark:bg-gray-600"
//                       : "bg-transparent"
//                   }`}
//                 >
//                   <span className="text-2xl">{r.emoji}</span>
//                   <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
//                     {r.label}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Comment Button */}
//       <button
//         onClick={() => openCommentModal(post.id)}
//         className="flex items-center gap-2 text-blue-600 font-semibold hover:underline dark:text-blue-400"
//       >
//         <FiMessageCircle className="text-xl" /> Comment
//       </button>

//       {/* Share Button */}
//       <button className="flex items-center gap-2 text-green-600 font-semibold hover:underline dark:text-green-400">
//         <FiShare2 className="text-xl" /> Share
//       </button>
//     </div>
//   );
// }
"use client";

import { FiMessageCircle, FiShare2, FiSmile } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

// ---------- INTERFACES ----------
interface Emoji {
  id: number;
  emoji: string;
  label: string;
}

interface PostType {
  id: number;
}

interface ReactionSectionProps {
  post: PostType;
  emojis: Emoji[];
  selectedReactions: { [postId: number]: string | null };
  reactionPickerPostId: number | null;
  setReactionPickerPostId: (id: number | null) => void;
  handleReaction: (postId: number, emojiId: string) => void;
  openCommentModal: (postId: number) => void;
}

// ---------- COMPONENT ----------
export default function ReactionSection({
  post,
  emojis,
  selectedReactions,
  reactionPickerPostId,
  setReactionPickerPostId,
  handleReaction,
  openCommentModal,
}: ReactionSectionProps) {
  const selectedEmoji = emojis.find(
    (e) => e.id.toString() === selectedReactions[post.id]
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pickerStyle, setPickerStyle] = useState({ left: '50%', transform: 'translateX(-50%)' });

  useEffect(() => {
    if (reactionPickerPostId === post.id && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const pickerWidth = 300; // approximate width of emoji picker
      const screenWidth = window.innerWidth;

      let left = buttonRect.left + buttonRect.width / 2 - pickerWidth / 2;
      if (left < 8) left = 8; // padding from left
      if (left + pickerWidth > screenWidth - 8) left = screenWidth - pickerWidth - 8; // padding from right

      setPickerStyle({ left: `${left}px`, transform: 'translateX(0)' });
    }
  }, [reactionPickerPostId]);

  return (
    <div className="flex items-center space-x-6 border-t pt-4 border-gray-200 dark:border-gray-700 relative">
      {/* React Button */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() =>
            setReactionPickerPostId(
              reactionPickerPostId === post.id ? null : post.id
            )
          }
          className="flex items-center gap-2 px-3 py-1 rounded-full text-yellow-600 font-semibold hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors"
        >
          {selectedEmoji && <span className="text-2xl">{selectedEmoji.emoji}</span>}
          <FiSmile className="text-xl" />
          <span>React</span>
        </button>

        {/* Emoji Picker Popup */}
        {reactionPickerPostId === post.id && (
          <div
            style={pickerStyle}
            className="absolute bottom-full mb-2 z-50 flex items-center space-x-2 bg-white p-3 rounded-xl shadow-lg border dark:bg-gray-700 dark:border-gray-600"
          >
            {emojis.map((emoji) => {
              const isSelected = selectedReactions[post.id]?.toString() === emoji.id.toString();
              return (
                <button
                  key={emoji.id}
                  onClick={() => handleReaction(post.id, emoji.id.toString())}
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
        onClick={() => openCommentModal(post.id)}
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
