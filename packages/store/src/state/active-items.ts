import { create } from 'zustand';
import { AccountGet, WorkspaceGet } from '@repo/types';

export type ActiveWorkspaceValue = WorkspaceGet | null;
export type ActiveAccountValue = AccountGet | null;
export type ActiveItemsValue =
  | {
      workspace?: ActiveWorkspaceValue;
      account?: ActiveAccountValue;
    }
  | null
  | undefined;

interface ActiveItemsState {
  activeItems: ActiveItemsValue;

  addActiveWorkspace: (data: WorkspaceGet) => void;
  removeActiveWorkspace: () => void;

  addActiveAccount: (data: AccountGet) => void;
  removeActiveAccount: () => void;

  setActiveItems: (data: ActiveItemsValue) => void;
  clearActiveItems: () => void;
}

export const useStoreActiveItems = create<ActiveItemsState>((set) => ({
  activeItems: undefined,

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
