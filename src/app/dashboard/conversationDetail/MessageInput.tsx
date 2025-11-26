// // "use client";
// // import React, { useState } from "react";

// // interface Props {
// //   onSend: (content: string) => void;
// // }

// // const MessageInput: React.FC<Props> = ({ onSend }) => {
// //   const [message, setMessage] = useState("");

// //   const handleSend = () => {
// //     if (!message.trim()) return;
// //     onSend(message);
// //     setMessage("");
// //   };

// //   return (
// //     <div className="p-2 border-t border-gray-300 flex">
// //       <input
// //         type="text"
// //         value={message}
// //         onChange={(e) => setMessage(e.target.value)}
// //         placeholder="Type a message..."
// //         className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
// //       />
// //       <button
// //         onClick={handleSend}
// //         className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
// //       >
// //         Send
// //       </button>
// //     </div>
// //   );
// // };

// // export default MessageInput;
// "use client";
// import React, { useState } from "react";

// interface Props {
//   onSend: (content: string) => void;
// }

// const MessageInput: React.FC<Props> = ({ onSend }) => {
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     if (!message.trim()) return;
//     onSend(message);
//     setMessage("");
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault(); // prevent newline
//       handleSend();
//     }
//   };

//   return (
//     <div className="p-2 border-t border-gray-300 flex">
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown} // <-- handle Enter key
//         placeholder="Type a message..."
//         className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <button
//         onClick={handleSend}
//         className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
//       >
//         Send
//       </button>
//     </div>
//   );
// };

// export default MessageInput;
// "use client";

// import React, { useState } from "react";

// interface Props {
//   onSend: (content: string) => void;
// }

// const MessageInput: React.FC<Props> = ({ onSend }) => {
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     if (!message.trim()) return;
//     onSend(message);
//     setMessage("");
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="p-2 border-t border-gray-300 flex bg-white">
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Type a message..."
//         className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />

//       <button
//         onClick={handleSend}
//         className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
//       >
//         Send
//       </button>
//     </div>
//   );
// };

// export default MessageInput;







// typing show while click
// "use client";

// import React, { useState, useRef } from "react";

// interface Props {
//   onSend: (content: string) => void;
//   onTyping?: (isTyping: boolean) => void;
// }

// const MessageInput: React.FC<Props> = ({ onSend, onTyping }) => {
//   const [message, setMessage] = useState("");
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
//   const [typing, setTyping] = useState(false);

//   const handleSend = () => {
//     if (!message) return; // allow spaces and numbers
//     onSend(message);
//     setMessage("");
//     stopTyping();
//   };

//   const startTyping = (value: string) => {
//     // Only consider typing if input has any value (including spaces or numbers)
//     if (value.length > 0 && !typing) {
//       setTyping(true);
//       onTyping?.(true);
//     }

//     // Stop typing after 1s of inactivity
//     if (typingTimeout.current) clearTimeout(typingTimeout.current);
//     typingTimeout.current = setTimeout(() => {
//       stopTyping();
//     }, 1000);
//   };

//   const stopTyping = () => {
//     if (typing) {
//       setTyping(false);
//       onTyping?.(false);
//     }
//     if (typingTimeout.current) {
//       clearTimeout(typingTimeout.current);
//       typingTimeout.current = null;
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setMessage(e.target.value);
//     startTyping(e.target.value);
//   };

//   return (
//     <div className="p-2 border-t border-gray-300 flex bg-white">
//       <input
//         type="text"
//         value={message}
//         onChange={handleChange}
//         onKeyDown={handleKeyDown}
//         placeholder="Type a message..."
//         className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <button
//         onClick={handleSend}
//         className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
//       >
//         Send
//       </button>
//     </div>
//   );
// };

// export default MessageInput;


// doneeeeeeeeeee
"use client";

import React, { useState, useEffect } from "react";

interface Props {
  onSend: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

const MessageInput: React.FC<Props> = ({ onSend, onTyping }) => {
  const [message, setMessage] = useState("");

  // Emit typing status whenever the message changes
  useEffect(() => {
    if (message.length > 0) {
      onTyping?.(true);  // show typing if input has any value
    } else {
      onTyping?.(false); // hide typing if input is empty
    }
  }, [message, onTyping]);

  const handleSend = () => {
    if (!message) return;
    onSend(message);
    setMessage(""); // clears input, typing will automatically stop
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-2 border-t border-gray-300 flex bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSend}
        className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
