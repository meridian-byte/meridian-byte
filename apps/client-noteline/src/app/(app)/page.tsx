/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import LayoutPage from '@repo/components/layout/page';
import PartialPageHome from '@/components/partial/page/home';

export default function Home() {
  return (
    <LayoutPage>
      <PartialPageHome />
    </LayoutPage>
  );
}
