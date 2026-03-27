/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import { ConfirmSignIn as PartialConfirmSignIn } from '@/components/partial/page/confirm';

export const metadata: Metadata = { title: 'Confirm Sign In' };

export default function SignIn() {
  return (
    <LayoutPage>
      <PartialConfirmSignIn />
    </LayoutPage>
  );
}
