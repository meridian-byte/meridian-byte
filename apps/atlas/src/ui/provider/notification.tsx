'use client';

import { useNotification } from '@repo/hooks';
import { useReminderActions, useStoreReminder, useStoreTask } from '@repo/store';
import { Variant } from '@repo/types';
import { getRegionalDate } from '@repo/utils';
import React, { useEffect, useRef } from 'react';

export default function Notification({ children }: { children: React.ReactNode }) {
  const { showNotification } = useNotification();
  const { reminderUpdate } = useReminderActions();

  const tasks = useStoreTask((s) => s.tasks);
  const reminders = useStoreReminder((s) => s.reminders);

  // Tracks IDs notified during this active browser session to prevent immediate re-fires
  const notifiedReminderIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!reminders || !tasks) return;

    const checkReminders = () => {
      const now = new Date();

      reminders.forEach((reminder) => {
        // If the reminder is reset to sent: false, remove it from the session lock
        if (!reminder.sent && notifiedReminderIds.current.has(reminder.id)) {
          notifiedReminderIds.current.delete(reminder.id);
        }

        // Skip if already sent or currently locked in session
        if (reminder.sent || notifiedReminderIds.current.has(reminder.id)) {
          return;
        }

        const remindTime = new Date(reminder.remindAt);
        const timeDiff = remindTime.getTime() - now.getTime();

        // Trigger if due now or up to 15 seconds late
        if (timeDiff <= 0 && timeDiff > -15000) {
          const associatedTask = tasks.find((t) => t.id === reminder.taskId);
          const dueDate = !associatedTask?.dueDate ? null : getRegionalDate(associatedTask.dueDate);

          if (associatedTask && !associatedTask.complete) {
            showNotification({
              autoClose: 10000,
              title: associatedTask.title,
              desc: `${getRegionalDate(remindTime).time.toUpperCase()} reminder for task due${!dueDate ? '' : ` on ${dueDate.date}`}.`,
            });

            // 1. Mark in session ref to block immediate duplicate frames
            notifiedReminderIds.current.add(reminder.id);

            // 2. Persist `sent: true` to state & queue DB sync
            reminderUpdate({
              ...reminder,
              sent: true,
            });
          }
        }
      });
    };

    checkReminders();
    const intervalId = setInterval(checkReminders, 10000);

    return () => clearInterval(intervalId);
  }, [reminders, tasks, showNotification, reminderUpdate]);

  return <div>{children}</div>;
}
