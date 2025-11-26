"use client";
import React, { useState } from "react";
import ConversationList, { User } from "../conversations/ConversationList";
import RecentConversations from "../conversationDetail/Recent";
import ConversationDetail from "../conversationDetail/ConversationDetail";

const MessengerLayout: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(null);

  return (
    <div className="flex h-screen overflow-hidden pt-16"> {/* Prevent overflow on the main container */}
      {/* Left Panel: Conversation List */}
      <div className="w-1/4 border-r border-gray-300 flex flex-col">
        <div className="flex-1 overflow-y-auto"> {/* Scrollable only inside this section */}
          <ConversationList onSelectUser={setSelectedUser} />
        </div>
      </div>

      {/* Middle Panel: Recent Conversations */}
      <div className="w-1/4 border-r border-gray-300 flex flex-col">
        <div className="flex-1 overflow-y-auto"> {/* Scrollable only inside this section */}
          <RecentConversations onSelectUser={setSelectedUser} />
        </div>
      </div>

      {/* Right Panel: Conversation Detail */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ConversationDetail user={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg font-medium">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default MessengerLayout;
