import { ChatGet } from '@repo/types/models/chat';
import { create } from 'zustand';

export type ChatTemporaryValue = ChatGet | null | undefined;

interface ChatTemporaryState {
  chatTemporary: ChatTemporaryValue;
  setChatTemporary: (data: ChatTemporaryValue) => void;
  clearChatTemporary: () => void;
}

export const useStoreChatTemporary = create<ChatTemporaryState>((set) => ({
  chatTemporary: undefined,

  setChatTemporary: (data) => {
    set({ chatTemporary: data });
  },

  clearChatTemporary: () => {
    set({ chatTemporary: undefined });
  },
}));
