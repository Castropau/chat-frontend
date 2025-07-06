import React from 'react';

interface ChatHeaderProps {
  name: string;
  avatar: string;
  status?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, avatar, status = 'Online' }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h2 className="text-sm font-medium text-gray-900">{name}</h2>
        <span className="text-xs text-green-600">{status}</span>
      </div>
    </div>
  );
};

export default ChatHeader;
