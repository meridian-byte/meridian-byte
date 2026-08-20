import { create } from 'zustand';
import type { TaskGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

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
  mergeTasks: (data: TaskGet[]) => void;
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
      tasks: state.tasks?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeTasks: (incomingTasks) => {
    set((state) => {
      if (!incomingTasks || incomingTasks.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.tasks) {
        return { tasks: incomingTasks };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingTasks.map((n) => [String(n.id), n]));

      // 1. Update existing tasks in place if fields differ
      const nextTasks = state.tasks.map((existing) => {
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

      // 2. Append new tasks that aren't in the store yet
      const existingIds = new Set(state.tasks.map((n) => String(n.id)));
      for (const incoming of incomingTasks) {
        if (!existingIds.has(String(incoming.id))) {
          nextTasks.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { tasks: nextTasks };
    });
  },

  deleteTask: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      tasks: state.tasks?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
