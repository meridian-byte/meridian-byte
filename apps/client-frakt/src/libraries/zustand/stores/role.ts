import { create } from 'zustand';
import { Role } from '@repo/types/models/enums';

export type RoleValue = Role | null | undefined;

interface RoleState {
  role: RoleValue;
  setRole: (data: RoleValue) => void;
  clearRole: () => void;
}

export const useStoreRole = create<RoleState>((set) => ({
  role: undefined,

  setRole: (data) => {
    set({ role: data });
  },

  clearRole: () => {
    set({ role: undefined });
  },
}));
