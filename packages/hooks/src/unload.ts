import { useEffect } from 'react';

export function useBeforeUnload({
  shouldWarn = true,
  onBeforeUnload,
}: {
  shouldWarn?: boolean;
  onBeforeUnload?: () => void;
}) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!shouldWarn) return;

      if (onBeforeUnload) {
        onBeforeUnload();
        return;
      }

      const message =
        'You have unsaved changes. Are you sure you want to leave?';
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [shouldWarn, onBeforeUnload]);
}
