import { useStoreChatMessage } from '@repo/libraries/zustand/stores/chat-message';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { ChatMessageGet } from '@repo/types/models/chat-message';
import { ChatMessageRole, Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useChatMessageActions = () => {
  const session = useStoreSession((s) => s.session);
  const addChatMessage = useStoreChatMessage((s) => s.addChatMessage);
  const updateChatMessage = useStoreChatMessage((s) => s.updateChatMessage);
  const deleteChatMessage = useStoreChatMessage((s) => s.deleteChatMessage);

  const chatMessageCreate = (params: Partial<ChatMessageGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newChatMessage: ChatMessageGet = {
      id: params.id || id,
      chat_id: params.chat_id || '',
      content: params.content || '',
      error: params.error || '',
      profile_id: session.id || params.profile_id || '',
      role: params.role || ChatMessageRole.USER,
      sources: params.sources || [],
      search: params.search || false,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addChatMessage(newChatMessage);
  };

  const chatMessageUpdate = (params: ChatMessageGet) => {
    if (!session) return;

    const now = new Date();

    const newChatMessage: ChatMessageGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateChatMessage(newChatMessage);
  };

  const chatMessageDelete = (params: ChatMessageGet) => {
    if (!session) return;

    const now = new Date();

    deleteChatMessage({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { chatMessageCreate, chatMessageUpdate, chatMessageDelete };
};
