import { SAMPLE_CHAT } from '@repo/constants/chat';
import { PARAM_NAME } from '@repo/constants/names';
import { useCallback, useMemo } from 'react';
import { useStoreChat } from '@repo/libraries/zustand/stores/chat';
import { useStoreChatTemporary } from '@repo/libraries/zustand/stores/chat-temporary';
import { ChatGet } from '@repo/types/models/chat';
import { generateUUID } from '@repo/utilities/generators';
import { SyncStatus } from '@repo/types/models/enums';
import { useStoreChatMessage } from '@repo/libraries/zustand/stores/chat-message';

export const useTempChat = () => {
  const chatTemporary = useStoreChatTemporary((s) => s.chatTemporary);
  const setChatTemporary = useStoreChatTemporary((s) => s.setChatTemporary);

  const chats = useStoreChat((s) => s.chats);
  const chat = useStoreChat((s) =>
    s.chats?.find((c) => c.id == chatTemporary?.id)
  );

  const chatMessages = useStoreChatMessage((s) => s.chatMessages);
  const currentChatMessages = useMemo(
    () => chatMessages?.filter((cm) => cm.chat_id == chatTemporary?.id),
    [chatMessages]
  );

  const enable = useCallback(() => {
    if (chats === undefined) return;
    if (chats === null) return;

    if (chatTemporary) return;

    const tempChat: ChatGet = {
      ...SAMPLE_CHAT,
      id: PARAM_NAME.CHAT_ID || generateUUID(),
      title: PARAM_NAME.TEMPORARY,
      temporary: true,
      sync_status: SyncStatus.SYNCED,
    };

    setChatTemporary({ ...SAMPLE_CHAT, ...tempChat });
  }, [chats]);

  const disable = useCallback(() => {
    if (chats === undefined) return;
    if (chats === null) return;

    if (!chatTemporary) return;

    setChatTemporary(null);
  }, [chats]);

  return {
    chat: !chatTemporary ? null : { ...chatTemporary, ...chat },
    chatMessages: currentChatMessages,
    enable,
    disable,
  };
};
