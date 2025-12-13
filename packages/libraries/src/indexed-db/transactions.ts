/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export class DatabaseError extends Error {
  cause?: DOMException;

  constructor(message: string, cause?: DOMException) {
    super(message);
    this.name = 'DatabaseError';
    this.cause = cause;
  }
}

export class Database {
  private db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.db = db;
  }

  // --- Helpers --------------------------------------------------------

  private getTransaction(storeName: string, mode: IDBTransactionMode) {
    const tx = this.db.transaction(storeName, mode);
    tx.onerror = () =>
      console.error(`Transaction failed for store: ${storeName}`);
    return tx.objectStore(storeName);
  }

  // ✅ Overloaded helper for precise typing
  private static wrapRequest<T>(request: IDBRequest<T>): Promise<T>;
  private static wrapRequest<T>(request: IDBRequest<T[]>): Promise<T[]>;
  private static wrapRequest<T>(
    request: IDBRequest<T | T[]>
  ): Promise<T | T[]> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // --- CRUD -----------------------------------------------------------

  async get<T>(
    storeName: string,
    key?: IDBValidKey,
    options?: { index?: string }
  ): Promise<T | T[] | undefined> {
    const tx = this.db.transaction(storeName, 'readonly');
    const store = options?.index
      ? tx.objectStore(storeName).index(options.index)
      : tx.objectStore(storeName);

    const request = key !== undefined ? store.get(key) : store.getAll();
    const result = await Database.wrapRequest(request);
    return result ?? (Array.isArray(result) ? [] : undefined);
  }

  async add<T extends object>(
    storeName: string,
    data: T | T[]
  ): Promise<IDBValidKey[]> {
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const keys: IDBValidKey[] = [];

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(keys);
      tx.onerror = () =>
        reject(new DatabaseError(`Failed to add record(s) to ${storeName}`));

      (Array.isArray(data) ? data : [data]).forEach((item) => {
        const req = store.add(item);
        req.onsuccess = () => keys.push(req.result);
      });
    });
  }

  async put<T extends object>(
    storeName: string,
    data: T | T[]
  ): Promise<IDBValidKey[]> {
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const keys: IDBValidKey[] = [];

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(keys);
      tx.onerror = () =>
        reject(new DatabaseError(`Failed to update record(s) in ${storeName}`));

      (Array.isArray(data) ? data : [data]).forEach((item) => {
        const req = store.put(item);
        req.onsuccess = () => keys.push(req.result);
      });
    });
  }

  async delete<T extends { [key: string]: any }>(
    storeName: string,
    data: T | T[],
    keyPath?: string
  ): Promise<IDBValidKey[]> {
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const actualKeyPath = keyPath || (store.keyPath as string);

    if (!actualKeyPath) throw new DatabaseError('Invalid or missing keyPath.');

    const keys: IDBValidKey[] = [];

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(keys);
      tx.onerror = () =>
        reject(
          new DatabaseError(
            `Transaction failed while deleting from ${storeName}`
          )
        );

      (Array.isArray(data) ? data : [data]).forEach((item) => {
        const key = item[actualKeyPath];
        const req = store.delete(key);
        req.onsuccess = () => keys.push(key);
      });
    });
  }

  // --- Utilities ------------------------------------------------------

  async clear(storeName: string): Promise<void> {
    const store = this.getTransaction(storeName, 'readwrite');
    await Database.wrapRequest(store.clear());
  }

  async count(storeName: string): Promise<number> {
    const store = this.getTransaction(storeName, 'readonly');
    return await Database.wrapRequest(store.count());
  }

  close(): void {
    this.db.close();
  }
}
