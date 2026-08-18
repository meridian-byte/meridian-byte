import { create } from 'zustand';
import type { TaskListGet } from '@repo/types';

export type TaskListsValue = TaskListGet[] | null | undefined;

interface TaskListState {
  taskLists: TaskListsValue;
  deleted: TaskListGet[];
  setTaskLists: (data: TaskListsValue) => void;
  setDeletedTaskLists: (data: TaskListsValue) => void;
  clearTaskLists: () => void;
  clearDeletedTaskLists: () => void;
  addTaskList: (data: TaskListGet) => void;
  updateTaskList: (data: TaskListGet) => void;
  deleteTaskList: (data: TaskListGet) => void;
}

export const useStoreTaskList = create<TaskListState>((set) => ({
  taskLists: undefined,
  deleted: [],

  setTaskLists: (data) => {
    set({ taskLists: data });
  },

  setDeletedTaskLists: (data) => {
    set({ deleted: data || [] });
  },

  clearTaskLists: () => {
    set({ taskLists: [] });
  },

  clearDeletedTaskLists: () => {
    set({ deleted: [] });
  },

  addTaskList: (data) => {
    set((state) => ({
      taskLists: [...(state.taskLists ?? []), data],
    }));
  },

  updateTaskList: (data) => {
    set((state) => ({
      taskLists: state.taskLists?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  deleteTaskList: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      taskLists: state.taskLists?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
