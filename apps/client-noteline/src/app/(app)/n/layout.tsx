import React from 'react';
import { Metadata } from 'next';
import LayoutMain from '@repo/components/layout/main';
import { APP_NAME } from '@repo/constants/app';

export interface typeParams {
  'noteTitle-noteId': string;
}

export const metadata: Metadata = {
  title: { default: 'Notes', template: `%s - ${APP_NAME.NOTELINE}` },
};

export default function LayoutNotes({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
