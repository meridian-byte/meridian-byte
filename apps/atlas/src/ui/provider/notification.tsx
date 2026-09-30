'use client';

import { audios } from '@repo/constants';
import { useNotification } from '@repo/hooks';
import { useReminderActions, useStoreEvent, useStoreReminder, useStoreTask } from '@repo/store';
import { getRegionalDate } from '@repo/utils';
import React, { useEffect, useRef } from 'react';

export default function Notification({ children }: { children: React.ReactNode }) {
  const { showNotification } = useNotification();
  const { reminderUpdate } = useReminderActions();

  const tasks = useStoreTask((s) => s.tasks);
  const events = useStoreEvent((s) => s.events);
  const reminders = useStoreReminder((s) => s.reminders);

  // Tracks IDs notified during this active browser session to prevent immediate re-fires
  const notifiedReminderIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!reminders) return;
    if (!tasks && !events) return;

    const checkReminders = () => {
      const now = new Date();

      reminders.forEach((reminder) => {
        // Clear session lock if reminder was reset to unsent
        if (!reminder.sent && notifiedReminderIds.current.has(reminder.id)) {
          notifiedReminderIds.current.delete(reminder.id);
        }

        // Skip if already sent or currently locked in session
        if (reminder.sent || notifiedReminderIds.current.has(reminder.id)) {
          return;
        }

        const remindTime = new Date(reminder.remindAt);
        const timeDiff = remindTime.getTime() - now.getTime();

        // Skip if not due within the target window (due now or up to 15 seconds late)
        if (timeDiff > 0 || timeDiff <= -15000) {
          return;
        }

        // Determine the associated item and its notification payload
        let targetItem: { title: string; desc: string } | null = null;

        if (reminder.taskId && tasks) {
          const task = tasks.find((t) => t.id === reminder.taskId);
          if (task && !task.complete) {
            const dueDate = task.dueDate ? getRegionalDate(task.dueDate) : null;
            targetItem = {
              title: task.title,
              desc: `${getRegionalDate(remindTime).time.toUpperCase()} reminder for task due${dueDate ? ` on ${dueDate.date}` : ''}.`,
            };
          }
        } else if (reminder.eventId && events) {
          const event = events.find((e) => e.id === reminder.eventId);
          if (event && new Date(event.start) > now) {
            const startDate = event.start ? getRegionalDate(event.start) : null;
            targetItem = {
              title: event.title,
              desc: `${getRegionalDate(remindTime).time.toUpperCase()} reminder for event starting${startDate ? ` at ${startDate.time.toUpperCase()}` : ''}.`,
            };
          }
        }

        // Dispatch notification and lock if a valid item was found
        if (targetItem) {
          setTimeout(() => {
            showNotification({
              autoClose: 10000,
              title: targetItem.title,
              desc: targetItem.desc,
            });
          }, 1000);

          // 1. Mark in session ref to block immediate duplicate frames
          notifiedReminderIds.current.add(reminder.id);

          // 2. Persist `sent: true` to state & queue DB sync
          reminderUpdate({
            ...reminder,
            sent: true,
          });
        }
      });
    };

    checkReminders();
    const intervalId = setInterval(checkReminders, 10000);

    return () => clearInterval(intervalId);
  }, [reminders, tasks, events, showNotification, reminderUpdate]);

  return <div>{children}</div>;
}
