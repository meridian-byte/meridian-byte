/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useState, useMemo, useEffect, useRef } from 'react';

export interface PageRange {
  from: number;
  to: number;
}

export const usePaginate = <T>(list: T[], pageSize: number) => {
  const [activePage, setActivePage] = useState(1);
  const prevPageSize = useRef(pageSize);

  // Split the list into chunks efficiently
  const chunkedList = useMemo(() => {
    if (!Array.isArray(list) || list.length === 0) return [];
    const chunks: T[][] = [];
    for (let i = 0; i < list.length; i += pageSize) {
      chunks.push(list.slice(i, i + pageSize));
    }
    return chunks;
  }, [list, pageSize]);

  const totalPages = chunkedList.length;

  // Adjust active page when pageSize changes
  useEffect(() => {
    if (prevPageSize.current !== pageSize && list.length > 0) {
      const prevItemIndex = (activePage - 1) * prevPageSize.current;
      const newPage = Math.floor(prevItemIndex / pageSize) + 1;
      setActivePage(Math.min(newPage, totalPages || 1));
      prevPageSize.current = pageSize;
    }
  }, [pageSize, list.length, activePage, totalPages]);

  // Clamp page if list shrinks
  useEffect(() => {
    if (activePage > totalPages && totalPages > 0) {
      setActivePage(totalPages);
    }
  }, [activePage, totalPages]);

  // Derived items — no need for extra state
  const items = useMemo(
    () => chunkedList[activePage - 1] ?? [],
    [chunkedList, activePage]
  );

  // Page range
  const pageRange = useMemo<PageRange | null>(() => {
    if (items.length === 0) return null;
    const from = (activePage - 1) * pageSize + 1;
    const to = from + items.length - 1;
    return { from, to };
  }, [items, activePage, pageSize]);

  return {
    items,
    activePage,
    setActivePage,
    chunkedList,
    pageRange,
    totalPages,
    hasNext: activePage < totalPages,
    hasPrev: activePage > 1,
    nextPage: () => setActivePage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setActivePage((p) => Math.max(p - 1, 1)),
  };
};
