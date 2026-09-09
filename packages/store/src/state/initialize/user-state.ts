'use client';

import { useEffect } from 'react';
import { useStoreUserStates } from '../user-states';

export const useUserStatesStore = () => {
  const setUserStates = useStoreUserStates((s) => s.setUserStates);

  useEffect(() => {
    const initializeUserState = () => {
      setUserStates({ editing: true });
    };

    initializeUserState();
  }, [setUserStates]);
};
