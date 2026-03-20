import { sortArray } from '@repo/utilities/array';
import {
  getTasksByDate,
  getTasksCategorized,
  getTasksPrioritized,
  GroupedReturnType,
} from '@repo/services/logic/view';
import { GroupSort } from '@repo/types/models/enums';
import { useEffect, useMemo, useState } from 'react';
import { Order } from '@repo/types/enums';
import { TaskGet } from '@repo/types/models/task';
import { usePathname } from 'next/navigation';
import { linkify } from '@repo/utilities/url';
import { useStoreView } from '@repo/libraries/zustand/stores/view';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreReminder } from '@repo/libraries/zustand/stores/reminder';

export const useGetOrganizedTasks = (props: {
  tasks: TaskGet[];
  completeTasks?: boolean;
  defaultGroupTitle?: string;
}) => {
  const pathname = usePathname();
  const views = useStoreView((s) => s.views);
  const reminders = useStoreReminder((s) => s.reminders);
  const view = useMemo(
    () => views?.find((v) => v.title == linkify(pathname)),
    [views, pathname]
  );

  const { group_by, sort_by, filter_by } = {
    group_by: view?.group_by,
    sort_by: view?.sort_by,
    filter_by: {
      priority: view?.priority_filter,
      category: view?.category_filter,
    },
  };
  const { priority, category } = filter_by;

  let organizedTasks: GroupedReturnType[] = [];
  const [organizedTasksState, setOrganizedTasksState] = useState<
    GroupedReturnType[]
  >([]);

  const completionStatusTasks = props.tasks.filter((t) =>
    props?.completeTasks ? !!t.complete : !t.complete
  );
  const categories = useStoreCategory((s) => s.categories);

  const defaultGroup: GroupedReturnType = {
    id: 'default',
    title: props.defaultGroupTitle || 'All Tasks',
    tasks: completionStatusTasks,
  };

  const getOrganizedTasks = () => {
    if (group_by) {
      switch (group_by) {
        case GroupSort.PRIORITY:
          organizedTasks = sortArray(
            getTasksPrioritized({ tasks: completionStatusTasks }),
            (item) => item.title,
            Order.ASCENDING
          );
          break;

        case GroupSort.CATEGORY:
          // get tasks without categories
          const tasksWithoutCategory = completionStatusTasks.filter(
            (task) => !task.category_id
          );

          organizedTasks = [
            ...sortArray(
              getTasksCategorized({
                tasks: completionStatusTasks,
                categories: categories || [],
              }),
              (item) => item.title,
              Order.ASCENDING
            ),
            {
              id: 'inbox',
              title: 'Uncategorized',
              tasks: tasksWithoutCategory,
            },
          ];
          break;

        case GroupSort.DATE:
          // get tasks not due

          const tasksWithoutDueDate = completionStatusTasks.filter((task) => {
            const taskReminders = reminders?.filter(
              (ri) => ri.task_id == task.id
            );
            return !task.due_date && !taskReminders?.length;
          });

          organizedTasks = [
            ...sortArray(
              getTasksByDate({
                tasks: completionStatusTasks,
                reminders: reminders || [],
              }),
              (item) => new Date(item.title),
              Order.ASCENDING
            ),
            {
              id: '',
              title: 'No Due Date',
              tasks: tasksWithoutDueDate,
            },
          ];
          break;

        default:
          // Default to ungrouped tasks
          organizedTasks = [
            {
              ...defaultGroup,
              tasks: sortArray(
                defaultGroup.tasks,
                (item) => new Date(item.created_at),
                Order.DESCENDING
              ),
            },
          ];
          break;
      }
    } else {
      // If no grouping is selected, treat all tasks as a single group.
      organizedTasks = [
        {
          ...defaultGroup,
          tasks: sortArray(
            defaultGroup.tasks,
            (item) => new Date(item.created_at),
            Order.DESCENDING
          ),
        },
      ];
    }

    if (sort_by) {
      switch (sort_by) {
        case GroupSort.PRIORITY:
          // sort group tasks by priority
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => item.priority,
                Order.ASCENDING
              ),
            };
          });
          break;

        case GroupSort.CATEGORY:
          // sort group tasks by category
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => item.category_id,
                Order.ASCENDING
              ),
            };
          });
          break;

        case GroupSort.DATE:
          // sort group tasks by date
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => (item.due_date ? new Date(item.due_date) : null),
                Order.ASCENDING
              ),
            };
          });
          break;

        default:
          // sort group tasks by title
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => item.title,
                Order.ASCENDING
              ),
            };
          });
          break;
      }
    }

    if (priority) {
      organizedTasks = organizedTasks
        .map((group) => {
          return {
            ...group,
            tasks: group.tasks.filter((task) => task.priority === priority),
          };
        })
        .filter((g) => g.tasks.length);
    }

    if (category) {
      organizedTasks = organizedTasks
        .map((group) => {
          return {
            ...group,
            tasks: group.tasks.filter((task) => task.category_id === category),
          };
        })
        .filter((g) => g.tasks.length);
    }

    setOrganizedTasksState(organizedTasks);
  };

  useEffect(() => {
    if (views == null) return;
    getOrganizedTasks();
  }, [views, props.tasks]);

  return { organizedTasksState, getOrganizedTasks };
};
