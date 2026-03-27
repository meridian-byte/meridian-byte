'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreServing } from '@/libraries/zustand/stores/serving';
import {
  ActionIcon,
  Center,
  Divider,
  Group,
  Loader,
  NumberFormatter,
  Progress,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import CardServing from '@/components/common/cards/serving';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalServingCrud from '@/components/common/modals/serving/crud';
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from '@tabler/icons-react';
import ModalEatCrud from '@/components/common/modals/eat/crud';
import IndicatorNetworkStatus from '@/components/common/indicators/network-status';
import { useStoreEat } from '@/libraries/zustand/stores/eat';
import { useEatTotals } from '@/hooks/nutrients';
import { DiaryDateReturnType, useDiaryDate } from '@/hooks/diary';
import { DateInput } from '@mantine/dates';
import { areSameDay, isToday, isYesterday } from '@repo/utilities/date-time';

export default function Diary() {
  const { servings } = useStoreServing();
  const diaryDate = useDiaryDate();

  const eatenServings = servings?.filter((s) => {
    if (!diaryDate.date) return false;
    return s.eat_id && areSameDay(s.created_at, diaryDate.date);
  });

  return (
    <>
      <DiaryHeader props={{ diaryDate }} />

      <DiaryOverview props={{ diaryDate }} />

      <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
        {servings === undefined ? (
          <Center py={SECTION_SPACING}>
            <Loader />
          </Center>
        ) : !eatenServings?.length ? (
          <Center py={SECTION_SPACING}>
            <Text fz={'sm'} c={'dimmed'} ta={'center'}>
              Nothing eaten today yet.
            </Text>
          </Center>
        ) : (
          <Stack gap={0}>
            {sortArray(
              eatenServings,
              (i) => new Date(i.updated_at),
              Order.DESCENDING
            ).map((s, i) => (
              <Stack gap={0} key={s.id}>
                {i > 0 && <Divider />}

                <ModalServingCrud props={s}>
                  <CardServing props={s} />
                </ModalServingCrud>
              </Stack>
            ))}
          </Stack>
        )}
      </LayoutSection>
    </>
  );
}

function DiaryHeader({ props }: { props: { diaryDate: DiaryDateReturnType } }) {
  return (
    <LayoutSection id="layout-header-diarys" containerized={'xs'} padded={'xs'}>
      <Group justify="space-between">
        <Title order={1} fz={'md'} fw={500}>
          Diary
        </Title>

        <Group justify="end" wrap="nowrap">
          <IndicatorNetworkStatus />

          <ModalEatCrud
            props={{
              created_at: (props.diaryDate.date ||
                new Date().toISOString()) as any,
            }}
          >
            <Group>
              <Tooltip label={'Add Entry'}>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalEatCrud>
        </Group>
      </Group>
    </LayoutSection>
  );
}

function DiaryOverview({
  props,
}: {
  props: { diaryDate: DiaryDateReturnType };
}) {
  const { eats } = useStoreEat();

  const dayEats = eats?.filter((e) => {
    if (!props.diaryDate.date) return false;
    return areSameDay(e.created_at, props.diaryDate.date);
  });

  const { totalEatenNutrients } = useEatTotals({ eats: dayEats || [] });

  const overview = [
    {
      value: totalEatenNutrients.totalCarbs,
      label: 'Carbs',
      color: 'blue',
    },
    {
      value: totalEatenNutrients.totalProtein,
      label: 'Protein',
      color: 'green',
    },
    {
      value: totalEatenNutrients.totalFat,
      label: 'Fat',
      color: 'yellow',
    },
    {
      value: totalEatenNutrients.totalKcal,
      label: 'Calories',
      color: 'red',
    },
  ];

  return (
    <LayoutSection
      id="partial-overview-servings"
      containerized={'xs'}
      bg={
        'light-dark(var(--mantine-color-dark-4), var(--mantine-color-dark-8))'
      }
    >
      <PartialDate props={props.diaryDate} />

      <Divider mt={'xs'} mb={'md'} variant="dashed" />

      <Group justify="center" grow pb={'md'}>
        {overview.map((oi, i) => (
          <Stack key={i} gap={0} align="center">
            <Text
              component="span"
              inherit
              c={`${oi.color}.6`}
              ta={'center'}
              fw={500}
            >
              <NumberFormatter value={oi.value} decimalScale={2} />
            </Text>

            <Text inherit ta={'center'} fz={'sm'} c={'dimmed'}>
              {oi.label}
            </Text>

            <Group justify="center" w={64} mt={5}>
              <Progress
                value={100}
                color={oi.color}
                size={ICON_STROKE_WIDTH}
                w={'100%'}
              />
            </Group>
          </Stack>
        ))}
      </Group>
    </LayoutSection>
  );
}

function PartialDate({ props }: { props: DiaryDateReturnType }) {
  const { date, setDate, handlePrevious, handleNext } = props;

  const currentIsYesterday = props.date ? isYesterday(props.date) : false;
  const currentIsToday = props.date ? isToday(props.date) : false;

  return (
    <Group justify="space-between" wrap="nowrap" pt={'xs'}>
      <ActionIcon
        size={ICON_WRAPPER_SIZE}
        variant="subtle"
        onClick={handlePrevious}
      >
        <IconChevronLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>

      {props.date && (
        <Group justify="center" mih={30}>
          {currentIsYesterday ? (
            <Text inherit fz={'sm'}>
              Yesterday
            </Text>
          ) : currentIsToday ? (
            <Text inherit fz={'sm'}>
              Today
            </Text>
          ) : (
            <DateInput
              value={date}
              onChange={setDate}
              aria-label="Entry date"
              variant="unstyled"
              size="xs"
              styles={{
                input: {
                  textAlign: 'center',
                  fontSize: 'var(--mantine-font-size-sm)',
                },
              }}
            />
          )}
        </Group>
      )}

      <ActionIcon
        size={ICON_WRAPPER_SIZE}
        variant="subtle"
        onClick={handleNext}
        disabled={currentIsToday}
      >
        <IconChevronRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>
    </Group>
  );
}
