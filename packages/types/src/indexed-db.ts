export interface DBStoreConfig {
  name: string;
  keyPath: string;
  indexes?: {
    name: string;
    keyPath: string | string[];
    options?: IDBIndexParameters;
  }[];
}

export interface DBConfig {
  name: string;
  version: number;
  stores: DBStoreConfig[];
}
