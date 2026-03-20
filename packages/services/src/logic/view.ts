import { Priority } from '@repo/types/models/enums';
import { getPriorityColor } from './priority-color';
import { getRegionalDate } from '@repo/utilities/date-time';
import { TIME_FORMAT } from '@repo/constants/other';
import { TaskGet } from '@repo/types/models/task';
import { CategoryGet } from '@repo/types/models/category';
import { areSameDay, deduplicateDates } from '@repo/utilities/date-time';
import { ReminderGet } from '@repo/types/models/reminder';

export type GroupedReturnType = {
  id: string;
  title: string;
  tasks: TaskGet[];
  color?: string;
};

export const getTasksCategorized = (params: {
  tasks: TaskGet[];
  categories: CategoryGet[];
}): GroupedReturnType[] => {
  const incompleteTasks = params.tasks.filter((t) => !t.complete);

  const tasksCategorized = params.categories.map((category) => {
    return {
      id: category.id,
      title: category.title,
      tasks: incompleteTasks.filter((task) => task.category_id == category.id),
    };
  });

  return tasksCategorized.filter((c) => c.tasks.length);
};

export const getTasksPrioritized = (params: {
  tasks: TaskGet[];
}): GroupedReturnType[] => {
  const incompleteTasks = params.tasks.filter((t) => !t.complete);

  const priority1 = incompleteTasks.filter(
    (t) => t.priority == Priority.URGENT_IMPORTANT
  );
  const priority2 = incompleteTasks.filter(
    (t) => t.priority == Priority.URGENT_UNIMPORTANT
  );
  const priority3 = incompleteTasks.filter(
    (t) => t.priority == Priority.NOT_URGENT_IMPORTANT
  );
  const priority4 = incompleteTasks.filter(
    (t) => t.priority == Priority.NOT_URGENT_UNIMPORTANT
  );

  const tasksPrioritized = [
    {
      id: Priority.URGENT_IMPORTANT,
      title: 'Priority I',
      tasks: priority1,
      color: getPriorityColor(Priority.URGENT_IMPORTANT),
    },
    {
      id: Priority.URGENT_UNIMPORTANT,
      title: 'Priority II',
      tasks: priority2,
      color: getPriorityColor(Priority.URGENT_UNIMPORTANT),
    },
    {
      id: Priority.NOT_URGENT_IMPORTANT,
      title: 'Priority III',
      tasks: priority3,
      color: getPriorityColor(Priority.NOT_URGENT_IMPORTANT),
    },
    {
      id: Priority.NOT_URGENT_UNIMPORTANT,
      title: 'Priority IV',
      tasks: priority4,
      color: getPriorityColor(Priority.NOT_URGENT_UNIMPORTANT),
    },
  ];

  return tasksPrioritized.filter((p) => p.tasks.length);
};

export const getTasksByDate = (params: {
  tasks: TaskGet[];
  reminders: ReminderGet[];
}): GroupedReturnType[] => {
  const incompleteTasks = params.tasks.filter((t) => !t.complete);
  const tasksDue = incompleteTasks.filter((t) => {
    const taskReminders = params.reminders?.filter((ri) => ri.task_id == t.id);
    return t.due_date || taskReminders.length;
  });

  const uniqueDueDates: Date[] = deduplicateDates(
    tasksDue.map((t) => {
      const taskReminders = params.reminders?.filter(
        (ri) => ri.task_id == t.id
      );
      return new Date(t.due_date || taskReminders[0].remind_at);
    })
  );

  // return all tasks with the same due date
  const tasksByDate = uniqueDueDates.map((date) => {
    const dateObj = new Date(date);

    return {
      id: dateObj.toISOString(),
      title: getRegionalDate(dateObj, {
        format: 'full',
        locale: TIME_FORMAT.LOCALE,
      }).date,
      tasks: incompleteTasks.filter((task) => {
        const taskReminders = params.reminders?.filter(
          (ri) => ri.task_id == task.id
        );

        if (task.due_date || taskReminders.length) {
          return areSameDay(
            new Date(
              (task.due_date || (taskReminders || [])[0].remind_at) as Date
            ),
            dateObj
          );
        } else {
          return false;
        }
      }),
    };
  });

  return tasksByDate.filter((t) => t.tasks.length);
};
