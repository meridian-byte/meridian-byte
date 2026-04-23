import React, { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
  Center,
  Divider,
  Modal,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Transition,
} from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useRouter } from 'next/navigation';
import { IconFile, IconNote } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import LayoutModal from '@repo/components/layout/modal';
import InputTextSearch from '../inputs/text/search';
import { useSearchCriteria } from '@repo/hooks/search';
import { linkify } from '@repo/utilities/url';
import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export default function Search({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');

  const notes = useStoreNote((s) => s.notes);
  const router = useRouter();

  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);

  const resolvedNotes = useMemo(() => {
    // find default workspace
    const oldestWorkspace = workspaces?.reduce((oldest, current) => {
      return new Date(current.created_at) < new Date(oldest.created_at)
        ? current
        : oldest;
    });

    let workspaceNotes = [];

    if (activeWorkspace?.id === oldestWorkspace?.id) {
      workspaceNotes = (notes || []).filter((ni) => {
        return !ni.workspace_id || ni.workspace_id === oldestWorkspace?.id;
      });
    } else {
      workspaceNotes = (notes || []).filter((ni) => {
        return ni.workspace_id === activeWorkspace?.id;
      });
    }

    return workspaceNotes;
  }, [notes, activeWorkspace]);

  const { searchCriteriaItems } = useSearchCriteria({
    list: resolvedNotes || [],
    searchValue: searchValue,
    options: { showNoneOnEmpty: true },
  });

  const items = searchCriteriaItems.map((n) => {
    return {
      id: n.id,
      label: n.title,
      leftSection: <IconNote size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />,
      onClick: () => {
        router.push(`/app/n/${linkify(n.title)}-${n.id}`);
        close();
      },
    };
  });

  const handleClose = () => {
    setSearchValue('');
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        centered={false}
        size={'lg'}
        padding={0}
      >
        <LayoutModal withoutPadding={true}>
          <Box p={'md'} pb={searchValue.trim().length ? 0 : 'md'}>
            <InputTextSearch
              props={{
                value: searchValue,
                setValue: setSearchValue,
                close: handleClose,
              }}
            />
          </Box>

          <Transition mounted={!!searchValue.trim().length} duration={0}>
            {(styles) => (
              <div style={styles}>
                <Divider />

                <ScrollArea
                  mah={searchValue.trim().length ? 280 : 0}
                  p={'md'}
                  pt={0}
                >
                  {!searchCriteriaItems.length ? (
                    <Stack
                      align="center"
                      ta={'center'}
                      gap={'xs'}
                      fz={'sm'}
                      c={'dimmed'}
                      py={SECTION_SPACING}
                    >
                      <Text inherit>No notes found...</Text>
                      <Text inherit>Try another workspace.</Text>
                    </Stack>
                  ) : (
                    <Box pt={'xs'}>
                      {items.map((a) => (
                        <div key={a.id}>
                          <NavLink
                            label={a.label}
                            leftSection={a.leftSection}
                            onClick={a.onClick}
                            style={{ borderRadius: 'var(--mantine-radius-md)' }}
                          />
                        </div>
                      ))}
                    </Box>
                  )}
                </ScrollArea>
              </div>
            )}
          </Transition>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
