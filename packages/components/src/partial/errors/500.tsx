import { Stack, Button, Group, Flex } from '@mantine/core';
import LayoutSection from '../../layout/section';
import IntroSection from '../../layout/intros/section';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { IconRefresh } from '@tabler/icons-react';

export default function Error500({ reset }: { reset: () => void }) {
  return (
    <LayoutSection id={'error-500'}>
      <Stack justify="center" mih={'100vh'}>
        <IntroSection
          props={{
            subTitle: `500`,
            title: 'Server Error',
            desc: `The page you are trying to open has triggered an error.`,
          }}
        />

        <Group justify="center" mt={'md'}>
          <Flex
            direction={{ base: 'column', xs: 'row' }}
            align={'center'}
            gap={'md'}
          >
            <Button
              leftSection={
                <IconRefresh size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              variant="light"
              onClick={() => {
                // reset();
                window.location.reload();
              }}
            >
              Try Again
            </Button>
          </Flex>
        </Group>
      </Stack>
    </LayoutSection>
  );
}
