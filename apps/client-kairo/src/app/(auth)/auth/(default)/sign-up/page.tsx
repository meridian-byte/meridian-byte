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

export const metadata: Metadata = { title: 'Sign Up' };

export default function SignUp() {
  return (
    <LayoutPage>
      <Stack>
        <FormAuth
          action={AuthAction.SIGN_UP}
          header={{
            title: 'Create Your Account!',
            desc: 'Join us and start your journey today.',
          }}
        />

        <Text fz={'xs'} ta={'center'}>
          Already have an account?{' '}
          <AnchorNextLink
            inherit
            fw={500}
            href={AUTH_URLS.SIGN_IN}
            underline="hover"
          >
            Sign In
          </AnchorNextLink>
        </Text>
      </Stack>
    </LayoutPage>
  );
}
