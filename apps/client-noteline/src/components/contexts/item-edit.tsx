'use client';

import { useItemEdit } from '@/hooks/edit';
import { createContext, useContext } from 'react';

type ItemEditContextType = ReturnType<typeof useItemEdit> | null;

export const ItemEditContext = createContext<ItemEditContextType>(null);

export const useItemEditContext = () => {
  const ctx = useContext(ItemEditContext);

  if (!ctx) {
    throw new Error('useItemEditContext must be used within <ItemEdit>');
  }

  return ctx;
};
