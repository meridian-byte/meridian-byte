/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useCombobox } from '@mantine/core';
import { filterSearch } from '@repo/utilities/string';
import { Order } from '@repo/types/enums';
import { sortArray } from '@repo/utilities/array';
import { CountryData } from '@repo/types/responses';
import { useEffect, useMemo, useState } from 'react';
import { useCountryData } from '../country-data';

export type SearchMode = 'name' | 'code' | 'all';

export const useCountryCodes = (list: CountryData[] = []) => {
  const getDialCode = (idd: CountryData['idd']) => {
    const withSuffix = idd.suffixes.length === 1;
    return `${idd.root}${withSuffix ? idd.suffixes[0] : ''}`;
  };

  const sortedCodes = useMemo(() => {
    const valid = list.filter((c) => Boolean(getDialCode(c.idd)));
    const selector = (c: CountryData) =>
      Number(getDialCode(c.idd).replace('+', ''));
    return sortArray(valid, selector, Order.ASCENDING);
  }, [list]);

  return { sortedCodes, getDialCode };
};

export const useCountryCodesCombobox = (
  formValue: string,
  searchMode: SearchMode = 'all'
) => {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState(formValue);

  /* ---- fetch & sort ---- */
  const { data, loading } = useCountryData();
  const { sortedCodes, getDialCode } = useCountryCodes(data);

  /* ---- combobox ---- */
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },
    onDropdownOpen: () => combobox.focusSearchInput(),
  });

  /* ---- search results ---- */
  const searchResults = useMemo(() => {
    const selector = (item: CountryData) => {
      const name = item.name?.common ?? '';
      const iso = item.cca2 ?? '';
      const dial =
        item.idd?.root && item.idd?.suffixes?.length
          ? `${item.idd.root}${item.idd.suffixes[0]}`.replace('+', '')
          : '';

      switch (searchMode) {
        case 'name':
          return name;
        case 'code':
          return `${iso} ${dial}`;
        default:
          return `${name} ${iso} ${dial}`.trim();
      }
    };

    return filterSearch(sortedCodes, search, selector);
  }, [sortedCodes, search, searchMode]);

  /* ---- keep internal value synced ---- */
  useEffect(() => {
    setValue(formValue);
  }, [formValue]);

  return {
    search,
    setSearch,
    value,
    setValue,
    combobox,
    searchResults,
    loading,
    getDialCode,
  };
};
