'use client';

import {
  Text,
  Title,
  Badge,
  Stack,
  ThemeIcon,
  Anchor,
  Card,
  Box,
  Center,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconServerBolt } from '@tabler/icons-react';
import LayoutSection from '@repo/components/layout/section';

export default function Home() {
  const apiStatus = 'online'; // could be dynamic in future
  const version = 'v1.0';
  const lastDeployment = '2026-02-17 10:00 UTC';
  const rootSiteLink = 'meridianbyte.com';

  const statusColor = apiStatus === 'online' ? 'green' : 'red';

  return (
    <LayoutSection id="home">
      <Center ta={'center'} mih={'100vh'}>
        <Card bg={'var(--mantine-color-body)'} padding={0}>
          <div>
            <Title
              order={1}
              mb="xs"
              fz={{ base: '1.5rem', sm: 'var(--mantine-h1-font-size)' }}
            >
              API.meridianbyte.com
            </Title>

            <Text
              inherit
              size="lg"
              mb="xl"
              c="dimmed"
              fz={{ base: 'sm', sm: 'md' }}
            >
              Fast, reliable, always up
            </Text>

            <Stack align="center" gap="sm" mb="xl">
              <ThemeIcon
                size={ICON_WRAPPER_SIZE * 2}
                color={`${statusColor}.6`}
                c={'var(--mantine-color-body)'}
                radius={99}
                variant="filled"
              >
                <IconServerBolt
                  size={ICON_SIZE * 2}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ThemeIcon>

              <Text inherit fw={500} size="lg">
                {apiStatus.toUpperCase()}
              </Text>
            </Stack>

            <Stack gap={'xs'} align="center">
              <Badge variant="outline" color="dark">
                Version: {version}
              </Badge>

              <Badge color="dark">Last deployment: {lastDeployment}</Badge>
            </Stack>

            <Text inherit size="sm" mt="xl" c="dimmed">
              Back to main site:{' '}
              <Anchor inherit href={`https://${rootSiteLink}`} c={'dark.1'}>
                {rootSiteLink}
              </Anchor>
            </Text>
          </div>
        </Card>
      </Center>
    </LayoutSection>
  );
}
