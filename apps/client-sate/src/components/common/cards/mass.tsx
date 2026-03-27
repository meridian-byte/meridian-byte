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
import { formatNumber } from '@/utilities/number';
import { COLOR_CODES } from '@repo/constants/other';

export default function Mass({ props }: { props: MassGet }) {
  const timeOfMeasurement = getRegionalDate(props.created_at);

  const massPercentages = getMassPercentages(props);

  return (
    <Card radius={0} bg={'transparent'} padding={0} py={5}>
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={2}>
          <Title order={3} fz={'md'} fw={'normal'} lineClamp={1}>
            {timeOfMeasurement.date},{' '}
            <Text component="span" inherit c={'dimmed'} fz={'sm'}>
              {timeOfMeasurement.time.toUpperCase()}
            </Text>
          </Title>

          <Group fz={{ base: 'xs', xs: 'sm' }} c={'dimmed'}>
            <Text inherit lineClamp={1}>
              <Text component="span" inherit>
                <Text
                  component="span"
                  inherit
                  c={`${COLOR_CODES.MASSES.FAT}.6`}
                >
                  <NumberFormatter value={props.fat} />
                </Text>{' '}
                Kg{' '}
                <Text component="span" inherit fz={'xs'}>
                  ({formatNumber(massPercentages.fat)}%)
                </Text>
              </Text>
              ,{' '}
              <Text component="span" inherit>
                <Text
                  component="span"
                  inherit
                  c={`${COLOR_CODES.MASSES.MUSCLE}.6`}
                >
                  <NumberFormatter value={props.muscle} />
                </Text>{' '}
                Kg{' '}
                <Text component="span" inherit fz={'xs'}>
                  ({formatNumber(massPercentages.muscle)}%)
                </Text>
              </Text>
            </Text>
          </Group>
        </Stack>

        <Stack align="end" ta={'end'} gap={0}>
          <Text inherit fz={{ base: 'sm', xs: 'md' }}>
            <NumberFormatter value={props.weight} /> Kg
          </Text>

          <Text component="span" inherit fz={'xs'} c={'dimmed'}>
            BMI:{' '}
            <Text
              component="span"
              inherit
              c={`${COLOR_CODES.MASSES.BMI}.6`}
              fz={'sm'}
            >
              <NumberFormatter value={props.bmi} />
            </Text>
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

const getMassPercentages = (params: MassGet) => {
  const fat = (params.fat / params.weight) * 100;
  const muscle = (params.muscle / params.weight) * 100;

  return { fat, muscle };
};
