'use client';

import React from 'react';
import { useSubView } from '@repo/store';

export default function TaskList() {
  const { subViewValue, showSubViewStride } = useSubView();

  return <div>TaskList: {subViewValue}</div>;
}
