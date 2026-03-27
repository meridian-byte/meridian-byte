import { create } from 'zustand';
import { TaskGet } from '@repo/types/models/task';

export type SelectedTaskValue = TaskGet | null | undefined;

interface SelectedTaskState {
  selectedTask: SelectedTaskValue;
  setSelectedTask: (data: SelectedTaskValue) => void;
  clearSelectedTask: () => void;
}

export const useStoreSelectedTask = create<SelectedTaskState>((set) => ({
  selectedTask: undefined,

  setSelectedTask: (data) => {
    set({ selectedTask: data });
  },

  clearSelectedTask: () => {
    set({ selectedTask: undefined });
  },
}));
