'use client';

import { useEffect } from 'react';
import { NetworkValue, useStoreNetwork } from '../network';

export const useNetworkInitialize = () => {
  const setNetwork = useStoreNetwork((s) => s.setNetwork);

  let initialNetworkValue: NetworkValue;

  const getNetwork = async () => {
    initialNetworkValue = await getNetworkStatus();
    setNetwork(initialNetworkValue);
  };

  useEffect(() => {
    getNetwork();
  }, []);

  return { getNetwork };
};

export const getNetworkStatus = async (): Promise<NetworkValue> => {
  // Fetch a lightweight resource with cache-busting
  try {
    const response = await fetch(
      /*
      using a production domain so it returns expected boolean for development
      avoids truthy when api server is local
       */
      `${'https://meridianbyte-api.vercel.app/api'}/app-data?userId=none`,
      {
        method: 'HEAD',
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      console.log('[INFO]:', 'Currently offline. Using client mode sync.');
      return { online: false };
    } else {
      return { online: true };
    }
  } catch (e) {
    console.log('[INFO]:', 'Network loss detected. Falling back to client mode sync.');
    return { online: false };
  }
};
