import { createContext, useContext, RefObject } from 'react';

// RefObject<HTMLDivElement | null> is the correct type
type ScrollContextType = RefObject<HTMLDivElement | null>;

export const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScrollArea = () => {
  const context = useContext(ScrollContext);
  if (!context)
    throw new Error('useScrollArea must be used within ScrollProvider');
  return context;
};
