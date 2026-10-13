import { useEffect, useRef } from 'react';
import { useField } from '@mantine/form';
import { useStoreNote, useStoreTaskList, useTaskListActions } from '@repo/store';
import { useNoteActions } from '@repo/store';

export function useNoteTitle(noteId: string) {
  const notes = useStoreNote((s) => s.notes);
  const note = notes?.find((ni) => ni.id === noteId);
  const { noteUpdate } = useNoteActions();

  const field = useField({
    initialValue: note?.title || '',
    validate: (value) => (value.trim().length < 1 ? true : null),
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state if store note changes externally
  useEffect(() => {
    if (!notes || !note) return;
    field.setValue(note.title);
  }, [notes, note]);

  // Focus on mount if title is empty
  useEffect(() => {
    if (note?.title.trim()) return;
    inputRef.current?.focus();
  }, []);

  const handleBlur = () => {
    const value = field.getValue().trim();

    if (value.length < 1) {
      field.reset();
    } else {
      if (value !== note?.title && note) {
        noteUpdate({ ...note, title: value });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      field.reset();
      e.currentTarget.blur();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const el = document.querySelector<HTMLInputElement>('.ProseMirror');
      el?.focus();
    }
  };

  return {
    field,
    inputRef,
    handleBlur,
    handleKeyDown,
  };
}

export function useTaskListTitle(taskListId: string) {
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const taskList = taskLists?.find((tl) => tl.id === taskListId);
  const { taskListUpdate } = useTaskListActions();

  const field = useField({
    initialValue: taskList?.title || '',
    validate: (value) => (value.trim().length < 1 ? true : null),
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync field value if taskList title updates externally
  useEffect(() => {
    if (!taskLists || !taskList) return;
    field.setValue(taskList.title);
  }, [taskLists, taskList]);

  // Focus on mount if title is empty
  useEffect(() => {
    if (taskList?.title.trim()) return;
    inputRef.current?.focus();
  }, []);

  const handleBlur = () => {
    const value = field.getValue().trim();

    if (value.length < 1) {
      field.reset();
    } else if (value !== taskList?.title && taskList) {
      taskListUpdate({ ...taskList, title: value });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      field.reset();
      e.currentTarget.blur();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      // Adjust selector to focus on your task list container or first item input
      const el = document.querySelector<HTMLInputElement>('.task-item-input');
      el?.focus();
    }
  };

  return {
    field,
    inputRef,
    handleBlur,
    handleKeyDown,
  };
}
