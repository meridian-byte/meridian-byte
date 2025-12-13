export interface FileBackupConfig {
  suggestedName: string; // "backup.json"
  description: string; // "App data backup"
  mime: string; // "application/json"
  extension: string; // ".json"
}

export interface FileSyncAdapter {
  writeBackup: (items: any) => Promise<void>;
  readBackup: () => Promise<any | null>;
  ensureAccess: () => Promise<boolean>;
}
