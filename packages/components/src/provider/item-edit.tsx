'use client';

import React from 'react';
import { useItemEdit } from '@repo/hooks/edit';
import { ItemEditContext } from '@repo/hooks/contexts/item-edit';

export default function ItemEdit({ children }: { children: React.ReactNode }) {
  const value = useItemEdit();

  return (
    <ItemEditContext.Provider value={value}>
      {children}
    </ItemEditContext.Provider>
  );
}
