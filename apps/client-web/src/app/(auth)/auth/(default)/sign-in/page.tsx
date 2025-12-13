/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Metadata } from 'next';
import { Stack, Text } from '@mantine/core';
import LayoutPage from '@repo/components/layout/page';
import FormAuth from '@/components/form/auth';
import { AUTH_URLS } from '@/data/constants';
import { AuthAction } from '@repo/types/enums';
import AnchorNextLink from '@repo/components/common/anchor/next-link';

export const metadata: Metadata = { title: 'Sign In' };

export default function SignIn() {
  return (
    <LayoutPage>
      <Stack>
        <FormAuth
          action={AuthAction.SIGN_IN}
          header={{
            title: 'Welcome Back!',
            desc: 'Sign in to access your personalized experience.',
          }}
        />

        <Text fz={'xs'} ta={'center'}>
          Don&apos;t have an account?{' '}
          <AnchorNextLink
            inherit
            fw={500}
            href={AUTH_URLS.SIGN_UP}
            underline="hover"
          >
            Sign Up
          </AnchorNextLink>
        </Text>
      </Stack>
    </LayoutPage>
  );
}
