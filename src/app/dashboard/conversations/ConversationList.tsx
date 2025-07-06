import React from 'react';
import ConversationItem from './ConversationItem';
import UserProfile from './UserProfile';

const ConversationList: React.FC = () => {
  const conversations = [
    { id: '1', name: 'Alice', lastMessage: 'Hey there!' },
    { id: '2', name: 'Bob', lastMessage: 'What’s up?' },
  ];

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full bg-gray-50">
      <UserProfile />

      <div className="overflow-y-auto flex-1">
        {conversations.map((conv) => (
          <ConversationItem key={conv.id} {...conv} />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
