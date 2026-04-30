/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import PartialListingHome from '@/components/partial/page/app/home';

export default function Home() {
  return (
    <LayoutPage>
      <LayoutSection id={'app-home-content'} padded containerized={'sm'}>
        <PartialListingHome />
      </LayoutSection>
    </LayoutPage>
  );
}
