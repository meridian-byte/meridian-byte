import { useStoreNetwork } from '../network';
import { getNetworkStatus } from '../initialize/network';

export const useNetworkSync = () => {
  const network = useStoreNetwork((s) => s.network);
  const setNetwork = useStoreNetwork((s) => s.setNetwork);

  const refreshNetworkStatus = async () => {
    if (network === undefined) return;
    if (network === null) return;

    const newStatus = await getNetworkStatus();
    if (!newStatus) return;

    if (network.online == newStatus.online) return;

    return setNetwork(newStatus);
  };

  return { network, refreshNetworkStatus };
};
