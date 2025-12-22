import { FileBackupConfig } from '@repo/types/fsa';

export const defaultBackupConfig: FileBackupConfig = {
  suggestedName: 'backup.json',
  description: 'Application backup file',
  mime: 'application/json',
  extension: '.json',
};
