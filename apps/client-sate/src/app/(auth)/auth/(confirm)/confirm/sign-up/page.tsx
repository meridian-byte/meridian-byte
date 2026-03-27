/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import { ConfirmSignUp as PartialConfirmSignUp } from '@/components/partial/page/confirm';

export const metadata: Metadata = { title: 'Confirm Sign Up' };

export default function SignUp() {
  return (
    <LayoutPage>
      <PartialConfirmSignUp />
    </LayoutPage>
  );
}
