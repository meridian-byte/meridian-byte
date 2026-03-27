import { create } from 'zustand';
import type { LinkGet } from '@repo/types/models/link';

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
      links:
        state.links?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteLink: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      links: state.links?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
