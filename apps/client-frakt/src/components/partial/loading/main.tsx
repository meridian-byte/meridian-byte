import { Center, Stack } from '@mantine/core';
import LayoutSection from '@repo/components/layout/section';
import LoaderMain from '@repo/components/common/loaders/main';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import { APP_NAME } from '@/data/constants';

export default function Main() {
  return (
    <LayoutSection id={'error-404'}>
      <Center mih={'100vh'}>
        <Stack align="center">
          <ImageDefault
            src={images.brand.logo.light}
            alt={APP_NAME}
            height={56}
            width={104}
            fit="contain"
            mode="grid"
          />

          <LoaderMain />
        </Stack>
      </Center>
    </LayoutSection>
  );
}
