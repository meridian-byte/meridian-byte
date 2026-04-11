'use client';

import React, { useMemo } from 'react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import {
  Box,
  Button,
  Card,
  CardSection,
  Center,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core';
import LayoutSection from '@repo/components/layout/section';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { NoteGet } from '@repo/types/models/note';
import { IconEdit, IconHistory, IconNote } from '@tabler/icons-react';
import { getRegionalDate } from '@repo/utilities/date-time';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import { linkify } from '@repo/utilities/url';
import Link from 'next/link';
import { useField } from '@mantine/form';
import EditorMain from '@repo/components/common/editors/main';
import { useNoteActions } from '@repo/hooks/actions/note';

export default function Home() {
  const notes = useStoreNote((s) => s.notes);
  const { noteCreate } = useNoteActions();

  return (
    <LayoutSection id={`app-home`} padded containerized={'md'}>
      <Stack gap={SECTION_SPACING}>
        <Stack>
          <Group gap={5} c={'dimmed'}>
            <IconEdit size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />

            <Title order={2} fz={'sm'}>
              Quick Note
            </Title>
          </Group>

          <Divider color="light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-8))" />

          <Box mih={80.8}>
            {notes === undefined ? (
              <Skeleton h={20} w={200} mt={'sm'} />
            ) : (
              <EditorMain />
            )}
          </Box>
        </Stack>

        <Stack>
          <Group gap={5} c={'dimmed'}>
            <IconHistory size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />

            <Title order={2} fz={'sm'}>
              Recent Notes
            </Title>
          </Group>

          <Divider color="light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-8))" />

          <SimpleGrid
            cols={
              notes !== undefined && !notes?.length
                ? 1
                : { base: 2, xs: 3, sm: 4, md: 3, lg: 4, xl: 5 }
            }
            mih={272.4}
          >
            {notes === undefined ? (
              <>
                {cardSkeleton}
                {cardSkeleton}
                {cardSkeleton}
                {cardSkeleton}
              </>
            ) : !notes?.length ? (
              <Stack align="center" ta={'center'} py={SECTION_SPACING / 2}>
                <Text c={'dimmed'}>No Notes Found</Text>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() =>
                    noteCreate({ content: 'Write your content here...' })
                  }
                >
                  Create note
                </Button>
              </Stack>
            ) : (
              sortArray(notes || [], (i) => i.updated_at, Order.DESCENDING).map(
                (ni, i) =>
                  i < 6 && (
                    <div key={ni.id}>
                      <RecentNoteCard props={ni} />
                    </div>
                  )
              )
            )}
          </SimpleGrid>
        </Stack>
      </Stack>
    </LayoutSection>
  );
}

const cardSkeleton = <Skeleton h={128.2} />;

function RecentNoteCard({ props }: { props: NoteGet }) {
  const link = useMemo(() => {
    return `/app/n/${linkify(props.title || '')}-${props.id}`;
  }, [props.title, props.id]);

  const timeStamp = getRegionalDate(props.updated_at);

  return (
    <Link href={link}>
      <Card
        bg={
          'light-dark(var(--mantine-color-gray-1), var(--mantine-color-bgDark-3))'
        }
      >
        <CardSection
          p={'xs'}
          bg={
            'light-dark(var(--mantine-color-gray-2), var(--mantine-color-bgDark-6))'
          }
          c={'dimmed'}
        >
          <Group h={40} align="start">
            <IconNote size={ICON_SIZE * 1.5} stroke={ICON_STROKE_WIDTH} />
          </Group>
        </CardSection>

        <CardSection p={'xs'}>
          <Stack gap={'xs'}>
            <Tooltip
              label={props.title}
              multiline
              maw={200}
              position="top-start"
              arrowOffset={16}
            >
              <Title order={3} fz={'sm'} fw={500} lineClamp={1}>
                {props.title}
              </Title>
            </Tooltip>

            <Text fz={'xs'} c={'dimmed'}>
              {timeStamp.date}, {timeStamp.time}
            </Text>
          </Stack>
        </CardSection>
      </Card>
    </Link>
  );
}
