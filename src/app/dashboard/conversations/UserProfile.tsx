import React from 'react';

const UserProfile: React.FC = () => {
  const user = {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/40?u=john.doe',
    status: 'Online',
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 bg-white">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover mr-3"
      />
      <div>
        <h2 className="text-sm font-medium text-gray-900">{user.name}</h2>
        <span className="text-xs text-green-600">{user.status}</span>
      </div>
    </div>
  );
};

export default UserProfile;
