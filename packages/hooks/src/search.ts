import { Order } from '@repo/types/enums';
import { sortArray } from '@repo/utilities/array';

export const useSearchCriteria = (params: {
  searchValue: string;
  list: any[];
  limit?: number;
}) => {
  const { searchValue, list, limit } = params;

  const getSearchCriteriaItems = () => {
    if (!searchValue.trim()) return list;

    const searchTerm = searchValue.trim().toLowerCase();
    const notesSorted = sortArray(list, (i) => i.created_at, Order.DESCENDING);

    const listFiltered = notesSorted
      ?.filter((n) => n.title.toLowerCase().includes(searchTerm))
      .slice(0, limit || 20);

    return listFiltered;
  };

  return { searchCriteriaItems: getSearchCriteriaItems() };
};
