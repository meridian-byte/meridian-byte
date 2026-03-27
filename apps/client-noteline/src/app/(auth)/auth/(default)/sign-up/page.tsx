/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import FormAuth from '@/components/form/auth';
import { AuthAction } from '@repo/types/enums';

export const metadata: Metadata = { title: 'Sign Up' };

export default function SignUp() {
  return (
    <LayoutPage>
      <FormAuth
        action={AuthAction.SIGN_UP}
        header={{
          title: 'Create Your Account!',
          desc: 'Join us and start your journey today.',
        }}
      />
    </LayoutPage>
  );
}
