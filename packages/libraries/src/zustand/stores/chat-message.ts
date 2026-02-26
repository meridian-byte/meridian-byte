import { create } from 'zustand';
import type { ChatMessageGet } from '@repo/types/models/chat-message';

export type ChatMessagesValue = ChatMessageGet[] | null | undefined;

interface ChatMessageState {
  chatMessages: ChatMessagesValue;
  deleted: ChatMessageGet[];
  setChatMessages: (data: ChatMessagesValue) => void;
  setDeletedChatMessages: (data: ChatMessagesValue) => void;
  clearChatMessages: () => void;
  clearDeletedChatMessages: () => void;
  addChatMessage: (data: ChatMessageGet) => void;
  updateChatMessage: (data: ChatMessageGet) => void;
  deleteChatMessage: (data: ChatMessageGet) => void;
}

export const useStoreChatMessage = create<ChatMessageState>((set) => ({
  chatMessages: undefined,
  deleted: [],

  setChatMessages: (data) => {
    set({ chatMessages: data });
  },

  setDeletedChatMessages: (data) => {
    set({ deleted: data || [] });
  },

  clearChatMessages: () => {
    set({ chatMessages: [] });
  },

  clearDeletedChatMessages: () => {
    set({ deleted: [] });
  },

  addChatMessage: (data) => {
    set((state) => ({
      chatMessages: [...(state.chatMessages ?? []), data],
    }));
  },

  updateChatMessage: (data) => {
    set((state) => ({
      chatMessages:
        state.chatMessages?.map((i) => (i.id === data.id ? { ...data } : i)) ??
        undefined,
    }));
  },

  deleteChatMessage: (data) => {
    set((state) => ({
      deleted: [...state.deleted, data],
      chatMessages:
        state.chatMessages?.filter((i) => i.id !== data.id) ?? undefined,
    }));
  },
}));
