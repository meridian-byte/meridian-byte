import React from 'react';
import { Metadata } from 'next';
import LayoutBody from '@repo/components/layout/body';
import { companyName } from '@repo/constants/app';

export type typeParams = Promise<{
  'postTitle-postId': string;
}>;

export const metadata: Metadata = {
  title: { default: 'Blog', template: `%s - Blog - ${companyName}` },
};

export default function LayoutBlog({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
