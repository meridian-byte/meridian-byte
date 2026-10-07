import { create } from 'zustand';
import type { SessionGet, SessionCookie } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type SessionValue = SessionCookie | null | undefined;
export type SessionsValue = SessionGet[] | null | undefined;

interface SessionState {
  session: SessionValue;
  sessions: SessionsValue;
  deleted: SessionGet[];
  setSession: (data: SessionValue) => void;
  setSessions: (data: SessionsValue) => void;
  setDeletedSessions: (data: SessionsValue) => void;
  clearSession: () => void;
  clearSessions: () => void;
  clearDeletedSessions: () => void;
  addSession: (data: SessionGet) => void;
  updateSession: (data: SessionGet) => void;
  mergeSessions: (data: SessionGet[]) => void;
  deleteSession: (data: SessionGet) => void;
}

export const useStoreSession = create<SessionState>((set) => ({
  session: undefined,
  sessions: undefined,
  deleted: [],

  setSession: (data) => {
    set({ session: data });
  },

  setSessions: (data) => {
    set({ sessions: data });
  },

  setDeletedSessions: (data) => {
    set({ deleted: data || [] });
  },

  clearSession: () => {
    set({ session: undefined });
  },

  clearSessions: () => {
    set({ sessions: [] });
  },

  clearDeletedSessions: () => {
    set({ deleted: [] });
  },

  addSession: (data) => {
    set((state) => ({
      sessions: [...(state.sessions ?? []), data],
    }));
  },

  updateSession: (data) => {
    set((state) => ({
      sessions: state.sessions?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeSessions: (incomingSessions) => {
    set((state) => {
      if (!incomingSessions || incomingSessions.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.sessions) {
        return { sessions: incomingSessions };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingSessions.map((n) => [String(n.id), n]));

      // 1. Update existing sessions in place if fields differ
      const nextSessions = state.sessions.map((existing) => {
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

      // 2. Append new sessions that aren't in the store yet
      const existingIds = new Set(state.sessions.map((n) => String(n.id)));
      for (const incoming of incomingSessions) {
        if (!existingIds.has(String(incoming.id))) {
          nextSessions.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { sessions: nextSessions };
    });
  },

  deleteSession: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      sessions: state.sessions?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
