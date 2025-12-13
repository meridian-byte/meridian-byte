import { Center, Tooltip, TooltipProps } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function Warning({
  props,
  ...restProps
}: {
  props: { label: string };
} & Omit<TooltipProps, 'children' | 'label'>) {
  return (
    <Tooltip
      label={props.label}
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
      arrowOffset={8}
      {...restProps}
    >
      <Center style={{ cursor: 'help' }}>
        <IconAlertTriangle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </Center>
    </Tooltip>
  );
}
