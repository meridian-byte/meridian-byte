import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

export type SessionValue = User | null | undefined;

interface SessionState {
  session: SessionValue;
  setSession: (data: SessionValue) => void;
  clearSession: () => void;
}

export const useStoreSession = create<SessionState>((set) => ({
  session: undefined,

  setSession: (data) => {
    set({ session: data });
  },

  clearSession: () => {
    set({ session: undefined });
  },
}));
