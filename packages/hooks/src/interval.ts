'use client';

import { useEffect, useState } from 'react';

let interval: NodeJS.Timeout | null = null;
let subscribers = new Set<() => void>();

function startGlobalTicker() {
  if (interval) return;

  const schedule = () => {
    const now = Date.now();
    const msUntilNextMinute = 60_000 - (now % 60_000);

    const timeout = setTimeout(() => {
      notify();
      interval = setInterval(notify, 60_000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  };

  schedule();
}

function notify() {
  subscribers.forEach((fn) => fn());
}

export function useMinuteTicker() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((v) => v + 1);

    subscribers.add(rerender);
    startGlobalTicker();

    return () => {
      subscribers.delete(rerender);

      if (subscribers.size === 0 && interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, []);
}
