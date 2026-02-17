/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import LayoutPage from '@repo/components/layout/page';
import LayoutBody from '@repo/components/layout/body';
import PartialPageHome from '@/components/partial/page/home';

export default function Home() {
  return (
    <HomeLayout>
      <PartialPageHome />
    </HomeLayout>
  );
}

async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutBody>
      <LayoutPage>
        <main>{children}</main>
      </LayoutPage>
    </LayoutBody>
  );
}
