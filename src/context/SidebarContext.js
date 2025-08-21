'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [dynamicSidebarItems, setDynamicSidebarItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Function to update sidebar items
  const updateSidebarItems = (newItems) => {
    setDynamicSidebarItems(newItems);
  };

  // Function to add a single item
  const addSidebarItem = (newItem) => {
    setDynamicSidebarItems(prev => [...prev, newItem]);
  };

  // Function to remove an item
  const removeSidebarItem = (itemTitle) => {
    setDynamicSidebarItems(prev => 
      prev.filter(item => item.title !== itemTitle)
    );
  };

  // Function to update an item
  const updateSidebarItem = (oldTitle, updatedItem) => {
    setDynamicSidebarItems(prev => 
      prev.map(item => item.title === oldTitle ? updatedItem : item)
    );
  };

  return (
    <SidebarContext.Provider value={{
      dynamicSidebarItems,
      isLoadingItems,
      updateSidebarItems,
      addSidebarItem,
      removeSidebarItem,
      updateSidebarItem,
      setIsLoadingItems
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};