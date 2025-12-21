import { Dispatch, SetStateAction, useState } from 'react';

export type DiaryDateReturnType = {
  date: string | null;
  setDate: Dispatch<SetStateAction<string | null>>;
  handlePrevious: () => void;
  handleNext: () => void;
};

export const useDiaryDate = (): DiaryDateReturnType => {
  const now = new Date();
  const [date, setDate] = useState<string | null>(now.toISOString());

  const handlePrevious = () => {
    if (!date) return;

    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() - 1);
    setDate(d.toISOString());
  };

  const handleNext = () => {
    if (!date) return;

    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + 1);
    setDate(d.toISOString());
  };

  return {
    date,
    setDate,
    handlePrevious,
    handleNext,
  };
};
