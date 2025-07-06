import React from 'react';
import ConversationList from '../conversations/ConversationList';
import ConversationDetail from '../conversationDetail/ConversationDetail';
// import ConversationList from '../conversations/ConversationList';
// import ConversationDetail from '../conversationDetail/ConversationDetail';

const MessengerLayout: React.FC = () => {
  return (
    <div className="messenger-layout" style={{ display: 'flex', height: '100vh' }}>
      <ConversationList />
      <ConversationDetail />
    </div>
  );
};

export default MessengerLayout;
