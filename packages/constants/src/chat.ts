import { ChatGet } from '@repo/types/models/chat';
import { Status, SyncStatus } from '@repo/types/models/enums';

const now = new Date();

export const SAMPLE_CHAT: ChatGet = {
  id: '',
  title: 'New Chat',
  archived: false,
  temporary: false,
  profile_id: '',
  status: Status.ACTIVE,
  sync_status: SyncStatus.SYNCED,
  created_at: now.toISOString() as any,
  updated_at: now.toISOString() as any,
};
