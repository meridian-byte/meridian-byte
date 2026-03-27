import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Box,
  Center,
  Divider,
  Modal,
  NavLink,
  ScrollArea,
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

export default function Search({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');

  const notes = useStoreNote((s) => s.notes);
  const router = useRouter();

  const { searchCriteriaItems } = useSearchCriteria({
    list: notes || [],
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
                    <Center ta={'center'} py={SECTION_SPACING / 2}>
                      <Text inherit fz={'sm'} c={'dimmed'}>
                        No notes found...
                      </Text>
                    </Center>
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
