'use client';

import React from 'react';
import { useStorePost } from '@/libraries/zustand/stores/post';
import LayoutSection from '@repo/components/layout/section';

export default function Blog() {
  const { posts } = useStorePost();

  return (
    <LayoutSection id={'page-blog-grid'} margined>
      <div>{JSON.stringify(posts)}</div>
    </LayoutSection>
  );
}
