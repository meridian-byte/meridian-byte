import { Priority } from '@repo/types/models/enums';

export const getPriorityColor = (taskProirity: Priority) => {
  switch (taskProirity) {
    case Priority.URGENT_IMPORTANT:
      return 'var(--mantine-color-red-6)';
    case Priority.URGENT_UNIMPORTANT:
      return 'var(--mantine-color-yellow-6)';
    case Priority.NOT_URGENT_IMPORTANT:
      return 'var(--mantine-color-blue-6)';
    default:
      return 'var(--mantine-color-dark-2)';
  }
};
