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
"use client";
import React, { useState, useEffect } from "react";
import ConversationList, { User } from "../conversations/ConversationList";
import RecentConversations from "../conversationDetail/Recent";
import ConversationDetail from "../conversationDetail/ConversationDetail";
import { closeSocket, initSocket } from "@/utils/webSocket";
import axios from "axios";
// import { initSocket, getSocket, closeSocket } from "../utils/webSocket"; // Ensure you have socket logic in utils

const MessengerLayout: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false); // Track socket connection status
const updateOnlineStatus = async (userId: number) => {
    try {
      await axios.post("/api/online-status", { userId, online: 0 });
      console.log("User's online status updated to 0.");
    } catch (error) {
      console.error("Error updating online status:", error);
    }
  };
  useEffect(() => {
    // Initialize socket when component mounts
    const socket = initSocket(); // Assuming initSocket manages connection
    if (socket) {
      // Listen for socket connection events
      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
        setSocketConnected(true); // Update socket connection status in state
      });

      socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
        setSocketConnected(false); // Update socket connection status on error
      });

      socket.on("disconnect", (reason) => {
        console.log(`⚠️ Socket disconnected: ${reason}`);
        setSocketConnected(false); // Update socket connection status on disconnect
      });
    }

    // Cleanup socket connection when component unmounts
    return () => {
      closeSocket(); // Assuming closeSocket will disconnect the socket when done
    };
  }, []); // Empty dependency array to only run once when the component mounts
 useEffect(() => {
    const handleBeforeUnload = () => {
      if (selectedUser) {
        updateOnlineStatus(selectedUser.id as number); // Update user's status
      }
    };

    // Add the beforeunload event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedUser]);
  return (
    // <div className="flex h-screen overflow-hidden pt-16">
    //   {/* Left Panel: Conversation List */}
    //   <div className="w-1/4 border-r border-gray-300 flex flex-col">
    //     <div className="flex-1 overflow-y-auto">
    //       <ConversationList onSelectUser={setSelectedUser} />
    //     </div>
    //   </div>

    //   {/* Middle Panel: Recent Conversations */}
    //   <div className="w-1/4 border-r border-gray-300 flex flex-col">
    //     <div className="flex-1 overflow-y-auto">
    //       <RecentConversations onSelectUser={setSelectedUser} />
    //     </div>
    //   </div>

    //   {/* Right Panel: Conversation Detail */}
    //   <div className="flex-1 flex flex-col">
    //     {selectedUser ? (
    //       <ConversationDetail user={selectedUser} />
    //     ) : (
    //       <div className="flex-1 flex items-center justify-center text-gray-400 text-lg font-medium">
    //         Select a user to start chatting
    //       </div>
    //     )}
    //   </div>

    //   {/* Display Socket Connection Status */}
    //   <div className="absolute bottom-4 right-4">
    //     <span className={`px-4 py-2 rounded-lg ${socketConnected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
    //       {socketConnected ? 'Connected' : 'Disconnected'}
    //     </span>
    //   </div>
    // </div>
    <div className="flex h-screen overflow-hidden pt-16 bg-gray-50 dark:bg-gray-800">
  {/* Left Panel: Conversation List */}
  <div className="w-1/4 border-r border-gray-300 dark:border-gray-700 flex flex-col">
    <div className="flex-1 overflow-y-auto">
      <ConversationList onSelectUser={setSelectedUser} />
    </div>
  </div>

  {/* Middle Panel: Recent Conversations */}
  <div className="w-1/4 border-r border-gray-300 dark:border-gray-700 flex flex-col">
    <div className="flex-1 overflow-y-auto">
      <RecentConversations onSelectUser={setSelectedUser} />
    </div>
  </div>

  {/* Right Panel: Conversation Detail */}
  <div className="flex-1 flex flex-col">
    {selectedUser ? (
      <ConversationDetail user={selectedUser} />
    ) : (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg font-medium">
        Select a user to start chatting
      </div>
    )}
  </div>

  {/* Display Socket Connection Status */}
  <div className="absolute bottom-4 right-4">
    <span
      className={`px-4 py-2 rounded-lg ${
        socketConnected ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {socketConnected ? "Connected" : "Disconnected"}
    </span>
  </div>
</div>

  );
};

export default MessengerLayout;
