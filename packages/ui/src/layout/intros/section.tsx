'use client';

import { Stack, Text, Title } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants';
import { LayoutSection } from '../section';

interface SectionHeaderProps {
  props: {
    subTitle?: string;
    title: string;
    desc?: string;
  };
  options?: {
    alignment?: 'start' | 'end' | 'center';
    spacing?: boolean;
  };
}

export function LayoutIntroSection({ props, options }: SectionHeaderProps) {
  const alignment = options?.alignment ?? 'center';

  return (
    <LayoutSection id="layout-intro-section" containerized={false}>
      <Stack>
        {props.subTitle && (
          <Text fw="bold" ta={alignment} c="pri.6" tt="uppercase" fz="sm">
            {props.subTitle}
          </Text>
        )}

        <LayoutSection
          id="layout-intro-section-desc"
          px={0}
          containerized={options?.alignment ? false : 'sm'}
          mb={options?.spacing ? SECTION_SPACING : undefined}
        >
          <Stack>
            <Title order={2} ta={alignment}>
              {props.title}
            </Title>

            {props.desc && <Text ta={alignment}>{props.desc}</Text>}
          </Stack>
        </LayoutSection>
      </Stack>
    </LayoutSection>
  );
}
