/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { TimerDirection } from '@repo/types/enums';
import { Timer } from '@repo/types/date-time';
import { getTimeElapsed, getTimeRemaining } from '@repo/utilities/date-time';
import { useEffect, useRef, useState } from 'react';

interface UseTimerOptions {
  active?: boolean;
  autoSwitch?: boolean; // when DOWN finishes, start counting UP
}

export function useTimer(
  targetDate: Date,
  direction: TimerDirection = TimerDirection.DOWN,
  options: UseTimerOptions = {}
) {
  const { active = true, autoSwitch = false } = options;

  const getTime = useRef<(targetDate: Date) => Timer | null>(
    direction === TimerDirection.DOWN ? getTimeRemaining : getTimeElapsed
  );

  const [time, setTime] = useState(() => getTime.current(targetDate));
  const [isActive, setActive] = useState(active);
  const [currentDirection, setDirection] = useState(direction);

  const intervalRef = useRef<number | null>(null);

  // Update getTime when direction changes
  useEffect(() => {
    getTime.current =
      currentDirection === TimerDirection.DOWN
        ? getTimeRemaining
        : getTimeElapsed;
  }, [currentDirection]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      const newTime = getTime.current(targetDate);
      setTime(newTime);

      // Handle countdown completion
      if (currentDirection === TimerDirection.DOWN && newTime === null) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        if (autoSwitch) {
          // Switch to counting up
          setDirection(TimerDirection.UP);
          setActive(true);
        } else {
          setActive(false);
        }
      }
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetDate, isActive, currentDirection, autoSwitch]);

  return {
    time,
    setTime,
    isActive,
    setActive,
    direction: currentDirection,
    setDirection,
  };
}
