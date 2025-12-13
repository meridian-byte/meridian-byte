/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

const urlSizeCache = new Map<string, number>();

/**
 * Get file size in bytes from a File object or a remote URL.
 * Caches remote URL sizes to avoid repeated HEAD requests.
 * @param fileOrUrl - File object or URL string
 * @param useCache - Whether to use cached value for remote URLs (default: true)
 * @returns file size in bytes, or 0 if unknown
 */
export const getFileSize = async (
  fileOrUrl: File | string,
  useCache: boolean = true
): Promise<number> => {
  try {
    if (typeof fileOrUrl === 'string') {
      // Remote URL
      if (useCache && urlSizeCache.has(fileOrUrl)) {
        return urlSizeCache.get(fileOrUrl)!;
      }

      const response = await fetch(fileOrUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn(
          `Unable to fetch headers for ${fileOrUrl}: ${response.status}`
        );
        return 0;
      }

      const contentLength = response.headers.get('Content-Length');
      const size = contentLength ? parseInt(contentLength, 10) : 0;

      if (useCache) urlSizeCache.set(fileOrUrl, size);
      return size;
    } else if (fileOrUrl instanceof File) {
      // Local File object
      return fileOrUrl.size;
    } else {
      console.warn('---> getFileSize: Invalid input');
      return 0;
    }
  } catch (error) {
    console.error('---> utility error (getFileSize):', error);
    return 0;
  }
};

/**
 * Convert bytes to human-readable format
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/** Extract file extension from file name */
export const getFileExtension = (fileName: string) =>
  fileName.split('.').pop()?.toLowerCase() ?? '';

/** Check if file is an image */
export const isImageFile = (file: File) => file.type.startsWith('image/');

/** Check if file is a PDF */
export const isPdfFile = (file: File) => file.type === 'application/pdf';

/** Sanitize file name for safe storage/download */
export const sanitizeFileName = (name: string) =>
  name.replace(/[^a-z0-9_.-]/gi, '_');

/** Convert a File or Blob to Base64 string */
export const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** Convert a File or Blob to text */
export const fileToText = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });

/** Convert a File or Blob to ArrayBuffer */
export const fileToArrayBuffer = (file: File | Blob): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

/** Trigger a download from a Blob */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/** Trigger a download from a remote URL */
export const downloadUrl = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/** Extract metadata from a File object */
export const getFileInfo = (file: File) => ({
  name: file.name,
  size: file.size,
  formattedSize: formatFileSize(file.size),
  type: file.type,
  lastModified: new Date(file.lastModified),
});

/** Validate file by size and allowed MIME types */
export const validateFile = (
  file: File,
  options: { maxSize?: number; allowedTypes?: string[] }
): boolean => {
  if (options.maxSize && file.size > options.maxSize) return false;
  if (options.allowedTypes && !options.allowedTypes.includes(file.type))
    return false;
  return true;
};

/** Slice a file into chunks of specified size (bytes) */
export const sliceFile = (file: File, chunkSize: number): Blob[] => {
  const chunks: Blob[] = [];
  let start = 0;
  while (start < file.size) {
    chunks.push(file.slice(start, start + chunkSize));
    start += chunkSize;
  }
  return chunks;
};
