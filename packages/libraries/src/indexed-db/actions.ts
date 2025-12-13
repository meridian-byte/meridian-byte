/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { DBConfig } from '@repo/types/indexed-db';
import { Database, DatabaseError } from './transactions';

/**
 * Open (or create) the database and apply schema updates if needed.
 */
export const openDatabase = async (config: DBConfig): Promise<Database> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(config.name, config.version);

    request.onerror = () => {
      console.error('❌ Failed to open database:', request.error);
      reject(
        new DatabaseError('Failed to open database', request.error ?? undefined)
      );
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      db.onversionchange = () => {
        console.warn('⚠️ Database version changed. Closing...');
        db.close();
        window.location.reload();
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
 * Delete a database completely.
 */
export const deleteDatabase = async (dbName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      console.log(`🗑️ Deleted IndexedDB "${dbName}" successfully.`);
      resolve();
    };

    request.onerror = () => {
      console.error(`❌ Error deleting IndexedDB "${dbName}":`, request.error);
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn(
        `⚠️ Deletion of "${dbName}" is blocked. Close all open tabs using the database.`
      );
    };
  });
};
