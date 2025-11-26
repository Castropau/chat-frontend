// import React from "react";

// interface Props {
//   id: string;
//   name: string;
//   avatar: string;
//   lastMessage?: string;
//   onClick?: () => void;
// }

// const ConversationItem: React.FC<Props> = ({ name, avatar, lastMessage, onClick }) => {
//   return (
//     <div
//       className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
//       onClick={onClick}
//     >
//       <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
//       <div className="flex-1">
//         <p className="font-medium text-gray-900">{name}</p>
//         {lastMessage && <p className="text-sm text-gray-500">{lastMessage}</p>}
//       </div>
//     </div>
//   );
// };

// export default ConversationItem;
// import React from "react";

// interface Props {
//   id: string | number;
//   name: string;
//   avatar: string;
//   lastMessage?: string;
//   onClick?: () => void;
// }

// const ConversationItem: React.FC<Props> = ({ name, avatar, lastMessage, onClick }) => {
//   return (
//     <div
//       className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
//       onClick={onClick}
//     >
//       <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
//       <div className="flex-1">
//         <p className="font-medium text-gray-900">{name}</p>
//         {lastMessage && <p className="text-sm text-gray-500">{lastMessage}</p>}
//       </div>
//     </div>
//   );
// };

// export default ConversationItem;
import React from "react";
import Image from "next/image";
interface Props {
  id: string | number;
  name: string;
  avatar: string;
  online?: number; // 1 = online, 0 = offline
  lastMessage?: string;
  onClick?: () => void;
}

const ConversationItem: React.FC<Props> = ({ name, avatar, online = 0, lastMessage, onClick }) => {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <Image 
      src={avatar}
       alt={name} 
       className="w-10 h-10 rounded-full object-cover" 
        width={40}
        height={40}
       />
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">{name}</p>
          {/* Online/offline indicator */}
          <span
            className={`w-3 h-3 rounded-full ${
              online === 1 ? "bg-blue-500" : "bg-red-500"
            }`}
          />
        </div>
        {lastMessage && <p className="text-sm text-gray-500">{lastMessage}</p>}
      </div>
    </div>
  );
};

export default ConversationItem;
