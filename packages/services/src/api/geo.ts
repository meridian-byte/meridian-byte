/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { HEADERS } from '@repo/constants/other';
import { GEO_DATA_URL } from '@repo/constants/paths';
import { CountryData, CountryDataOptions } from '@repo/types/responses';

export const fetchCountryData = async (
  countryName?: string,
  options: CountryDataOptions = {
    name: true,
    cca2: true,
    currencies: true,
    idd: true,
    region: true,
    subregion: true,
    languages: true,
    timezones: true,
    flags: true,
  }
): Promise<CountryData[]> => {
  try {
    const cca2 = options.cca2 ? 'cca2,' : '';
    const currencies = options.currencies ? 'currencies,' : '';
    const idd = options.idd ? 'idd,' : '';
    const region = options.region ? 'region,' : '';
    const subregion = options.subregion ? 'subregion,' : '';
    const languages = options.languages ? 'languages,' : '';
    const timezones = options.timezones ? 'timezones,' : '';
    const flags = options.flags ? 'flags,' : '';
    const name = options.name ? 'name' : '';

    const queryParams = `fields=${cca2 + currencies + idd + region + subregion + languages + timezones + flags + name}`;

    const country = countryName ? `name/${countryName || 'Kenya'}` : 'all';

    const urlCountry = `${GEO_DATA_URL.COUNTRIES}/${country}?${queryParams}`;

    const getCountryData = await fetch(urlCountry, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const countryData = await getCountryData.json();

    return countryData;
  } catch (error) {
    console.error('---> service error (get country data):', error);
    throw error;
  }
};
