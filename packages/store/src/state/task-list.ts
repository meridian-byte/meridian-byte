import { create } from 'zustand';
import type { TaskListGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

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
  mergeTaskLists: (data: TaskListGet[]) => void;
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

  mergeTaskLists: (incomingTaskLists) => {
    set((state) => {
      if (!incomingTaskLists || incomingTaskLists.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.taskLists) {
        return { taskLists: incomingTaskLists };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingTaskLists.map((n) => [String(n.id), n]));

      // 1. Update existing taskLists in place if fields differ
      const nextTaskLists = state.taskLists.map((existing) => {
        const incoming = incomingMap.get(String(existing.id));
        if (!incoming) return existing;

        // Check if any property changed
        const isDifferent = hasChanges(existing, incoming);

        if (isDifferent) {
          hasChanged = true;
          return { ...existing, ...incoming };
        }

        // Return exact same reference if nothing changed
        return existing;
      });

      // 2. Append new taskLists that aren't in the store yet
      const existingIds = new Set(state.taskLists.map((n) => String(n.id)));
      for (const incoming of incomingTaskLists) {
        if (!existingIds.has(String(incoming.id))) {
          nextTaskLists.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { taskLists: nextTaskLists };
    });
  },

  deleteTaskList: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      taskLists: state.taskLists?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
