'use client';

import { Modal, Button, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LayoutModal from '../../../layout/modal';
import { Alert } from '@repo/types/enums';

export default function Account() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        size={'xl'}
        padding={'xl'}
      >
        <LayoutModal
          props={{
            title: 'Account Erasure',
            close,
          }}
          variant={Alert.DANGER}
          size={'xl'}
        >
          <Stack>
            <Stack gap={'xs'}>
              <Text ta={{ base: 'center', xs: 'start' }}>
                Deleting your account will permanently remove all data
                associated with it. An email will be sent to confirm the
                deletion request. It will take 30 days to delete all your data.
                If you log into your account again within that time, the
                deletion process will be canceled.
              </Text>
            </Stack>
            action
          </Stack>
        </LayoutModal>
      </Modal>

      <Button color="red" onClick={open}>
        Delete Account
      </Button>
    </>
  );
}
