// SearchInput.tsx
import React from "react";
import Image from "next/image";
interface User {
  id: string;
  username: string;
  image?: string;
}

interface SearchInputProps {
  search: string;
  users: User[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectUser: (user: User) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ search, users, onSearchChange, onSelectUser }) => {
  return (
    <div className="p-2">
      <input
        type="text"
        value={search}
        onChange={onSearchChange}
        placeholder="Search users..."
        className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {search.trim() && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg">
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center gap-2">
                  <Image
                   src={user.image || "https://i.pravatar.cc/40"} 
                   alt={user.username} 
                   className="w-8 h-8 rounded-full" 
                    width={32}
                    height={32}
                   />
                  <span>{user.username}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
