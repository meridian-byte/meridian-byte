import { useStoreChat } from '@repo/libraries/zustand/stores/chat';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { ChatGet } from '@repo/types/models/chat';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useItemEditContext } from '../contexts/item-edit';
import { usePathname, useRouter } from 'next/navigation';

export const useChatActions = () => {
  const session = useStoreSession((s) => s.session);
  const addChat = useStoreChat((s) => s.addChat);
  const updateChat = useStoreChat((s) => s.updateChat);
  const deleteChat = useStoreChat((s) => s.deleteChat);

  const pathname = usePathname();
  const router = useRouter();

  const { editing, editingId, setEditingState, startRename, inputRefs } =
    useItemEditContext();

  const chatCreate = (params: Partial<ChatGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newChat: ChatGet = {
      id: params.id || id,
      archived: params.archived || false,
      profile_id: session.id || params.profile_id || '',
      temporary: params.temporary || false,
      title: params.title || 'New Chat',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addChat(newChat);

    return newChat;
  };

  const chatUpdate = (params: ChatGet) => {
    if (!session) return;

    const now = new Date();

    const newChat: ChatGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateChat(newChat);
  };

  const chatArchive = (params: ChatGet) => {
    if (!session) return;

    const now = new Date();

    const newChat: ChatGet = {
      ...params,
      archived: true,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateChat(newChat);
  };

  const chatDelete = (params: ChatGet) => {
    if (!session) return;

    const now = new Date();

    deleteChat({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });

    if (pathname.includes(params.id)) router.push('/app');
  };

  return {
    chatCreate,
    chatUpdate,
    chatArchive,
    chatDelete,
    // rename stuff
    chatEditing: editing,
    chatEditingId: editingId,
    setChatEditingState: setEditingState,
    startChatRename: startRename,
    chatInputRefs: inputRefs,
  };
};
