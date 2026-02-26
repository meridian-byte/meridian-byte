import { create } from 'zustand';
import type { ChatGet } from '@repo/types/models/chat';

export type ChatsValue = ChatGet[] | null | undefined;

interface ChatState {
  chats: ChatsValue;
  deleted: ChatGet[];
  setChats: (data: ChatsValue) => void;
  setDeletedChats: (data: ChatsValue) => void;
  clearChats: () => void;
  clearDeletedChats: () => void;
  addChat: (data: ChatGet) => void;
  updateChat: (data: ChatGet) => void;
  deleteChat: (data: ChatGet) => void;
}

export const useStoreChat = create<ChatState>((set) => ({
  chats: undefined,
  deleted: [],

  setChats: (data) => {
    set({ chats: data });
  },

  setDeletedChats: (data) => {
    set({ deleted: data || [] });
  },

  clearChats: () => {
    set({ chats: [] });
  },

  clearDeletedChats: () => {
    set({ deleted: [] });
  },

  addChat: (data) => {
    set((state) => ({
      chats: [...(state.chats ?? []), data],
    }));
  },

  updateChat: (data) => {
    set((state) => ({
      chats:
        state.chats?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteChat: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      chats: state.chats?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
