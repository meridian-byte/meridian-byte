/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import LayoutPage from '@repo/components/layout/page';
import LayoutBody from '@repo/components/layout/body';
import AffixNavbar from '@repo/components/common/affixi/navbar';
import LayoutSection from '@repo/components/layout/section';
import { Center } from '@mantine/core';
import NextLink from '@repo/components/common/anchor/next-link';

export default function Home() {
  return (
    <HomeLayout>
      <LayoutSection id="home">
        <Center mih={'100vh'}>
          <NextLink href="/app">Go to App</NextLink>
        </Center>
      </LayoutSection>
    </HomeLayout>
  );
}

async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutBody>
      <LayoutPage>
        <main>{children}</main>

        <AffixNavbar />
      </LayoutPage>
    </LayoutBody>
  );
}
