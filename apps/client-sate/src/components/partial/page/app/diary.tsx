'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import { useStoreServing } from '@repo/libraries/zustand/stores/serving';
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Group,
  Loader,
  NumberFormatter,
  RingProgress,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import CardServing from '@repo/components/common/cards/serving';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import ModalServingCrud from '@repo/components/common/modals/serving/crud';
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from '@tabler/icons-react';
import ModalEatCrud from '@repo/components/common/modals/eat/crud';
import IndicatorNetworkStatus from '@repo/components/common/indicators/network-status';
import { useStoreEat } from '@repo/libraries/zustand/stores/eat';
import { useEatTotals } from '@repo/hooks/nutrients';
import { useEntryDate, EntryDateReturnType } from '@repo/hooks/entries';
import { DateInput } from '@mantine/dates';
import { areSameDay, isToday, isYesterday } from '@repo/utilities/date-time';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import { COLOR_CODES } from '@repo/constants/other';
import { useStoreMass } from '@repo/libraries/zustand/stores/mass';
import { calculateMacros } from '@repo/utilities/weight';
import { useMediaQuery } from '@mantine/hooks';

export default function Diary() {
  const { servings } = useStoreServing();
  const entryDate = useEntryDate();

  const eatenServings = servings?.filter((s) => {
    if (!entryDate.date) return false;
    return s.eat_id && areSameDay(s.created_at, entryDate.date);
  });

  return (
    <>
      <DiaryHeader props={{ entryDate }} />

      <DiaryOverview props={{ entryDate }} />

      <LayoutSection id="app-home" containerized={'xs'} padded={'md'}>
        {servings === undefined ? (
          <Center py={SECTION_SPACING}>
            <Loader />
          </Center>
        ) : !eatenServings?.length ? (
          <Center py={SECTION_SPACING}>
            <Text fz={'sm'} c={'dimmed'} ta={'center'}>
              Nothing logged today yet.
            </Text>
          </Center>
        ) : (
          <Stack gap={0}>
            {sortArray(
              eatenServings,
              (i) => new Date(i.created_at),
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

function DiaryHeader({ props }: { props: { entryDate: EntryDateReturnType } }) {
  const { syncStatus } = useStoreSyncStatus();

  return (
    <Box
      bg={'var(--mantine-color-body)'}
      pos={'sticky'}
      top={0}
      style={{ zIndex: 1 }}
    >
      <LayoutSection
        id="layout-header-diarys"
        containerized={'xs'}
        padded={'xs'}
      >
        <Group justify="space-between">
          <Title order={1} fz={'md'} fw={500}>
            Food Entries
          </Title>

          <Group justify="end" wrap="nowrap" gap={5}>
            <IndicatorNetworkStatus props={{ syncStatus }} />

            <ModalEatCrud
              props={{
                created_at: (props.entryDate.date ||
                  new Date().toISOString()) as any,
              }}
            >
              <Group>
                <Tooltip label={'Add Food Entry'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE} variant="light">
                    <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalEatCrud>
          </Group>
        </Group>
      </LayoutSection>

      <Divider />
    </Box>
  );
}

export function DiaryOverview({
  props,
}: {
  props?: { entryDate?: EntryDateReturnType };
}) {
  const mobile = useMediaQuery('(max-width: 36em)');

  const { eats } = useStoreEat();

  const dayEats = eats?.filter((e) => {
    return areSameDay(
      e.created_at,
      props?.entryDate?.date ? props.entryDate.date : new Date().toISOString()
    );
  });

  const { totalEatenNutrients } = useEatTotals({ eats: dayEats || [] });

  const { masses } = useStoreMass();

  const latestMass =
    !masses || masses.length < 1
      ? null
      : masses?.reduce((a, b) =>
          new Date(a.created_at) > new Date(b.created_at) ? a : b
        );

  const dailyMacros = calculateMacros({
    weightKg: latestMass?.weight || 0,
    leanMassKg: latestMass?.lean_weight || 0,
  });

  const overview = [
    {
      value: totalEatenNutrients.totalCarbs,
      color: `${COLOR_CODES.FOOD.CARBS}.6`,
      label: 'Carbs',
      goal: dailyMacros.carbs,
      unit: 'grams',
      progress:
        (Number(totalEatenNutrients.totalCarbs) / dailyMacros.carbs) * 100,
    },
    {
      value: totalEatenNutrients.totalProtein,
      color: `${COLOR_CODES.FOOD.PROTEINS}.6`,
      label: 'Protein',
      goal: dailyMacros.protein,
      unit: 'grams',
      progress:
        (Number(totalEatenNutrients.totalProtein) / dailyMacros.protein) * 100,
    },
    {
      value: totalEatenNutrients.totalFat,
      color: `${COLOR_CODES.FOOD.FATS}.6`,
      label: 'Fat',
      goal: dailyMacros.fat,
      unit: 'grams',
      progress: (Number(totalEatenNutrients.totalFat) / dailyMacros.fat) * 100,
    },
    {
      value: totalEatenNutrients.totalKcal,
      label: 'Calories',
      color: `${COLOR_CODES.FOOD.KCAL}.6`,
      goal: dailyMacros.kcal,
      unit: 'Kcal',
      progress:
        (Number(totalEatenNutrients.totalKcal) / dailyMacros.kcal) * 100,
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
      {props?.entryDate && (
        <>
          <PartialDate props={props.entryDate} />
          <Divider mt={'xs'} variant="dashed" />
        </>
      )}

      <Group justify="center" grow py={'xs'}>
        {overview.map((oi, i) => {
          return (
            <Stack key={i} gap={0} align="center">
              <RingProgress
                size={mobile ? 64 : 96}
                thickness={ICON_STROKE_WIDTH}
                roundCaps
                transitionDuration={500}
                rootColor={!latestMass ? 'transparent' : undefined}
                label={
                  <Stack align="center" gap={0}>
                    {eats === undefined ? (
                      <Skeleton h={24} w={24} />
                    ) : (
                      <Text
                        component="span"
                        inherit
                        c={`${oi.color}.6`}
                        ta={'center'}
                        fw={500}
                        fz={{ base: 'sm', xs: 'md' }}
                      >
                        <NumberFormatter value={oi.value} decimalScale={2} />{' '}
                        {i == overview.length - 1 ? '' : oi.unit[0]}
                      </Text>
                    )}

                    <Text
                      inherit
                      ta={'center'}
                      fz={'sm'}
                      c={'dimmed'}
                      visibleFrom="xs"
                    >
                      {oi.label}
                    </Text>
                  </Stack>
                }
                sections={[
                  {
                    value: oi.progress || 0,
                    color: !latestMass ? 'transparent' : oi.color,
                  },
                ]}
              />

              {props?.entryDate && (
                <>
                  <Group
                    justify="center"
                    w={64}
                    mt={5}
                    mb={!props?.entryDate ? 5 : 0}
                  >
                    <Divider
                      color={oi.color}
                      size={ICON_STROKE_WIDTH}
                      w={'100%'}
                    />
                  </Group>

                  {latestMass && dayEats === undefined ? (
                    <Skeleton h={22} w={44} />
                  ) : (
                    oi.goal > 0 && (
                      <Text
                        inherit
                        fz={{ base: 'xs', xs: 'sm' }}
                        c={'dimmed'}
                        ta={'center'}
                        mih={21.7}
                      >
                        {oi.goal} {oi.unit[0]}
                      </Text>
                    )
                  )}
                </>
              )}
            </Stack>
          );
        })}
      </Group>
    </LayoutSection>
  );
}

function PartialDate({ props }: { props: EntryDateReturnType }) {
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
