import { sortArray } from '@repo/utilities/array';
import {
  getTasksByDate,
  getTasksCategorized,
  getTasksPrioritized,
  GroupedReturnType,
} from '@repo/services/logic/view';
import { useForm, UseFormReturnType } from '@mantine/form';
import {
  GroupSort,
  Priority,
  SortDirection,
  Status,
  SyncStatus,
  ViewType,
} from '@repo/types/models/enums';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Order } from '@repo/types/enums';
import { TaskRelations } from '@repo/types/models/task';
import { usePathname } from 'next/navigation';
import { linkify } from '@repo/utilities/url';
import { ViewGet, ViewUpdate } from '@repo/types/models/view';
import { generateUUID } from '@repo/utilities/generators';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useStoreView } from '@repo/libraries/zustand/stores/view';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreReminder } from '@repo/libraries/zustand/stores/reminder';

export type FormView = {
  view: ViewType;
  group_by: GroupSort;
  sort_by: GroupSort;
  sort_direction: SortDirection;
  filter_by: {
    priority: Priority;
    category: string;
  };
};

export type FormTaskView = UseFormReturnType<
  FormView,
  (values: FormView) => FormView
>;

export const useFormTaskView = () => {
  const pathname = usePathname();
  const session = useStoreSession((s) => s.session);
  const views = useStoreView((s) => s.views);
  const setViews = useStoreView((s) => s.setViews);
  const view = useMemo(
    () => views?.find((v) => v.title == linkify(pathname)),
    [views, pathname]
  );

  const form = useForm<Partial<ViewGet>>({
    initialValues: {
      view: view?.view,

      group_by: view?.group_by || null,
      sort_by: view?.sort_by || null,
      sort_direction: view?.sort_direction || null,

      priority_filter: view?.priority_filter || null,
      category_filter: view?.category_filter || null,
    },
  });

  const updateView = (params: { view: ViewGet; reset?: boolean }) => {
    if (!session) return;
    if (views == undefined) return;
    if (views == null) return;

    const formValues = form.getValues();
    const now = new Date();

    if (!view) {
      const viewObject: ViewGet = {
        id: generateUUID(),
        title: linkify(pathname),
        view: formValues.view || null,
        group_by: formValues.group_by || null,
        sort_by: formValues.sort_by || null,
        sort_direction: formValues.sort_direction || null,
        priority_filter: formValues.priority_filter || null,
        category_filter: formValues.category_filter || null,
        status: Status.ACTIVE,
        sync_status: SyncStatus.PENDING,
        profile_id: session.id,
        created_at: now.toISOString() as any,
        updated_at: now.toISOString() as any,
      };

      // add to state
      setViews([...views, viewObject]);
    } else {
      const viewObjectUpdate: ViewGet = {
        ...params.view,
        view: params?.reset ? ('' as any) : formValues.view,
        group_by: params?.reset ? ('' as any) : formValues.group_by,
        sort_by: params?.reset ? ('' as any) : formValues.sort_by,
        sort_direction: params?.reset ? ('' as any) : formValues.sort_direction,
        priority_filter: params?.reset
          ? ('' as any)
          : formValues.priority_filter,
        category_filter: params?.reset
          ? ('' as any)
          : formValues.category_filter,
        status: Status.ACTIVE,
        sync_status: SyncStatus.PENDING,
        updated_at: now.toISOString() as any,
      };

      // update in state
      setViews(
        views.map((v) => {
          if (v.title !== linkify(pathname)) return v;
          return { ...v, ...viewObjectUpdate };
        })
      );
    }
  };

  const tasks = useStoreTask((s) => s.tasks);

  const prevFormValuesRef = useRef<any | null>(null);

  useEffect(() => {
    if (views == undefined) return;
    if (views == null) return;
    if (!view) return;
    const formValues = form.getValues();
    if (prevFormValuesRef.current == null) return;
    if (prevFormValuesRef.current == formValues) return;

    // don't run if form values are the same as the view
    if (
      view.view == formValues.view &&
      view.group_by == formValues.group_by &&
      view.sort_by == formValues.sort_by &&
      view.sort_direction == formValues.sort_direction &&
      view.priority_filter == formValues.priority_filter &&
      view.category_filter == formValues.category_filter
    )
      return;

    // add way to pass selected task here
    // updateView();
  }, [form.values, tasks]);

  useEffect(() => {
    if (views == null) return;
    if (!view) return;

    const current = form.values;

    const same =
      current.view === view.view &&
      current.group_by === view.group_by &&
      current.sort_by === view.sort_by &&
      current.sort_direction === view.sort_direction &&
      current.priority_filter === view.priority_filter &&
      current.category_filter === view.category_filter;

    if (same) return;

    form.setValues({
      view: view.view as ViewType,
      group_by: view.group_by as GroupSort,
      sort_by: view.sort_by as GroupSort,
      sort_direction: view.sort_direction as SortDirection,
      priority_filter: view.priority_filter as Priority,
      category_filter: view.category_filter as string,
    });

    // update 'prevFormValuesRef'
    prevFormValuesRef.current = form.values;
  }, [views]);

  return { form, exclusion: '', updateView, view };
};

export const useGetOrganizedTasks = (props: {
  tasks: TaskRelations[];
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
          const tasksWithoutDueDate = completionStatusTasks.filter(
            (task) => !task.due_date && !task.reminders?.length
          );

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
