/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useThrottledCallback } from '@mantine/hooks';
import { COOKIE_NAME, LOCAL_STORAGE_NAME } from '@repo/constants/names';
import { WEEK } from '@repo/constants/sizes';
import { fetchCountryData } from '@repo/services/api/geo';
import { CountryData, CountryDataOptions } from '@repo/types/responses';
import {
  getCookieClient,
  setCookieClient,
} from '@repo/utilities/cookie-client';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@repo/utilities/storage';
import { useCallback, useEffect, useState } from 'react';

export const useCountryData = (
  countryName?: string,
  options?: CountryDataOptions
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CountryData[]>([]);

  const cookieKey = !countryName
    ? COOKIE_NAME.LOCAL.COUNTRIES
    : COOKIE_NAME.LOCAL.COUNTRY;
  const storageKey = !countryName
    ? LOCAL_STORAGE_NAME.COUNTRIES
    : LOCAL_STORAGE_NAME.COUNTRY;

  const hasCache = getCookieClient(cookieKey);

  const loadData = useCallback(async () => {
    setLoading(true);

    if (!hasCache) {
      const countryData = await fetchCountryData(countryName, options);
      saveToLocalStorage(storageKey, countryData);
      setCookieClient(cookieKey, true, { expiryInSeconds: WEEK });
      setData(countryData);
    } else {
      const stored = await getFromLocalStorage(storageKey);
      setData(stored ?? []);
    }

    setLoading(false);
  }, [hasCache, countryName, options, storageKey, cookieKey]);

  const throttledLoad = useThrottledCallback(loadData, 5000);

  useEffect(() => {
    throttledLoad();
  }, [throttledLoad]);

  return { data, loading };
};
