import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import IntroPage from '@repo/components/layout/intros/page';
import { companyName } from '@repo/constants/app';

export const metadata: Metadata = { title: 'About' };

export default function About() {
  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `About ${companyName}`,
          title: 'Empowering the World to Design',
          desc: `We are ${companyName}, a Digital Product Design & Branding Agency. As a team of Designers, Business Analysts, Strategists, Content Writers, and Project Managers, we collaborate on a result-oriented design process.`,
        }}
      />
    </LayoutPage>
  );
}
