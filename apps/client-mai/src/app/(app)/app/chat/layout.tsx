import React from 'react';
import LayoutBody from '@repo/components/layout/body';

export interface typeParams {
  chatId: string;
}

export default function LayoutChat({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
