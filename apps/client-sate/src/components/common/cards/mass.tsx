'use client';

import React from 'react';
import {
  Card,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { MassGet } from '@repo/types/models/mass';
import { getRegionalDate } from '@repo/utilities/date-time';

export default function Mass({ props }: { props: MassGet }) {
  const timeOfMeasurement = getRegionalDate(props.created_at);

  return (
    <Card radius={0} bg={'transparent'} padding={0} py={5}>
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={2}>
          <Title order={3} fz={'md'} fw={'normal'} lineClamp={1}>
            {timeOfMeasurement.date},{' '}
            <Text component="span" inherit c={'dimmed'}>
              {timeOfMeasurement.time}
            </Text>
          </Title>

          <Group fz={{ base: 'xs', xs: 'sm' }} c={'dimmed'}>
            <Text inherit lineClamp={1}>
              <Text component="span" inherit>
                Fat:{' '}
                <Text component="span" inherit c={'blue.6'}>
                  <NumberFormatter value={props.fat} />
                </Text>{' '}
                Kg
              </Text>
              ,{' '}
              <Text component="span" inherit>
                Muscle:{' '}
                <Text component="span" inherit c={'green.6'}>
                  <NumberFormatter value={props.muscle} />
                </Text>{' '}
                Kg
              </Text>
              ,{' '}
              <Text component="span" inherit>
                Water:{' '}
                <Text component="span" inherit c={'yellow.6'}>
                  <NumberFormatter value={props.water} />
                </Text>{' '}
                Kg
              </Text>
            </Text>
          </Group>
        </Stack>

        <Group justify="end" ta={'end'}>
          <Text inherit fz={{ base: 'sm', xs: 'md' }}>
            <NumberFormatter value={props.weight} /> Kg
          </Text>
        </Group>
      </Group>
    </Card>
  );
}
