import React, { useState } from 'react';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '80%', marginRight: '10px' }}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
