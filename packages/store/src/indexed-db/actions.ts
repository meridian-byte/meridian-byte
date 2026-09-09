import { DBConfig } from '@repo/types';
import { Database, DatabaseError } from './transactions';

let cachedDbPromise: Promise<Database> | null = null;
const activeConnections = new Set<IDBDatabase>();
let isIntentionalDelete = false;

/**
 * Open (or create) the database and apply schema updates if needed.
 */
export const openDatabase = async (config: DBConfig): Promise<Database> => {
  // If a connection is already being established or is open, return it
  if (cachedDbPromise) {
    return cachedDbPromise;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(config.name, config.version);

    request.onerror = () => {
      cachedDbPromise = null;
      console.error('❌ Failed to open database:', request.error);
      reject(new DatabaseError('Failed to open database', request.error ?? undefined));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      activeConnections.add(db);

      db.onversionchange = () => {
        console.warn('⚠️ Database version changed. Closing...');

        db.close();
        activeConnections.delete(db);
        cachedDbPromise = null;

        if (!isIntentionalDelete) {
          window.location.reload();
        }
      };

      resolve(new Database(db));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const tx = (event.target as IDBOpenDBRequest).transaction;

      if (!tx) return;

      console.info('🔧 Upgrading IndexedDB schema...');

      for (const store of config.stores) {
        let objectStore: IDBObjectStore;

        if (!db.objectStoreNames.contains(store.name)) {
          objectStore = db.createObjectStore(store.name, {
            keyPath: store.keyPath,
          });
        } else {
          objectStore = tx.objectStore(store.name);
        }

        // Add any new indexes if missing
        store.indexes?.forEach((index) => {
          if (!objectStore.indexNames.contains(index.name)) {
            objectStore.createIndex(index.name, index.keyPath, index.options);
          }
        });
      }
    };
  });
};

/**
 * Cleanly closes the active connection
 */
export const closeDatabase = (): void => {
  cachedDbPromise = null; // Reset the cache pointer

  if (activeConnections.size > 0) {
    activeConnections.forEach((db) => db.close());
    activeConnections.clear();
  }
};

/**
 * Delete a database completely.
 */
export const deleteDatabase = async (dbName: string): Promise<void> => {
  isIntentionalDelete = true;

  // Close any open connection first
  closeDatabase();

  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      isIntentionalDelete = false;
      console.log(`🗑️ Deleted IndexedDB "${dbName}" successfully.`);
      resolve();
    };

    request.onerror = () => {
      console.error(`❌ Error deleting IndexedDB "${dbName}":`, request.error);
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn(
        `⚠️ Deletion of "${dbName}" is blocked. Close all open tabs using the database.`,
      );
    };
  });
};
