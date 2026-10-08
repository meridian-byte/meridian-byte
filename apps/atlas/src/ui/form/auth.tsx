'use client';

import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import AuthProviders from '../button/auth-providers';
import { useFormAuth } from '@repo/hooks';
import { AuthAction } from '@repo/types';
import {
  IconBackspace,
  IconCircleX,
  IconInfoCircle,
  IconMail,
  IconPassword,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { isProduction, setCookieClient } from '@repo/utils';
import { COOKIE_NAME } from '@repo/constants';

export default function Auth({
  action,
  baseUrl,
  header,
}: {
  action: AuthAction;
  baseUrl: string;
  header?: {
    title: string;
    desc: string;
  };
}) {
  const { form, submitted, submitOps, step, display, setDisplay } = useFormAuth({
    action,
    baseUrl,
  });

  const hideOauth = step == 'otp' || (form.values.email && submitted);

  return (
    <Stack>
      <form noValidate>
        <Stack>
          {header && <AuthHeader title={header.title} desc={header.desc} />}

          <Box display={hideOauth ? 'none' : undefined}>
            <AuthProviders props={{ baseUrl }} />
          </Box>

          <Divider label="or" display={hideOauth ? 'none' : undefined} />

          <Grid>
            <GridCol span={{ base: 12, sm: 12 }}>
              <TextInput
                required
                aria-label="Email Address"
                placeholder="Email Address"
                variant="filled"
                styles={{
                  input: {
                    textAlign: 'center',
                    backgroundColor:
                      'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
                  },
                  error: { textAlign: 'center' },
                }}
                disabled={step == 'otp'}
                leftSection={
                  <ThemeIcon
                    color="gray"
                    c={'dimmed'}
                    variant="transparent"
                    size={ICON_WRAPPER_SIZE}
                  >
                    <IconMail size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ThemeIcon>
                }
                rightSection={
                  <Tooltip label={'Clear email'} disabled={!form.values.email?.trim().length}>
                    <ActionIcon
                      color="red.6"
                      variant="transparent"
                      size={ICON_WRAPPER_SIZE}
                      display={step == 'email' ? undefined : 'none'}
                      disabled={submitted}
                      onClick={() => {
                        setCookieClient(COOKIE_NAME.AUTH.EMAIL, '', {
                          expiryInSeconds: 10,
                          secure: isProduction(),
                          sameSite: 'Lax',
                        });
                        setDisplay(null);
                        form.reset();
                      }}
                      style={{
                        transition: '.25s all ease',
                        opacity: form.values.email?.trim().length ? 1 : 0,
                      }}
                    >
                      <IconBackspace size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                    </ActionIcon>
                  </Tooltip>
                }
                {...form.getInputProps('email')}
              />
            </GridCol>

            <GridCol span={12} display={step == 'email' ? undefined : 'none'}>
              <Button
                fullWidth
                loading={submitted}
                onClick={async () => {
                  await submitOps.submitEmail(form.getValues());
                }}
              >
                {action === AuthAction.SIGN_IN ? 'Sign In' : 'Sign Up'}
              </Button>
            </GridCol>

            <GridCol span={{ base: 12, sm: 12 }} display={step == 'otp' ? undefined : 'none'}>
              <TextInput
                required
                aria-label="Otp"
                placeholder="********"
                maxLength={8}
                variant="filled"
                inputMode="numeric"
                styles={{
                  input: {
                    textAlign: 'center',
                    letterSpacing: 5,
                    backgroundColor:
                      'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
                  },
                  error: { textAlign: 'center' },
                }}
                disabled={step == 'otp' && submitted}
                leftSection={
                  <ThemeIcon
                    color="gray"
                    c={'dimmed'}
                    variant="transparent"
                    size={ICON_WRAPPER_SIZE}
                  >
                    <IconPassword size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ThemeIcon>
                }
                rightSection={
                  <Tooltip label={'Clear OTP'} disabled={!form.values.otp?.trim().length}>
                    <ActionIcon
                      color="red.6"
                      variant="transparent"
                      size={ICON_WRAPPER_SIZE}
                      display={step == 'otp' && !submitted ? undefined : 'none'}
                      disabled={submitted}
                      onClick={() => form.setFieldValue('otp', '')}
                      style={{
                        transition: '.25s all ease',
                        opacity: form.values.otp?.trim().length ? 1 : 0,
                      }}
                    >
                      <IconBackspace size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                    </ActionIcon>
                  </Tooltip>
                }
                {...form.getInputProps('otp')}
              />
            </GridCol>

            <GridCol span={12} display={step == 'otp' ? undefined : 'none'}>
              <Group grow>
                <Button
                  variant="light"
                  color="gray"
                  disabled={submitted}
                  onClick={async () => {
                    await submitOps.submitEmail(form.getValues(), { resend: true });
                  }}
                >
                  {'Resend'}
                </Button>

                <Button
                  loading={submitted}
                  onClick={async () => {
                    await submitOps.submitOtp(form.getValues());
                  }}
                >
                  {'Confirm'}
                </Button>
              </Group>
            </GridCol>
          </Grid>
        </Stack>
      </form>

      <Box
        style={{
          transition: '.25s all ease',
          height: !display ? 0 : 77,
          overflow: 'hidden',
          opacity: !display ? 0 : 1,
        }}
      >
        <Alert
          p={'xs'}
          style={{ transition: '.25s all ease' }}
          display={display ? undefined : 'none'}
          variant="light"
          color={display?.error ? 'red' : 'blue'}
          title={undefined}
          icon={
            display?.error ? (
              <IconCircleX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            ) : (
              <IconInfoCircle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            )
          }
        >
          {display?.error || display?.message}
        </Alert>
      </Box>
    </Stack>
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
