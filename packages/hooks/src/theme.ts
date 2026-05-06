import { useMantineColorScheme } from '@mantine/core';
import { ColorScheme } from '@repo/types/enums';

export const useThemeLogo = (params: {
  lightImage: string;
  darkImage: string;
}) => {
  const { colorScheme } = useMantineColorScheme({
    keepTransitions: false,
  });

  if (colorScheme == ColorScheme.DARK) return params.darkImage;
  if (colorScheme == ColorScheme.LIGHT) return params.lightImage;
};
