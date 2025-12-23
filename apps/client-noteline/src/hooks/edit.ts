'use client';

import { useEffect, useRef, useState } from 'react';

export const useItemEdit = () => {
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setEditingState = (value: boolean) => {
    setEditing(value);
    if (!value) setEditingId(null);
  };

  const startRename = (id: string) => {
    setEditingState(true);
    setEditingId(id);
  };

  // focus effect centralized here
  useEffect(() => {
    if (!editing || !editingId) return;

    const tryFocus = () => {
      const ref = inputRefs.current[editingId];
      if (ref) {
        try {
          ref.focus();
          if (typeof (ref as any).select === 'function') (ref as any).select();
        } catch {
          /* ignore */
        }
        return true;
      }
      return false;
    };

    if (!tryFocus()) {
      const id = window.setTimeout(() => tryFocus(), 0);
      return () => clearTimeout(id);
    }
  }, [editing, editingId]);

  return {
    editing,
    editingId,
    setEditingState,
    startRename,
    inputRefs,
  };
};
