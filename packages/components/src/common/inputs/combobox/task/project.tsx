'use client';

import {
  CloseButton,
  Combobox,
  ComboboxChevron,
  ComboboxDropdown,
  ComboboxEmpty,
  ComboboxOption,
  ComboboxOptions,
  ComboboxSearch,
  ComboboxTarget,
  Group,
  InputBase,
  InputPlaceholder,
  Text,
  useCombobox,
} from '@mantine/core';
import { FormTask } from '@repo/hooks/form/task';
import { IconCategory, IconInbox } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useState } from 'react';
import { FormTaskView } from '@repo/hooks/form/task/view';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';

export default function Project({
  props,
}: {
  props: {
    formTask?: FormTask;
    formTaskView?: FormTaskView;
    inputProps?: { width?: any };
  };
}) {
  const [search, setSearch] = useState('');

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const categories = useStoreCategory((s) => s.categories);

  const items = [
    { value: 'inbox', component: 'Inbox' },
    ...(categories || []).map((category) => {
      return {
        value: category.id,
        component: category.title,
      };
    }),
  ];

  const getFilteredOptions = (params: {
    data: any[];
    searchQuery: string;
    limit: number;
  }) => {
    const result: any[] = [];

    for (let i = 0; i < params.data.length; i += 1) {
      if (result.length === params.limit) {
        break;
      }

      const cat = categories?.find((c) => c.id == params.data[i].value);

      const searchVal = params.searchQuery.trim().toLowerCase();

      if (
        (cat && cat.title.toLowerCase().includes(searchVal)) ||
        params.data[i].value.includes(searchVal)
      ) {
        result.push(params.data[i]);
      }
    }

    return result;
  };

  const filteredOptions = getFilteredOptions({
    data: items,
    searchQuery: search,
    limit: 5,
  });

  const options = filteredOptions.map((item, index) => (
    <ComboboxOption key={index} value={item.value}>
      <Group gap={'xs'}>
        <IconCategory
          size={ICON_SIZE}
          stroke={ICON_STROKE_WIDTH}
          color={item.color}
        />

        <Text component={'span'} inherit>
          {item.component}
        </Text>
      </Group>
    </ComboboxOption>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (props.formTask) {
          props.formTask.setFieldValue('category_id', val);
        }

        if (props.formTaskView) {
          props.formTaskView.setFieldValue('filter_by.category', val);
        }

        combobox.closeDropdown();
        setSearch('');
      }}
    >
      <ComboboxTarget>
        <InputBase
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-body)',
            },
          }}
          component="button"
          type="button"
          size="xs"
          p={0}
          w={props.inputProps?.width || 'fit-content'}
          pointer
          onClick={() => combobox.toggleDropdown()}
          rightSection={
            props.formTask?.values.category_id ||
            props.formTaskView?.values.filter_by.category ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (props.formTask) {
                    props.formTask.setFieldValue('category_id', '');
                  }

                  if (props.formTaskView) {
                    props.formTaskView.setFieldValue('filter_by.category', '');
                  }

                  combobox.closeDropdown();
                  setSearch('');
                }}
                aria-label="Clear value"
              />
            ) : (
              <ComboboxChevron />
            )
          }
          rightSectionPointerEvents={
            !(
              props.formTask?.values.category_id ||
              props.formTaskView?.values.filter_by.category
            )
              ? 'none'
              : 'all'
          }
        >
          {props.formTask?.values.category_id ||
          props.formTaskView?.values.filter_by.category ? (
            <Group gap={'xs'} fz={'sm'} pr={'xs'}>
              {(props.formTask?.values.category_id ||
                props.formTaskView?.values.filter_by.category) == 'inbox' ? (
                <IconInbox size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />
              ) : (
                <IconCategory
                  size={ICON_SIZE / 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              )}

              <Text component="span" inherit>
                {(props.formTask?.values.category_id ||
                  props.formTaskView?.values.filter_by.category) == 'inbox'
                  ? items[0].component
                  : categories?.find(
                      (category) =>
                        category.id ==
                        (props.formTask?.values.category_id ||
                          props.formTaskView?.values.filter_by.category)
                    )?.title}
              </Text>
            </Group>
          ) : (
            <InputPlaceholder fz={'sm'}>
              <Group gap={'xs'} pr={'xs'}>
                <IconCategory
                  size={ICON_SIZE / 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
                Project
              </Group>
            </InputPlaceholder>
          )}
        </InputBase>
      </ComboboxTarget>

      <ComboboxDropdown miw={240}>
        <ComboboxSearch
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search all projects"
        />

        <ComboboxOptions>
          {options.length > 0 ? (
            options
          ) : (
            <ComboboxEmpty>Nothing found</ComboboxEmpty>
          )}
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  );
}
