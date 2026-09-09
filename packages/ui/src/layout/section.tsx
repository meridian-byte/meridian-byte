import { Box, BoxProps, Container } from '@mantine/core';
import { SECTION_SPACING } from '@repo/constants';
import { SectionProps } from '@repo/types';

export function LayoutSection({
  containerized = 'responsive',
  padded,
  margined,
  className,
  bordered,
  shadowed,
  children,
  id,
  ...rest
}: SectionProps & BoxProps) {
  const py =
    typeof padded === 'boolean'
      ? SECTION_SPACING
      : typeof padded !== 'undefined'
        ? padded
        : undefined;

  const my =
    typeof margined === 'boolean'
      ? SECTION_SPACING
      : typeof margined !== 'undefined'
        ? margined
        : undefined;

  return (
    <Box
      component="section"
      id={id}
      py={py}
      my={my}
      className={className}
      style={{
        borderBottom: bordered ? '1px solid var(--mantine-color-default-border)' : undefined,
        boxShadow: shadowed ? 'var(--mantine-shadow-xs)' : undefined,
      }}
      {...rest}
    >
      {containerized ? (
        <Container size={typeof containerized === 'boolean' ? undefined : containerized} h={'100%'}>
          {children}
        </Container>
      ) : (
        children
      )}
    </Box>
  );
}
