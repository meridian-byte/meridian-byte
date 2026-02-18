import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Divider, Modal, NavLink, ScrollArea } from '@mantine/core';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useRouter } from 'next/navigation';
import { IconFile } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import LayoutModal from '@repo/components/layout/modal';
import InputTextSearch from '../inputs/text/search';

export default function Search({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState('');

  const { notes } = useStoreNote();
  const router = useRouter();

  const noteList = notes?.filter((n) => {
    const inSearch = n.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return inSearch;
  });

  const actions = (noteList || []).map((n) => {
    return {
      id: n.id,
      label: n.title,
      leftSection: <IconFile size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />,
      onClick: () => {
        router.push(`/app?noteId=${n.id}`);
        close();
      },
    };
  });

  // nothingFound="Nothing found..."
  //         searchProps={{
  //           leftSection: <IconSearch size={20} stroke={1.5} />,
  //           placeholder: 'Search note...',
  //         }}

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal props={{ close, title: 'Search note' }}>
          <InputTextSearch props={{ value: search, setValue: setSearch }} />

          <Divider />

          <ScrollArea h={280}>
            {actions.map((a, i) => (
              <div key={i}>
                <NavLink
                  label={a.label}
                  leftSection={a.leftSection}
                  onClick={a.onClick}
                  style={{ borderRadius: 'var(--mantine-radius-md)' }}
                />
              </div>
            ))}
          </ScrollArea>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
