import { useCallback, useMemo } from 'react';
import {
  Combobox,
  ComboboxChevron,
  ComboboxDropdown,
  ComboboxEmpty,
  ComboboxOptions,
  ComboboxSearch,
  ComboboxTarget,
  Group,
  InputBase,
  InputPlaceholder,
  Loader,
  ScrollAreaAutosize,
  Text,
} from '@mantine/core';
import ImageDefault from '../../images/default';
import { CountryData } from '@repo/types/responses';
import { useCountryCodesCombobox } from '@repo/hooks/input/country-codes';
import classes from './country-code.module.scss';

export default function CountryCode({
  formValue,
  onChange,
  error,
}: {
  formValue: string;
  onChange: (value: string) => void;
  error?: boolean;
}) {
  const {
    combobox,
    search,
    setSearch,
    value,
    setValue,
    searchResults,
    loading,
    getDialCode,
  } = useCountryCodesCombobox(formValue, 'all');

  const options = useMemo(
    () =>
      searchResults.map((item, index) => {
        const dialCode = getDialCode(item.idd);
        return getCombobox(item, dialCode, index);
      }),
    [searchResults, getDialCode]
  );

  const onOptionSubmit = useCallback(
    (val: string) => {
      setValue(val);
      onChange(val);
      combobox.closeDropdown();
    },
    [combobox]
  );

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={onOptionSubmit}
      position="bottom-start"
      classNames={{ dropdown: classes.dropdown, option: classes.option }}
    >
      <ComboboxTarget>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<ComboboxChevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          classNames={{ root: classes.rootInput, input: classes.inputInput }}
          error={error}
        >
          {value || <InputPlaceholder>Code</InputPlaceholder>}
        </InputBase>
      </ComboboxTarget>

      <ComboboxDropdown>
        <ComboboxSearch
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search country"
          disabled={loading}
        />
        <ComboboxOptions>
          {options.length > 0 ? (
            <ScrollAreaAutosize
              mah={200}
              type={options.length > 6 ? 'always' : 'never'}
              offsetScrollbars={options.length > 6}
              scrollbarSize={6}
              scrollbars="y"
            >
              {options}
            </ScrollAreaAutosize>
          ) : (
            <ComboboxEmpty>
              {loading ? <Loader size={'xs'} /> : 'Nothing found'}
            </ComboboxEmpty>
          )}
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  );
}

const getCombobox = (
  listItem: CountryData,
  dialCode: string,
  index: number
) => {
  const name = listItem.name?.common;
  const key = name || `(${index}) ${dialCode}`;
  const flags = listItem.flags;

  return (
    <Combobox.Option value={dialCode} key={key} mr={3}>
      <Group gap={'xs'}>
        {flags?.png && (
          <ImageDefault
            src={flags.png}
            alt={flags.alt || name}
            height={20}
            width={28}
            fit="contain"
          />
        )}

        <Text component="span" inherit miw={{ base: 48, xs: 56 }}>
          {`(${dialCode})`}
        </Text>

        <Text component="span" inherit>
          {name}
        </Text>
      </Group>
    </Combobox.Option>
  );
};
