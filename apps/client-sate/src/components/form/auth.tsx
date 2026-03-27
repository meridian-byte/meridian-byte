'use client';

import React from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridCol,
  Overlay,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import AuthProviders from '@/components/common/buttons/auth-providers';
import { useFormAuth } from '@/hooks/form/auth/auth';
import { AuthAction } from '@repo/types/enums';

export default function Auth({
  action,
  header,
}: {
  action: AuthAction;
  header?: {
    title: string;
    desc: string;
  };
}) {
  const { form, submitted, handleSubmit } = useFormAuth({ action });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack>
        {header && <AuthHeader title={header.title} desc={header.desc} />}

        <Grid>
          <GridCol span={{ base: 12, sm: 12 }}>
            <TextInput
              required
              aria-label="Email"
              placeholder="Email"
              {...form.getInputProps('email')}
            />
          </GridCol>

          <GridCol span={12}>
            <Button fullWidth type="submit" loading={submitted}>
              {action === AuthAction.SIGN_IN ? 'Sign In' : 'Sign Up'}
            </Button>
          </GridCol>
        </Grid>

        <Divider label="or" />

        <Box pos={'relative'}>
          {submitted && (
            <Overlay zIndex={1000} radius={'lg'} backgroundOpacity={0.05} />
          )}

          <AuthProviders />
        </Box>
      </Stack>
    </form>
  );
}

const AuthHeader = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <>
      <Container>
        <Stack gap={'xs'}>
          <Title order={1} fz={'lg'} ta={'center'}>
            {title}
          </Title>

          <Text ta={'center'} fz={'sm'}>
            {desc}
          </Text>
        </Stack>
      </Container>
    </>
  );
};
