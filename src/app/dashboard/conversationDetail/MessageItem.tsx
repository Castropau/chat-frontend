import React from 'react';

interface Props {
  sender: string;
  content: string;
}

const avatars: Record<string, string> = {
  Alice: 'https://i.pravatar.cc/40?u=alice',
  You: 'https://i.pravatar.cc/40?u=you',
};

const MessageItem: React.FC<Props> = ({ sender, content }) => {
  const isUser = sender === 'You';

  return (
    <div className={`flex items-end space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img
          src={avatars[sender] || 'https://i.pravatar.cc/40?u=default'}
          alt={sender}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-900 shadow'
        }`}
      >
        {content}
      </div>

      {isUser && (
        <img
          src={avatars['You']}
          alt="You"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
    </div>
  );
};

export default MessageItem;
