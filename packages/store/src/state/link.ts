import { create } from 'zustand';
import type { LinkGet } from '@repo/types';
import { hasChanges } from '@repo/utils';

export type LinksValue = LinkGet[] | null | undefined;

interface LinkState {
  links: LinksValue;
  deleted: LinkGet[];
  setLinks: (data: LinksValue) => void;
  setDeletedLinks: (data: LinksValue) => void;
  clearLinks: () => void;
  clearDeletedLinks: () => void;
  addLink: (data: LinkGet) => void;
  updateLink: (data: LinkGet) => void;
  mergeLinks: (data: LinkGet[]) => void;
  deleteLink: (data: LinkGet) => void;
}

export const useStoreLink = create<LinkState>((set) => ({
  links: undefined,
  deleted: [],

  setLinks: (data) => {
    set({ links: data });
  },

  setDeletedLinks: (data) => {
    set({ deleted: data || [] });
  },

  clearLinks: () => {
    set({ links: [] });
  },

  clearDeletedLinks: () => {
    set({ deleted: [] });
  },

  addLink: (data) => {
    set((state) => ({
      links: [...(state.links ?? []), data],
    }));
  },

  updateLink: (data) => {
    set((state) => ({
      links: state.links?.map((i) => (i.id === data.id ? { ...data } : i)) ?? undefined,
    }));
  },

  mergeLinks: (incomingLinks) => {
    set((state) => {
      if (!incomingLinks || incomingLinks.length === 0) return state;

      // If initial state is empty, set it directly
      if (!state.links) {
        return { links: incomingLinks };
      }

      let hasChanged = false;
      const incomingMap = new Map(incomingLinks.map((n) => [String(n.id), n]));

      // 1. Update existing links in place if fields differ
      const nextLinks = state.links.map((existing) => {
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

      // 2. Append new links that aren't in the store yet
      const existingIds = new Set(state.links.map((n) => String(n.id)));
      for (const incoming of incomingLinks) {
        if (!existingIds.has(String(incoming.id))) {
          nextLinks.push(incoming);
          hasChanged = true;
        }
      }

      // CRITICAL: Return original `state` if nothing changed.
      // Zustand skips re-rendering all subscribers when the returned state reference is identical.
      if (!hasChanged) return state;

      return { links: nextLinks };
    });
  },

  deleteLink: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      links: state.links?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
