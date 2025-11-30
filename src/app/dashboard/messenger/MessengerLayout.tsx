// "use client";
// import React, { useState } from "react";
// import ConversationList, { User } from "../conversations/ConversationList";
// import RecentConversations from "../conversationDetail/Recent";
// import ConversationDetail from "../conversationDetail/ConversationDetail";

// const MessengerLayout: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   // const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(null);

//   return (
//     <div className="flex h-screen overflow-hidden pt-16"> {/* Prevent overflow on the main container */}
//       {/* Left Panel: Conversation List */}
//       test
//       <div className="w-1/4 border-r border-gray-300 flex flex-col">
//         <div className="flex-1 overflow-y-auto"> {/* Scrollable only inside this section */}
//           <ConversationList onSelectUser={setSelectedUser} />
//         </div>
//       </div>

//       {/* Middle Panel: Recent Conversations */}
//       <div className="w-1/4 border-r border-gray-300 flex flex-col">
//         <div className="flex-1 overflow-y-auto"> {/* Scrollable only inside this section */}
//           <RecentConversations onSelectUser={setSelectedUser} />
//         </div>
//       </div>

//       {/* Right Panel: Conversation Detail */}
//       <div className="flex-1 flex flex-col">
//         {selectedUser ? (
//           <ConversationDetail user={selectedUser} />
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-400 text-lg font-medium">
//             Select a user to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessengerLayout;
// "use client";
// import React, { useState, useEffect } from "react";
// import ConversationList, { User } from "../conversations/ConversationList";
// import RecentConversations from "../conversationDetail/Recent";
// import ConversationDetail from "../conversationDetail/ConversationDetail";
// import { closeSocket, initSocket } from "@/utils/webSocket";
// // import { initSocket, getSocket, closeSocket } from "../utils/webSocket"; // Ensure you have socket logic in utils

// const MessengerLayout: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [socketConnected, setSocketConnected] = useState<boolean>(false); // Track socket connection status

//   useEffect(() => {
//     // Initialize socket when component mounts
//     const socket = initSocket(); // Assuming initSocket manages connection
//     if (socket) {
//       // Listen for socket connection events
//       socket.on("connect", () => {
//         console.log("✅ Socket connected:", socket.id);
//         setSocketConnected(true); // Update socket connection status in state
//       });

//       socket.on("connect_error", (error) => {
//         console.error("❌ Socket connection error:", error);
//         setSocketConnected(false); // Update socket connection status on error
//       });

//       socket.on("disconnect", (reason) => {
//         console.log(`⚠️ Socket disconnected: ${reason}`);
//         setSocketConnected(false); // Update socket connection status on disconnect
//       });
//     }

//     // Cleanup socket connection when component unmounts
//     return () => {
//       closeSocket(); // Assuming closeSocket will disconnect the socket when done
//     };
//   }, []); // Empty dependency array to only run once when the component mounts

//   return (
//     <div className="flex h-screen overflow-hidden pt-16">
//       {/* Left Panel: Conversation List */}
//       <div className="w-1/4 border-r border-gray-300 flex flex-col">
//         <div className="flex-1 overflow-y-auto">
//           <ConversationList onSelectUser={setSelectedUser} />
//         </div>
//       </div>

//       {/* Middle Panel: Recent Conversations */}
//       <div className="w-1/4 border-r border-gray-300 flex flex-col">
//         <div className="flex-1 overflow-y-auto">
//           <RecentConversations onSelectUser={setSelectedUser} />
//         </div>
//       </div>

//       {/* Right Panel: Conversation Detail */}
//       <div className="flex-1 flex flex-col">
//         {selectedUser ? (
//           <ConversationDetail user={selectedUser} />
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-400 text-lg font-medium">
//             Select a user to start chatting
//           </div>
//         )}
//       </div>

//       {/* Display Socket Connection Status */}
//       <div className="absolute bottom-4 right-4">
//         <span className={`px-4 py-2 rounded-lg ${socketConnected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
//           {socketConnected ? 'Connected' : 'Disconnected'}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default MessengerLayout;
import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const MessengerLayout: React.FC = () => {
  // State to store socket instance
  const [socket, setSocket] = useState<Socket | null>(null);  // Type as Socket | null (initial state is null)
  const [connected, setConnected] = useState<boolean>(false);  // Connection status
  const [messages, setMessages] = useState<string[]>([]);  // List of messages (for example)
  
  // Establish WebSocket connection on mount
  useEffect(() => {
    const socketInstance = io("wss://growup-9psm.onrender.com", {
      transports: ["websocket"],  // Force WebSocket transport
      reconnectionAttempts: 5,    // Retry 5 times on failure
      reconnectionDelay: 1000,    // Delay between reconnections
      timeout: 10000,             // Timeout after 10 seconds
    });

    // Update connection status on successful connection
    socketInstance.on("connect", () => {
      setConnected(true);
      console.log("✅ Socket connected:", socketInstance.id);
    });

    // Handle connection error
    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setConnected(false);
    });

    // Handle disconnections
    socketInstance.on("disconnect", (reason: string) => {
      console.log(`⚠️ Socket disconnected: ${reason}`);
      setConnected(false);
    });

    // Listen for incoming messages
    socketInstance.on("new_message", (message: string) => {
      console.log("📩 New message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);  // Add new message to state
    });

    // Store socket instance in state for future interactions
    setSocket(socketInstance);

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
      setConnected(false);
    };
  }, []);  // Empty dependency array ensures effect only runs once on mount

  // Handle sending a message
  const sendMessage = (message: string) => {
    if (socket && message.trim()) {
      socket.emit("send_message", message);  // Send message to server
      console.log("✉️ Message sent:", message);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden pt-16">
      {/* Left Panel: Conversation List */}
      <div className="w-1/4 border-r border-gray-300 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold p-4">Conversations</h2>
          {/* Add conversation list here */}
        </div>
      </div>

      {/* Middle Panel: Recent Conversations */}
      <div className="w-1/4 border-r border-gray-300 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold p-4">Recent Conversations</h2>
          {/* Add recent conversations here */}
        </div>
      </div>

      {/* Right Panel: Conversation Detail */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold p-4">Conversation Details</h2>

        {/* Display messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div>
            <h3 className="text-lg font-semibold">Messages</h3>
            <div className="space-y-2 mt-2">
              {messages.length === 0 ? (
                <p className="text-gray-500">No messages yet...</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="p-2 bg-gray-100 rounded-md">
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-gray-300">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 border rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";  // Clear input
              }
            }}
          />
        </div>
      </div>

      {/* Socket Connection Status */}
      <div className="absolute bottom-4 right-4">
        <span className={`px-4 py-2 rounded-lg ${connected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
};

export default MessengerLayout;

