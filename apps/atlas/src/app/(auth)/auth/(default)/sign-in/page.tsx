import React from 'react';
import { Metadata } from 'next';
import FormAuth from '@atlas/ui/form/auth';
import { AuthAction } from '@repo/types';
import { getBaseUrl } from '@repo/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Sign In' };

export default async function SignIn() {
  return (
    <div>
      <FormAuth
        action={AuthAction.SIGN_IN}
        header={{
          title: 'Welcome Back!',
          desc: 'Sign in to access your personalized experience.',
        }}
        baseUrl={(await getBaseUrl()).ATLAS}
      />
    </div>
  );
}
