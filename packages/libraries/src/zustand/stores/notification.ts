import { create } from 'zustand';
import type { NotificationGet } from '@repo/types/models/notification';

export type NotificationsValue = NotificationGet[] | null | undefined;

interface NotificationState {
  notifications: NotificationsValue;
  deleted: NotificationGet[];
  setNotifications: (data: NotificationsValue) => void;
  setDeletedNotifications: (data: NotificationsValue) => void;
  clearNotifications: () => void;
  clearDeletedNotifications: () => void;
  addNotification: (data: NotificationGet) => void;
  updateNotification: (data: NotificationGet) => void;
  deleteNotification: (data: NotificationGet) => void;
}

export const useStoreNotification = create<NotificationState>((set) => ({
  notifications: undefined,
  deleted: [],

  setNotifications: (data) => {
    set({ notifications: data });
  },

  setDeletedNotifications: (data) => {
    set({ deleted: data || [] });
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  clearDeletedNotifications: () => {
    set({ deleted: [] });
  },

  addNotification: (data) => {
    set((state) => ({
      notifications: [...(state.notifications ?? []), data],
    }));
  },

  updateNotification: (data) => {
    set((state) => ({
      notifications:
        state.notifications?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteNotification: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      notifications:
        state.notifications?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
