import { create } from 'zustand';
import type { TaskGet } from '@repo/types/models/task';

export type TasksValue = TaskGet[] | null | undefined;

interface TaskState {
  tasks: TasksValue;
  deleted: TaskGet[];
  setTasks: (data: TasksValue) => void;
  setDeletedTasks: (data: TasksValue) => void;
  clearTasks: () => void;
  clearDeletedTasks: () => void;
  addTask: (data: TaskGet) => void;
  updateTask: (data: TaskGet) => void;
  deleteTask: (data: TaskGet) => void;
}

export const useStoreTask = create<TaskState>((set) => ({
  tasks: undefined,
  deleted: [],

  setTasks: (data) => {
    set({ tasks: data });
  },

  setDeletedTasks: (data) => {
    set({ deleted: data || [] });
  },

  clearTasks: () => {
    set({ tasks: [] });
  },

  clearDeletedTasks: () => {
    set({ deleted: [] });
  },

  addTask: (data) => {
    set((state) => ({
      tasks: [...(state.tasks ?? []), data],
    }));
  },

  updateTask: (data) => {
    set((state) => ({
      tasks:
        state.tasks?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteTask: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      tasks: state.tasks?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
