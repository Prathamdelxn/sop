// context/RolesContext.js
'use client';
import { createContext, useContext, useState } from 'react';

const RolesContext = createContext();

export function RolesProvider({ children }) {
  const [dynamicSidebarItems, setDynamicSidebarItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  return (
    <RolesContext.Provider value={{ 
      dynamicSidebarItems, 
      setDynamicSidebarItems,
      isLoadingItems,
      setIsLoadingItems
    }}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  return useContext(RolesContext);
}