import { create } from 'zustand';
import { Network } from '@repo/types';

export type NetworkValue = Network | undefined;

interface NetworkState {
  network: NetworkValue;
  setNetwork: (data: NetworkValue) => void;
  clearNetwork: () => void;
}

export const useStoreNetwork = create<NetworkState>((set) => ({
  network: undefined,

  setNetwork: (data) => {
    set({ network: data });
  },

  clearNetwork: () => {
    set({ network: undefined });
  },
}));
