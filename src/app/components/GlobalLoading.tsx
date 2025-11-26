"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalLoadingContextType {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

export const useGlobalLoading = () => useContext(GlobalLoadingContext);

export const GlobalLoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-2">
            <div className="loader border-4 border-rose-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            <p className="text-gray-700 font-semibold">Logging out...</p>
          </div>
        </div>
      )}
    </GlobalLoadingContext.Provider>
  );
};
