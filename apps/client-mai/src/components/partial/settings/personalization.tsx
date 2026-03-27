'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import {
  Anchor,
  Divider,
  Group,
  Skeleton,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import React from 'react';
import ModalCustomization from '@/components/common/modals/customization';
import appData from '@/data/app';
import { useAppSelector } from '@/hooks/redux';

export default function Personalization() {
  const customizations = useAppSelector((state) => state.customizations.value);

  return (
    <Stack fz={'sm'} gap={'xl'}>
      <Stack gap={'xs'}>
        <Title order={3} fz={'sm'}>
          Customization
        </Title>

        <Divider />

        <ModalCustomization>
          <Group justify="space-between">
            <Text inherit>Custom instructions</Text>

            <Group gap={'xs'}>
              {customizations == null ? (
                <Skeleton h={16} w={24} />
              ) : (
                <Text inherit fz={'xs'} mt={3}>
                  {customizations[0]?.active ? 'On' : 'Off'}
                </Text>
              )}

              <IconChevronRight
                size={ICON_SIZE / 1.25}
                stroke={ICON_STROKE_WIDTH / 1.25}
              />
            </Group>
          </Group>
        </ModalCustomization>
      </Stack>

      <Stack gap={'xs'}>
        <Title order={3} fz={'sm'}>
          Memory
        </Title>

        <Divider />

        <Group justify="space-between" align="start" wrap="nowrap">
          <div>
            <Text inherit>Reference saved memories</Text>
            <Text inherit fz={'xs'} c={'dimmed'}>
              Let {appData.name.app} save and use memories when responding.
            </Text>
            <Anchor inherit fz={'xs'} c={'dimmed'} underline="always">
              Manage memories
            </Anchor>
          </div>

          <Switch aria-label="memory" color="black" defaultChecked={true} />
        </Group>
      </Stack>
    </Stack>
  );
}
