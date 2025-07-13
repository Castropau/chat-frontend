
"use client";
import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Image from 'next/image';

const ConversationDetail: React.FC = () => {
  const activeUser = {
    name: 'Alice',
    avatar: 'https://i.pravatar.cc/40?u=alice',
    status: 'Online',
    email: 'alice@example.com',
    phone: '+1 234 567 8901',
    lastSeen: '2 hours ago',
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nickname, setNickname] = useState(activeUser.name);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // Selected tab state
  const [activeTab, setActiveTab] = useState<'images' | 'links' | 'videos' | 'more'>('images');

  // Image preview handlers (you can expand this to a modal/lightbox if you want)
  const openPreview = (index: number) => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);

  const showPrev = () => {
    if (previewIndex === null) return;
    setPreviewIndex((previewIndex - 1 + sentImage.length) % sentImage.length);
  };

  const showNext = () => {
    if (previewIndex === null) return;
    setPreviewIndex((previewIndex + 1) % sentImage.length);
  };

  // Dummy content arrays
  const sentImage = [
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
  ];

  const links = ['https://openai.com', 'https://reactjs.org'];

  const videos = ['https://www.w3schools.com/html/mov_bbb.mp4']; // sample video URL

  return (
    <div className="flex flex-1 h-full bg-gray-100">
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white shadow-sm px-4 py-3">
          <ChatHeader name={activeUser.name} avatar={activeUser.avatar} status={activeUser.status} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className="p-2 rounded hover:bg-gray-200"
          >
            {sidebarOpen ? (
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M12 4v16" />
              </svg>
            )}
          </button>
        </div>

        {/* Messages & Input */}
        <MessageList />
        <MessageInput />
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto flex flex-col">
          {/* Profile Section */}
          <div className="flex items-center space-x-3 mb-6">
            <img src={activeUser.avatar} alt={activeUser.name} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold text-gray-900">{activeUser.name}</p>
              <p className="text-sm text-gray-500">{activeUser.status}</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <nav className="mb-4 flex space-x-2 border-b border-gray-200">
            {['images', 'links', 'videos', 'more'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 text-center text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'images' && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Images Sent</h3>
                <div className="flex space-x-2 overflow-x-auto">
                  {sentImage.map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      alt={`Image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => openPreview(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'links' && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Shared Links</h3>
                <ul className="text-sm text-blue-600 space-y-1">
                  {links.map((link, i) => (
                    <li key={i}>
                      <a href={link} target="_blank" rel="noreferrer" className="hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'videos' && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Shared Videos</h3>
                {videos.length > 0 ? (
                  videos.map((videoUrl, i) => (
                    <video key={i} src={videoUrl} controls className="w-full rounded mb-2" />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No videos shared yet.</p>
                )}
              </div>
            )}

            {activeTab === 'more' && (
              <div>
                <h3 className="text-sm font-semibold mb-2">More Options</h3>

                {/* Nickname edit */}
                <div className="mb-4">
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Change Nickname
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Contact info */}
                <div className="mb-4 text-sm text-gray-600">
                  <p>
                    <strong>Email:</strong> {activeUser.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {activeUser.phone}
                  </p>
                  <p>
                    <strong>Last Seen:</strong> {activeUser.lastSeen}
                  </p>
                </div>

                {/* Mute Notifications */}
                <div className="mb-4 flex items-center">
                  <input
                    id="muteNotifications"
                    type="checkbox"
                    className="mr-2"
                    onChange={() => alert('Toggle mute notifications')}
                  />
                  <label htmlFor="muteNotifications" className="text-sm text-gray-700">
                    Mute Notifications
                  </label>
                </div>

                {/* Block User button */}
                <button
                  onClick={() => alert('User blocked')}
                  className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Block User
                </button>
              </div>
            )}
          </div>

          {/* Image Preview Modal */}
          {previewIndex !== null && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              onClick={closePreview}
            >
              <div
                className="relative bg-white rounded shadow-lg max-w-lg max-h-full p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={sentImage[previewIndex]}
                  alt={`Preview ${previewIndex + 1}`}
                  className="max-w-full max-h-[80vh] rounded"
                />
                {/* Navigation */}
                <button
                  onClick={showPrev}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={showNext}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                  aria-label="Next image"
                >
                  ›
                </button>
                {/* Close */}
                <button
                  onClick={closePreview}
                  className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold text-xl"
                  aria-label="Close preview"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationDetail;
