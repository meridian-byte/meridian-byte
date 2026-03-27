import { Center, Stack } from '@mantine/core';
import LayoutSection from '@repo/components/layout/section';
import LoaderMain from '@repo/components/common/loaders/main';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import { companyName } from '@repo/constants/app';

export default function Main() {
  return (
    <LayoutSection id={'loading-main'}>
      <Center mih={'100vh'}>
        <Stack align="center">
          <ImageDefault
            src={images.brand.icon.default}
            alt={companyName}
            height={48}
            width={48}
            fit="contain"
          />

          <LoaderMain />
        </Stack>
      </Center>
    </LayoutSection>
  );
}
