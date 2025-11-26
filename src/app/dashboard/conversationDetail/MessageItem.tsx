// "use client";
// import React from "react";

// interface Props {
//   sender: string;
//   content: string;
// }

// const avatars: Record<string, string> = {
//   Alice: "https://i.pravatar.cc/40?u=alice",
//   You: "https://i.pravatar.cc/40?u=you",
// };

// const MessageItem: React.FC<Props> = ({ sender, content }) => {
//   const isUser = sender === "You";
//   return (
//     <div className={`flex items-end ${isUser ? "justify-end" : "justify-start"}`}>
//       {!isUser && (
//         <img src={avatars[sender] || "https://i.pravatar.cc/40"} alt={sender} className="w-8 h-8 rounded-full" />
//       )}
//       <div className={`px-3 py-2 rounded-lg max-w-xs ${isUser ? "bg-blue-500 text-white" : "bg-white shadow"}`}>
//         {content}
//       </div>
//       {isUser && <img src={avatars["You"]} alt="You" className="w-8 h-8 rounded-full" />}
//     </div>
//   );
// };

// export default MessageItem;









// done
// "use client";

// import React from "react";

// interface Props {
//   sender: string;
//   content: string;
// }

// const avatars: Record<string, string> = {
//   Alice: "https://i.pravatar.cc/40?u=alice",
//   You: "https://i.pravatar.cc/40?u=you",
// };

// const MessageItem: React.FC<Props> = ({ sender, content }) => {
//   const isUser = sender === "You";

//   return (
//     <div className={`flex items-end ${isUser ? "justify-end" : "justify-start"}`}>
//       {!isUser && (
//         <img
//           src={avatars[sender] || "https://i.pravatar.cc/40"}
//           alt={sender}
//           className="w-8 h-8 rounded-full"
//         />
//       )}

//       <div
//         className={`px-3 py-2 rounded-lg max-w-xs ${
//           isUser ? "bg-blue-500 text-white" : "bg-white shadow"
//         }`}
//       >
//         {content}
//       </div>

//       {isUser && (
//         <img
//           src={avatars["You"]}
//           alt="You"
//           className="w-8 h-8 rounded-full"
//         />
//       )}
//     </div>
//   );
// };

// export default MessageItem;
// "use client";

// import React from "react";

// interface Props {
//   sender: string;      // "You" or other user's name
//   content: string;
//   avatar?: string;     // URL from database
// }

// const MessageItem: React.FC<Props> = ({ sender, content, avatar }) => {
//   const isUser = sender === "You";

//   return (
//     <div className={`flex items-end ${isUser ? "justify-end" : "justify-start"} space-x-2`}>
//       {/* Left avatar for other user */}
//       {!isUser && (
//         <img
//           src={avatar || "https://i.pravatar.cc/40"}
//           alt={sender}
//           className="w-8 h-8 rounded-full"
//         />
//       )}

//       {/* Message bubble */}
//       <div
//         className={`px-3 py-2 rounded-lg max-w-xs break-words ${
//           isUser ? "bg-blue-500 text-white" : "bg-white shadow"
//         }`}
//       >
//         {content}
//       </div>

//       {/* Right avatar for current user */}
//       {isUser && (
//         <img
//           src={avatar || "https://i.pravatar.cc/40?u=you"}
//           alt="You"
//           className="w-8 h-8 rounded-full"
//         />
//       )}
//     </div>
//   );
// };

// export default MessageItem;

"use client";

import React from "react";
import Image from "next/image";
interface Props {
  sender: string;      // "You" or other user's name
  content: string;
  avatar?: string;
  messageId?: string;
  isUnsent?: boolean;
  onUnsend?: (id: string) => void;
  
  
}

const MessageItem: React.FC<Props> = ({
  sender,
  content,
  avatar,
  messageId,
  isUnsent,
  onUnsend,
}) => {
  const isUser = sender === "You";

  return (
    <div
      className={`flex items-end ${isUser ? "justify-end" : "justify-start"} space-x-2`}
    >
      {/* Left avatar for other user */}
      {!isUser && (
        <Image
          width={32}
          height={32}
          src={avatar || "https://i.pravatar.cc/40"}
          alt={sender}
          className="w-8 h-8 rounded-full"
        />
      )}

      {/* Message bubble */}
   <div
  // className={`px-3 py-2 rounded-lg max-w-xs break-words relative ${
  //   isUnsent ? "line-through text-gray-400 italic" : ""
  // }`}
  //  className={`
  //         px-3 py-2 rounded-lg max-w-xs break-words relative
  //         ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}
  //         ${isUnsent ? "line-through text-gray-400 italic bg-gray-300" : ""}
  //       `}
   className={`px-3 py-2 rounded-lg max-w-xs break-words relative ${
    isUnsent
      ? "bg-gray-200 line-through text-gray-500 italic"
      : isUser
      ? "bg-blue-500 text-white"
      : "bg-gray-300 text-black"
  }`}
>
  {content}

  {/* Unsend button only for sender and only if not already unsent */}
  {isUser && !isUnsent && messageId && onUnsend && (
    <button
      onClick={() => onUnsend(messageId)}
      className="absolute -top-4 right-0 text-xs text-red-500 hover:underline"
    >
      Unsend
    </button>
  )}
</div>


      {/* Right avatar for current user */}
      {isUser && (
        <Image
          src={avatar || "https://i.pravatar.cc/40?u=you"}
          alt="You"
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
      )}
    </div>
  );
};

export default MessageItem;
