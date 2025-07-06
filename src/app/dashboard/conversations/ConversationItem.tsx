import React from 'react';

interface Props {
  id: string;
  name: string;
  lastMessage: string;
}

const avatars: Record<string, string> = {
  Alice: 'https://i.pravatar.cc/40?u=alice',
  Bob: 'https://i.pravatar.cc/40?u=bob',
};

const ConversationItem: React.FC<Props> = ({ name, lastMessage }) => {
  return (
    <div className="flex items-center p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-200">
      <img
        src={avatars[name] || 'https://i.pravatar.cc/40?u=default'}
        alt={name}
        className="w-10 h-10 rounded-full object-cover mr-3"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">{name}</span>
        <span className="text-sm text-gray-600 truncate max-w-[180px]">{lastMessage}</span>
      </div>
    </div>
  );
};

export default ConversationItem;
