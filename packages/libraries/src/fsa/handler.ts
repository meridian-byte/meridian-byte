import { FileSyncAdapter } from '@repo/types/fsa';

// file sync adapter pattern implementation
export function createFileSyncAdapter(
  dirHandle: FileSystemDirectoryHandle,
  fileName: string
): FileSyncAdapter {
  async function ensureAccess(): Promise<boolean> {
    const perm = await dirHandle.queryPermission({ mode: 'readwrite' });
    if (perm === 'granted') return true;
    const req = await dirHandle.requestPermission({ mode: 'readwrite' });
    return req === 'granted';
  }

  async function atomicWrite(data: object) {
    const tmpName = `${fileName}.tmp`;

    // --- 1. Write JSON to temp file -------------------------------------
    const tmpHandle = await dirHandle.getFileHandle(tmpName, { create: true });
    const tmpWritable = await tmpHandle.createWritable();
    const json = JSON.stringify(data, null, 2);
    await tmpWritable.write(json);
    await tmpWritable.close();

    // --- 2. Remove final file (if exists) --------------------------------
    try {
      await dirHandle.removeEntry(fileName);
    } catch (_) {}

    // --- 3. Copy temp → final -------------------------------------------
    const finalHandle = await dirHandle.getFileHandle(fileName, {
      create: true,
    });

    const finalWritable = await finalHandle.createWritable();
    await finalWritable.write(json);
    await finalWritable.close();

    // --- 4. Cleanup temp -------------------------------------------------
    await dirHandle.removeEntry(tmpName);
  }

  return {
    async ensureAccess() {
      return ensureAccess();
    },

    async writeBackup(bundle) {
      const ok = await ensureAccess();
      if (!ok) throw new Error('Permission denied');

      try {
        await atomicWrite(bundle);
      } catch (err) {
        console.error('Backup write failed:', err);
      }
    },

    async readBackup() {
      const ok = await ensureAccess();
      if (!ok) return null;
      try {
        const fileHandle = await dirHandle.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        return JSON.parse(await file.text());
      } catch (err) {
        console.error('Backup read failed:', err);
        return null;
      }
    },
  };
}
