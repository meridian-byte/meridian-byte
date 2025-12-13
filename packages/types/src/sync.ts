// Add new type to handle deleted items
export type SyncItem = {
  id: string;
  deleted?: boolean;
  [key: string]: any;
};

export type SyncParams = {
  items: SyncItem[];
  deletedItems?: any[]; // Add array of deleted items
  dataStore: string;
  stateUpdateFunction: (items: any[]) => void;
  stateUpdateFunctionDeleted: () => void;
  serverUpdateFunction: (items: any[], deletedIds?: string[]) => Promise<void>;
};
