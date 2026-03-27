import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Center,
  Divider,
  Modal,
  NavLink,
  ScrollArea,
  Text,
} from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useRouter } from 'next/navigation';
import { IconFile } from '@tabler/icons-react';
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
  });

  const items = searchCriteriaItems.map((n) => {
    return {
      id: n.id,
      label: n.title,
      leftSection: <IconFile size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />,
      onClick: () => {
        router.push(`/app/n/${linkify(n.title)}-${n.id}`);
        close();
      },
    };
  });

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal props={{ close, title: 'Search note' }}>
          <InputTextSearch
            props={{ value: searchValue, setValue: setSearchValue }}
          />

          <div>
            <Divider />

            <ScrollArea h={280}>
              {!searchCriteriaItems.length ? (
                <Center ta={'center'} py={SECTION_SPACING}>
                  <Text inherit fz={'sm'} c={'dimmed'}>
                    No notes found...
                  </Text>
                </Center>
              ) : (
                items.map((a, i) => (
                  <div key={i}>
                    <NavLink
                      label={a.label}
                      leftSection={a.leftSection}
                      onClick={a.onClick}
                      style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    />
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
