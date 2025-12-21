import React from 'react';

export const useSyncQueue = (params: {
  syncFunction: (input: any) => void;
}) => {
  const queue = React.useRef<any[]>([]);
  const running = React.useRef(false);

  const runNext = React.useCallback(async () => {
    if (running.current) return;
    const job = queue.current.shift();
    if (!job) return;

    running.current = true;

    try {
      await params.syncFunction(job); // <-- your existing sync logic
    } finally {
      running.current = false;
      runNext(); // process next
    }
  }, []);

  const enqueue = React.useCallback(
    (job: any) => {
      // queue.current = queue.current.filter((j) => j.type !== job.type); // remove old same-type
      queue.current.push(job);
      runNext();
    },
    [runNext]
  );

  return enqueue;
};
