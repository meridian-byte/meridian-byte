import React from 'react';
import LayoutPage from '@repo/components/layout/page';
import IntroPage from '@repo/components/layout/intros/page';
import PartialPageBlog from '@/components/partial/page/blog';

export default async function Blog() {
  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: 'News',
          title: 'Expert Web Design Advice',
          desc: 'Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam. Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.',
        }}
      />

      <PartialPageBlog />
    </LayoutPage>
  );
}
