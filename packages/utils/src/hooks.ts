'use client';

import { useRef, useCallback, useEffect } from 'react';

export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Keep callback reference up to date without recreating debounced function
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  // Optional cleanup on unmount
  useEffect(() => cancel, [cancel]);

  return { debouncedCallback, cancel };
};
