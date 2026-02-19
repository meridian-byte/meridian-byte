/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import LayoutPage from '@repo/components/layout/page';
import FormAuth from '@repo/components/form/auth';
import { AuthAction } from '@repo/types/enums';

export const metadata: Metadata = { title: 'Sign In' };

export default function SignIn() {
  return (
    <LayoutPage>
      <FormAuth
        action={AuthAction.SIGN_IN}
        header={{
          title: 'Welcome Back!',
          desc: 'Sign in to access your personalized experience.',
        }}
      />
    </LayoutPage>
  );
}
