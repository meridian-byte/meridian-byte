import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Badge, Modal, NavLink, ScrollArea } from '@mantine/core';
import LayoutModal from '@repo/components/layout/modal';

export default function Commands({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  const commands = [
    {
      title: 'Open command palette',
      operation: () => {},
      shortcut: 'Ctrl + P',
      hotkey: 'mod + K',
    },
    {
      title: 'Create new note',
      operation: () => {},
      shortcut: 'Ctrl + N',
      hotkey: 'mod + N',
    },
    {
      title: 'Create new folder',
      operation: () => {},
      shortcut: 'Ctrl + F',
      hotkey: 'mod + F',
    },
    {
      title: 'Navigate back',
      operation: () => {},
      shortcut: 'Ctrl + <',
      hotkey: 'mod + ,',
    },
    {
      title: 'Navigate forward',
      operation: () => {},
      shortcut: 'Ctrl + >',
      hotkey: 'mod + .',
    },
  ];

  const actions = commands.map((c, i) => {
    return {
      id: `${i}-${c.title}-${c.shortcut}`,
      label: c.title,
      rightSection: c.hotkey && c.shortcut && (
        <Badge
          fz={'sm'}
          tt={'none'}
          radius={'sm'}
          fw={'normal'}
          color="dark.6"
          p={5}
        >
          {c.shortcut}
        </Badge>
      ),
      onClick: c.operation,
    };
  });

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <LayoutModal props={{ close, title: 'Commands' }}>
          <ScrollArea h={280}>
            {actions.map((a, i) => (
              <div key={i}>
                <NavLink
                  label={a.label}
                  rightSection={a.rightSection}
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
