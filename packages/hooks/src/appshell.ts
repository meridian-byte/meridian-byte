import { useStoreAppShell, useStoreView } from '@repo/store';

export const useAppshellChild = () => {
  const asideChild = useStoreAppShell((s) => s.appshell?.child?.aside);
  const toggleAsideChild = useStoreAppShell((s) => s.toggleAsideChild);

  // Get your view setter
  const setAsideViewValue = useStoreView((s) => s.setAsideViewValue);

  const handleToggleChildAside = () => {
    // If the aside is currently open and we are about to close it,
    // scrub the asideView value so it doesn't try to reopen on refresh
    if (asideChild) {
      setAsideViewValue(null);
    }

    toggleAsideChild();
  };

  return { asideChild, handleToggleChildAside };
};
