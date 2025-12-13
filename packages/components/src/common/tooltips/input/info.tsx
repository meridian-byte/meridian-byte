import { Center, Tooltip, TooltipProps } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';

export default function Info({
  props,
  ...restProps
}: {
  props?: { label?: string };
} & Omit<TooltipProps, 'children' | 'label'>) {
  return (
    <Tooltip
      label={props?.label || 'We will not share your email'}
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
      arrowOffset={8}
      {...restProps}
    >
      <Center style={{ cursor: 'help' }}>
        <IconInfoCircle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </Center>
    </Tooltip>
  );
}
