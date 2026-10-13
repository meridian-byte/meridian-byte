import { create } from 'zustand';
import { AccountGet, WorkspaceGet } from '@repo/types';

export type ActiveWorkspaceValue = WorkspaceGet | null;
export type ActiveAccountValue = AccountGet | null;
export type ActiveItemsValue =
  | {
      workspace?: ActiveWorkspaceValue;
      account?: ActiveAccountValue;
      confirm?: any;
    }
  | null
  | undefined;

interface ActiveItemsState {
  activeItems: ActiveItemsValue;

  addActiveConfirm: (data: any) => void;
  removeActiveConfirm: () => void;

  addActiveWorkspace: (data: WorkspaceGet) => void;
  removeActiveWorkspace: () => void;

  addActiveAccount: (data: AccountGet) => void;
  removeActiveAccount: () => void;

  setActiveItems: (data: ActiveItemsValue) => void;
  clearActiveItems: () => void;
}

export const useStoreActiveItems = create<ActiveItemsState>((set) => ({
  activeItems: undefined,

  addActiveConfirm: (data) => {
    set((state) => ({
      activeItems: {
        ...state.activeItems,
        confirm: data,
      },
    }));
  },

  removeActiveConfirm: () => {
    set((state) => ({
      activeItems: {
        ...state.activeItems,
        confirm: null,
      },
    }));
  },

  addActiveWorkspace: (data) =>
    set((state) => ({
      activeItems: { ...state.activeItems, workspace: data },
    })),

  removeActiveWorkspace: () =>
    set((state) => ({
      activeItems: { ...state.activeItems, workspace: null },
    })),

  addActiveAccount: (data) =>
    set((state) => ({
      activeItems: { ...state.activeItems, account: data },
    })),

  removeActiveAccount: () =>
    set((state) => ({
      activeItems: { ...state.activeItems, account: null },
    })),

  setActiveItems: (data) => set({ activeItems: data }),

  clearActiveItems: () => set({ activeItems: undefined }),
}));
