import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const messages = [
  { id: "1", sender: "Alice", content: "Hi there!" },
  { id: "2", sender: "You", content: "Hello!" },
];

const MessageList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-100 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      {messages.map((msg) => (
        <MessageItem key={msg.id} {...msg} />
      ))}
    </div>
  );
};

export default MessageList;
