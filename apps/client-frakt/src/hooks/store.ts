'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useEffect, useRef } from 'react';
import {
  COOKIE_NAME,
  LOCAL_STORAGE_NAME,
  PARAM_NAME,
  STORE_NAME,
} from '@repo/constants/names';
import { loadInitialData } from '@/utilities/store';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@repo/utilities/storage';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { generateUUID } from '@repo/utilities/generators';
import { createClient } from '@/libraries/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import {
  getCookieClient,
  setCookieClient,
} from '@repo/utilities/cookie-client';
import { Role } from '@repo/types/models/enums';
import { WEEK } from '@repo/constants/sizes';
import { ProfileGet } from '@repo/types/models/profile';
import { profileGet } from '@repo/handlers/requests/database/profiles';
import { RoleValue, useStoreRole } from '@/libraries/zustand/stores/role';
import { useMediaQuery } from '@mantine/hooks';
import {
  AppShellValue,
  useStoreAppShell,
} from '@/libraries/zustand/stores/shell';
import { useStoreCategory } from '@/libraries/zustand/stores/category';
import { useStoreAccount } from '@/libraries/zustand/stores/account';
import { useStoreAccountGroup } from '@/libraries/zustand/stores/account-group';
import { useStoreBudget } from '@/libraries/zustand/stores/budget';
import { useStoreTransaction } from '@/libraries/zustand/stores/transaction';
import { categoriesGet } from '@repo/handlers/requests/database/category';
import { budgetsGet } from '@repo/handlers/requests/database/budgets';
import { accountsGet } from '@repo/handlers/requests/database/accounts';
import { accountGroupsGet } from '@repo/handlers/requests/database/account-groups';
import { transactionsGet } from '@repo/handlers/requests/database/transactions';
import { ThemeValue, useStoreTheme } from '@/libraries/zustand/stores/theme';
import { ColorScheme } from '@repo/types/enums';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';

export const useSessionStore = (params?: {
  options?: { clientOnly?: boolean };
}) => {
  const { options } = params || {};
  const { clientOnly } = options || {};

  const { setSession } = useStoreSession();
  const supabase = createClient();

  useEffect(() => {
    const getUserSession = async () => {
      const { data: userSession } = await supabase.auth.getUser();

      const { user: session } = userSession;

      const localId = getFromLocalStorage(LOCAL_STORAGE_NAME.TEMPID);

      if (!session) {
        if (!clientOnly) {
          setSession(null);
        }

        if (!localId) {
          const tempId = generateUUID();
          saveToLocalStorage(LOCAL_STORAGE_NAME.TEMPID, tempId);

          if (clientOnly) {
            setSession({ id: tempId } as any);
          }
        } else {
          if (clientOnly) {
            setSession({ id: localId } as any);
          }
        }
      } else {
        setSession(session);

        if (!localId || localId !== session.id) {
          saveToLocalStorage(LOCAL_STORAGE_NAME.TEMPID, session.id);
        }
      }
    };

    getUserSession();
  }, [setSession, supabase.auth, clientOnly]);
};

export const useUserRoleStore = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { session } = useStoreSession();
  const { setRole } = useStoreRole();

  useEffect(() => {
    if (!session) return;

    const initializeUserRole = async () => {
      // check for user role in cookies
      let userRole = await getCookieClient<RoleValue>(COOKIE_NAME.USER_ROLE);

      if (userRole) {
        // update expiry in cookies
        setCookieClient(COOKIE_NAME.USER_ROLE, userRole, {
          expiryInSeconds: WEEK,
        });
      } else {
        try {
          // fetch user profile
          const getUserProfile = async () => {
            const { item }: { item: ProfileGet } = await profileGet({
              profileId: session?.id as string,
            });

            return item;
          };

          const userProfile = await getUserProfile();

          if (!userProfile) return;

          if (!userProfile.role) {
            const onboardPath = '/onboarding/role';
            if (pathname.includes(onboardPath)) return;

            // redirect to role onboard page
            const redirectPath = `${onboardPath}?${PARAM_NAME.REDIRECT}=${pathname}`;
            router.replace(redirectPath);
          } else {
            // save in cookies
            setCookieClient(COOKIE_NAME.USER_ROLE, userProfile.role, {
              expiryInSeconds: WEEK,
            });

            userRole = userProfile.role as Role;
          }
        } catch (error) {
          console.error(
            '---> handler error - (get & set profile role):',
            error
          );
        }
      }

      // initialize state
      setRole(userRole);
    };

    initializeUserRole();
  }, [setRole, pathname, router, session]);
};

export const useAppshellStore = () => {
  const { setAppShell } = useStoreAppShell();

  useEffect(() => {
    const initializeAppShell = () => {
      let defaultValue: AppShellValue = {
        navbar: true,
        aside: false,
        child: { navbar: false, aside: false },
      };

      const appShellCookie = getCookieClient<AppShellValue>(
        COOKIE_NAME.APP_SHELL
      );

      if (!appShellCookie) {
        setCookieClient(COOKIE_NAME.APP_SHELL, defaultValue, {
          expiryInSeconds: WEEK,
        });
      } else {
        defaultValue = appShellCookie;
      }

      setAppShell(defaultValue);
    };

    initializeAppShell();
  }, [setAppShell]);
};

export const useThemeStore = () => {
  const { setTheme } = useStoreTheme();

  useEffect(() => {
    const initializeTheme = () => {
      let defaultValue: ColorScheme = DEFAULT_COLOR_SCHEME;

      const themeCookie = getCookieClient<ThemeValue>(
        COOKIE_NAME.COLOR_SCHEME_STATE
      );

      if (!themeCookie) {
        setCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE, defaultValue, {
          expiryInSeconds: WEEK,
        });
      } else {
        defaultValue = themeCookie;
      }

      setTheme(defaultValue);
    };

    initializeTheme();
  }, [setTheme]);
};

export const useStoreData = (params?: {
  options?: { clientOnly?: boolean };
}) => {
  const { options } = params || {};
  const { clientOnly } = options || {};

  const prevItemsRef = useRef<any[]>([]);

  const { session } = useStoreSession();
  const { setCategories } = useStoreCategory();
  const { setBudgets } = useStoreBudget();
  const { setAccounts } = useStoreAccount();
  const { setAccountGroups } = useStoreAccountGroup();
  const { setTransactions } = useStoreTransaction();

  useEffect(() => {
    if (prevItemsRef.current.length) return;

    const loadCategories = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.CATEGORIES,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return { items: [] };
          } else {
            return await categoriesGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setCategories(stateUpdateItems),
      });
    };

    loadCategories();
  }, [setCategories, session, clientOnly]);

  useEffect(() => {
    if (prevItemsRef.current.length) return;

    const loadBudgets = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.BUDGETS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return { items: [] };
          } else {
            return await budgetsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) => setBudgets(stateUpdateItems),
      });
    };

    loadBudgets();
  }, [setBudgets, session, clientOnly]);

  useEffect(() => {
    if (prevItemsRef.current.length) return;

    const loadAccounts = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.ACCOUNTS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return { items: [] };
          } else {
            return await accountsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setAccounts(stateUpdateItems),
      });
    };

    loadAccounts();
  }, [setAccounts, session, clientOnly]);

  useEffect(() => {
    if (prevItemsRef.current.length) return;

    const loadAccountGroups = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.ACCOUNT_GROUPS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return { items: [] };
          } else {
            return await accountGroupsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setAccountGroups(stateUpdateItems),
      });
    };

    loadAccountGroups();
  }, [setAccountGroups, session, clientOnly]);

  useEffect(() => {
    if (prevItemsRef.current.length) return;

    const loadTransactions = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.TRANSACTIONS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return { items: [] };
          } else {
            return await transactionsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) =>
          setTransactions(stateUpdateItems),
      });
    };

    loadTransactions();
  }, [setTransactions, session, clientOnly]);
};
