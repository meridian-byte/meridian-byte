import { Center, Stack } from '@mantine/core';
import { LayoutSection } from '../../layout/section';
import { LoaderMain } from '../../loader/main';

export function PartialLoadingMain() {
  return (
    <LayoutSection id={'loading-main'}>
      <Center mih={'100vh'}>
        <Stack align="center">
          <LoaderMain />
        </Stack>
      </Center>
    </LayoutSection>
  );
}
