"use client";

import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

interface ConversationDetailProps {
  user: { id: string | number; username: string } | null;
}

interface Message {
  id: string;
  senderName: string;
  content: string;
  avatar?: string;
  senderId?: string;
  isUnsent?: boolean;
  // online?: boolean;
    online?: boolean; // ✅ add this

}
interface UnsentMessageEvent {
  id: string;
  content: string;
}
interface TypingUpdateEvent {
  senderId: string;
  senderName: string;
  typing: boolean;
}
let socket: Socket | null = null;

const ConversationDetail: React.FC<ConversationDetailProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

const [username, setUsername] = useState<string>("");
const [firstname ,setFirstname ] = useState<string>("");
const [email, setEmail ] = useState<string>("");
// const socketUrl = process.env.SOCKET_URL;
// Clear typing when switching conversation partner
 // <-- use the variable that contains the chat partner's ID
useEffect(() => {
  setTypingUsers([]);
}, [user?.id]);

  // Load logged in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.id) setUserId(storedUser.id);
      if (storedUser?.username) setUsername(storedUser.username);
       if (storedUser?.firstname) setFirstname(storedUser.firstname);
        if (storedUser?.email) setEmail(storedUser.email);
      
console.log("Logged in user:", username, firstname, email);
  }, []);
const [currentChatRoom, setCurrentChatRoom] = useState<string | null>(null);

useEffect(() => {
  if (!userId || !user || !socket) return;

  const room = [userId, user.id].sort().join("_");

  if (currentChatRoom && currentChatRoom !== room) {
    socket.emit("leaveChat", { room: currentChatRoom });
  }

  socket.emit("joinChat", { userId, otherUserId: user.id });
  setCurrentChatRoom(room);

  // return () => {
  //   socket.emit("leaveChat", { room });
  // };
  return () => {
  if (socket) {
    socket.emit("leaveChat", { room });
  }
};

}, [user, userId]);

  // Init socket
  useEffect(() => {
    if (!userId) return;

    // if (!socket) {
    //   // socket = io("http://localhost:4000", 
    //   socket = io(socketUrl!, 
    //     { transports: ["websocket"] });
    // }
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

if (!socket) {
  socket = io(socketUrl!, { transports: ["websocket"] });
}

    socket.emit("joinUserRoom", { userId });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [userId]);
// Called whenever input changes
// const handleTyping = (isTyping: boolean) => {
//   if (!userId || !user) return;

//   // Only emit typing for the current open chat
//   socket?.emit(isTyping ? "typing:start" : "typing:stop", {
//     senderId: userId,
//     receiverId: user.id,   // ONLY the user currently chatting
//     senderName: firstname || email || username,
//   });
// };

// useEffect(() => {
//   if (!socket) return;

//   const handleTypingUpdate = ({ senderName, typing }: { senderName: string; typing: boolean }) => {
//     setTypingUsers((prev) => {
//       if (typing && !prev.includes(senderName)) return [...prev, senderName];
//       if (!typing) return prev.filter((name) => name !== senderName);
//       return prev;
//     });
//   };

//   socket.on("typing:update", handleTypingUpdate);

//   return () => socket.off("typing:update", handleTypingUpdate);
// }, [socket]);
// useEffect(() => {
//   if (!socket) return;

//   const handleTypingUpdate = ({
//     senderName,
//     typing,
//   }: {
//     senderName: string;
//     typing: boolean;
//   }) => {
//     setTypingUsers((prev) => {
//       if (typing && !prev.includes(senderName)) return [...prev, senderName];
//       if (!typing) return prev.filter((name) => name !== senderName);
//       return prev;
//     });
//   };

//   socket.on("typing:update", handleTypingUpdate);

//   return () => {
//     socket.off("typing:update", handleTypingUpdate);
//   };
// }, [socket]);
// useEffect(() => {
//   if (!socket) return;

//   const handleTypingUpdate = ({ senderName, typing }: { senderName: string; typing: boolean }) => {
//     setTypingUsers((prev) => {
//       if (typing && !prev.includes(senderName)) return [...prev, senderName];
//       if (!typing) return prev.filter((name) => name !== senderName);
//       return prev;
//     });
//   };

//   socket.on("typing:update", handleTypingUpdate);

//   return () => {
//     socket.off("typing:update", handleTypingUpdate);
//   };
// }, [socket]);
// useEffect(() => {
//   if (!socket) return;

//   const handleTypingUpdate = ({ senderName, typing }: { senderName: string; typing: boolean }) => {
//     setTypingUsers(prev => {
//       if (typing && !prev.includes(senderName)) return [...prev, senderName];
//       if (!typing) return prev.filter(name => name !== senderName);
//       return prev;
//     });
//   };

//   socket.on("typing:update", handleTypingUpdate);

//   return () => {
//     socket.off("typing:update", handleTypingUpdate);
//   };
// }, [socket]);
// useEffect(() => {
//   if (!socket || !user) return;

//   const handleTypingUpdate = ({
//     senderId,
//     senderName,
//     typing,
//   }: {
//     senderId: string;
//     senderName: string;
//     typing: boolean;
//   }) => {

//     // ❗ Only show typing if typing is from the current chat partner
//     // if (senderId !== user.id) return;
//     if (senderId !== user?.id) return;


//     setTypingUsers(prev => {
//       if (typing && !prev.includes(senderName)) return [...prev, senderName];
//       if (!typing) return prev.filter(name => name !== senderName);
//       return prev;
//     });
//   };

//   socket.on("typing:update", handleTypingUpdate);

//   // return () => socket.off("typing:update", handleTypingUpdate);
//   return () => {
//   if (socket) {
//     socket.off("typing:update", handleTypingUpdate);
//   }
// };

// }, [socket, user]);
useEffect(() => {
  if (!socket || !user) return;

  const handleTypingUpdate = ({
    senderId,
    senderName,
    typing
  }: TypingUpdateEvent) => {

    // only show typing from the current chat partner
    if (senderId !== user.id) return;

    setTypingUsers(prev => {
      if (typing && !prev.includes(senderName)) return [...prev, senderName];
      if (!typing) return prev.filter(name => name !== senderName);
      return prev;
    });
  };

  socket.on("typing:update", handleTypingUpdate);

  // return () => socket.off("typing:update", handleTypingUpdate);
  return () => {
  if (socket) socket.off("typing:update", handleTypingUpdate);
};

}, [socket, user?.id]);

// reset typing when switching conversation
useEffect(() => {
  setTypingUsers([]);
}, [user?.id]);


  // Join chat room & listen for new messages
  // useEffect(() => {
  //   if (!userId || !user || !socket) return;

  //   socket.emit("joinChat", { userId, otherUserId: user.id });

  //   const handleNew = (msg: any) => {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: msg.id,
  //         senderName: msg.senderId === userId ? "You" : user.username,
  //         content: msg.content,
  //         avatar: msg.avatar,
  //       },
  //     ]);
  //   };

  //   socket.on("message:new", handleNew);

  //   return () => {
  //     socket.off("message:new", handleNew);
  //   };
  // }, [user, userId]);
  
// done
interface NewMessageEvent {
  id: string;
  senderId: string;
  content: string;
  avatar?: string;
}
useEffect(() => {
  if (!userId || !user || !socket) return;

  socket.emit("joinChat", { userId, otherUserId: user.id });

  const handleNew = (msg: NewMessageEvent) => {
    setMessages((prev) => [
      ...prev,
      {
        id: msg.id,
        senderName: msg.senderId === userId ? "You" : user.username,
        content: msg.content,
        avatar: msg.avatar,
      },
    ]);
  };

  socket.on("message:new", handleNew);

  // Capture the socket at this moment
  const currentSocket = socket;

  return () => {
    // Use the captured socket to safely remove listener
    currentSocket.off("message:new", handleNew);
  };
}, [user, userId]);

  // Fetch chat history
  useEffect(() => {
    if (!userId || !user) return;

    const fetchMessages = async () => {
      const res = await fetch(
        `/api/messages?userId=${userId}&otherUserId=${user.id}`
      );
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, [user, userId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message
  const handleSend = async (content: string) => {
    if (!userId || !user) return;

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: userId, receiverId: user.id, content }),
    });

    const data = await res.json();
    if (!data.ok) return alert("Failed to send");

    // Emit message via socket
    socket?.emit("sendMessage", {
      ...data,
      senderId: userId,
      receiverId: user.id,
    });
  };
// Inside ConversationDetail.tsx
const handleUnsend = async (messageId: string) => {
  if (!userId || !user) return;

  try {
    const res = await fetch("/api/messages/unsent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, senderId: userId }),
    });

    const data = await res.json();
    if (!data.ok) return alert(data.error || "Failed to unsend");

    // Update local state (User 1 POV)
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, content: "This message was removed", isUnsent: true }
          : m
      )
    );

    // Emit to backend so **both users** get the update
    socket?.emit("unsendMessage", {
      id: messageId,
      senderId: userId,
      receiverId: user.id, // chat partner
    });
  } catch (err) {
    console.error(err);
    alert("Failed to unsend message");
  }
};



// Listen for unsent messages from socket
// useEffect(() => {
//   if (!socket) return;

//   const handleUnsent = (msg: any) => {
//     setMessages((prev) =>
//       prev.map((m) =>
//         m.id === msg.id
//           ? { ...m, content: "This message was unsent", isUnsent: true }
//           : m
//       )
//     );
//   };

//   socket.on("message:unsent", handleUnsent);

//   return () => {
//     socket.off("message:unsent", handleUnsent);
//   };
// }, []);
// useEffect(() => {
//   if (!socket) return;

//   const handleUnsent = (msg: any) => {
//     setMessages((prev) =>
//       prev.map((m) =>
//         m.id === msg.id
//           ? { ...m, content: "This message was removed", isUnsent: true }
//           : m
//       )
//     );
//   };

//   socket.on("message:unsent", handleUnsent);

//   return () => socket.off("message:unsent", handleUnsent);
// }, []);
// useEffect(() => {
//   if (!socket) return;

//   const handleUnsent = (msg: any) => {
//     console.log("Received unsent:", msg); // <-- add this
//     setMessages((prev) =>
//       prev.map((m) =>
//         m.id === msg.id
//           ? { ...m, content: msg.content, isUnsent: true }
//           : m
//       )
//     );
//   };

//   socket.on("message:unsent", handleUnsent);

//   return () => socket.off("message:unsent", handleUnsent);
// }, [socket]);

useEffect(() => {
  // if (!socket) return;
    if (!socket) return () => {}; // return an empty cleanup function


  const handleUnsent = (msg: UnsentMessageEvent) => {
    console.log("Received unsent:", msg);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id
          ? { ...m, content: msg.content, isUnsent: true }
          : m
      )
    );
  };

  socket.on("message:unsent", handleUnsent);

  // Capture current socket so cleanup is safe
  const currentSocket = socket;

  return () => currentSocket.off("message:unsent", handleUnsent);
}, [socket]);



  if (!user)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chat
      </div>
    );

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-100">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 font-semibold">
        {user.username}
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-3"
      >
        {/* {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            sender={msg.senderName}
            content={msg.content}
            avatar={msg.avatar}
          />
        ))} */}
        <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
  {messages.map((msg) => (
    // <MessageItem
    //   key={msg.id}
    //   sender={msg.senderName}
    //   content={msg.content}
    //   avatar={msg.avatar}
    //   messageId={msg.id}
    //   isUnsent={msg.isUnsent}
    //   onUnsend={handleUnsend}
    // />
    <MessageItem
  key={msg.id}
  sender={msg.senderName}       // "You" or other user
  content={msg.content}         // message text
  avatar={msg.avatar}           // optional avatar
  messageId={msg.id}            // needed to identify message for unsend
  isUnsent={msg.isUnsent}       // boolean, true if message was unsent
  onUnsend={handleUnsend}       // function to call when "Unsend" clicked
              // online={msg.online}

  
/>

  ))}
</div>

      </div>
{/* <div className="px-4 py-1 text-sm text-gray-500 italic">
  {typingUsers.length > 0 && `${typingUsers.join(", ")} is typing...`}
</div> */}
{/* {typingUsers.length > 0 && (
  <div className="px-4 py-1 text-sm text-gray-500 italic">
    {typingUsers.join(", ")} is typinggg...
  </div>
)} */}
{typingUsers.length > 0 && (
  <div className="px-4 py-1 text-sm text-gray-500 italic flex items-center space-x-1">
    <span>{typingUsers.join(", ")} is typing</span>
    <span className="typing-dots">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  </div>
)}

      {/* Input */}
      <div className="sticky bottom-0 w-full bg-white border-t">
        {/* <MessageInput onSend={handleSend} /> */}
        {/* <MessageInput onSend={handleSend} onTyping={handleTyping} /> */}
        <MessageInput
  onSend={handleSend}
  onTyping={(isTyping) => {
    if (!userId || !user) return;
    if (isTyping) {
      socket?.emit("typing:start", {
        senderId: userId,
        receiverId: user.id,
        senderName: firstname || email,
      });
    } else {
      socket?.emit("typing:stop", {
        senderId: userId,
        receiverId: user.id,
        senderName: firstname || email,
      });
    }
  }}
/>


      </div>
    </div>
  );
};

export default ConversationDetail;
