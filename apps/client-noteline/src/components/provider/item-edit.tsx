'use client';

import React from 'react';
import { useItemEdit } from '@/hooks/edit';
import { ItemEditContext } from '../contexts/item-edit';

export default function ItemEdit({ children }: { children: React.ReactNode }) {
  const value = useItemEdit();

  return (
    <ItemEditContext.Provider value={value}>
      {children}
    </ItemEditContext.Provider>
  );
}
