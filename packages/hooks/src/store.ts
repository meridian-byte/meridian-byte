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
import { loadInitialData } from '@repo/libraries/store';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@repo/utilities/storage';
import {
  SessionValue,
  useStoreSession,
} from '@repo/libraries/zustand/stores/session';
import { generateUUID } from '@repo/utilities/generators';
import { createClient } from '@repo/libraries/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import {
  getCookieClient,
  setCookieClient,
} from '@repo/utilities/cookie-client';
import { Role } from '@repo/types/models/enums';
import { WEEK } from '@repo/constants/sizes';
import { ProfileGet } from '@repo/types/models/profile';
import { profileGet } from '@repo/handlers/requests/database/profiles';
import { RoleValue, useStoreRole } from '@repo/libraries/zustand/stores/role';
import {
  AppShellValue,
  useStoreAppShell,
} from '@repo/libraries/zustand/stores/shell';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreAccount } from '@repo/libraries/zustand/stores/account';
import { useStoreAccountGroup } from '@repo/libraries/zustand/stores/account-group';
import { useStoreBudget } from '@repo/libraries/zustand/stores/budget';
import { useStoreTransaction } from '@repo/libraries/zustand/stores/transaction';
import { categoriesGet } from '@repo/handlers/requests/database/category';
import { budgetsGet } from '@repo/handlers/requests/database/budgets';
import { accountsGet } from '@repo/handlers/requests/database/accounts';
import { accountGroupsGet } from '@repo/handlers/requests/database/account-groups';
import { transactionsGet } from '@repo/handlers/requests/database/transactions';
import {
  ThemeValue,
  useStoreTheme,
} from '@repo/libraries/zustand/stores/theme';
import { ColorScheme } from '@repo/types/enums';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import { useStoreNotebook } from '@repo/libraries/zustand/stores/notebook';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useStoreLink } from '@repo/libraries/zustand/stores/link';
import { linksGet } from '@repo/handlers/requests/database/links';
import { notesGet } from '@repo/handlers/requests/database/notes';
import { notebooksGet } from '@repo/handlers/requests/database/notebooks';
import { useStoreFood } from '@repo/libraries/zustand/stores/food';
import { useStoreMeal } from '@repo/libraries/zustand/stores/meal';
import { useStoreServing } from '@repo/libraries/zustand/stores/serving';
import { useStoreEat } from '@repo/libraries/zustand/stores/eat';
import { useStoreMass } from '@repo/libraries/zustand/stores/mass';
import { foodsGet } from '@repo/handlers/requests/database/foods';
import { mealsGet } from '@repo/handlers/requests/database/meals';
import { servingsGet } from '@repo/handlers/requests/database/servings';
import { eatsGet } from '@repo/handlers/requests/database/eats';
import { massesGet } from '@repo/handlers/requests/database/masses';
import { useMediaQuery } from '@mantine/hooks';

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
  const desktop = useMediaQuery('(min-width: 62em)');

  const { setAppShell } = useStoreAppShell();

  useEffect(() => {
    const initializeAppShell = () => {
      let defaultValue: AppShellValue = {
        navbar: true,
        aside: false,
        child: { navbar: desktop ? true : false, aside: false },
      };

      const appShellCookie = getCookieClient<AppShellValue>(
        COOKIE_NAME.APP_SHELL
      );

      if (!appShellCookie) {
        setCookieClient(COOKIE_NAME.APP_SHELL, defaultValue, {
          expiryInSeconds: WEEK,
        });
      } else {
        defaultValue = {
          ...appShellCookie,
          child: { ...appShellCookie.child, navbar: desktop ? true : false },
        };
      }

      setAppShell(defaultValue);
    };

    initializeAppShell();
  }, [setAppShell, desktop]);
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

export const useUserStatesStore = () => {
  const { setUserStates } = useStoreUserStates();

  useEffect(() => {
    const initializeUserState = () => {
      setUserStates({ editing: true });
    };

    initializeUserState();
  }, [setUserStates]);
};

type LoadStoreConfig<TItems = any, THookReturn = any> = {
  dataStore: (typeof STORE_NAME)[keyof typeof STORE_NAME];
  useStoreHook: () => THookReturn;
  fetchItems: () => Promise<{ items: TItems[] }>;
  setState: (store: THookReturn, items: TItems[]) => void;
};

export const LOAD_STORES: Record<string, LoadStoreConfig> = {
  categories: {
    dataStore: STORE_NAME.CATEGORIES,
    useStoreHook: useStoreCategory,
    fetchItems: categoriesGet,
    setState: (store, items) => store.setCategories(items),
  },
  budgets: {
    dataStore: STORE_NAME.BUDGETS,
    useStoreHook: useStoreBudget,
    fetchItems: budgetsGet,
    setState: (store, items) => store.setBudgets(items),
  },
  accounts: {
    dataStore: STORE_NAME.ACCOUNTS,
    useStoreHook: useStoreAccount,
    fetchItems: accountsGet,
    setState: (store, items) => store.setAccounts(items),
  },
  accountGroups: {
    dataStore: STORE_NAME.ACCOUNT_GROUPS,
    useStoreHook: useStoreAccountGroup,
    fetchItems: accountGroupsGet,
    setState: (store, items) => store.setAccountGroups(items),
  },
  transactions: {
    dataStore: STORE_NAME.TRANSACTIONS,
    useStoreHook: useStoreTransaction,
    fetchItems: transactionsGet,
    setState: (store, items) => store.setTransactions(items),
  },
  notebooks: {
    dataStore: STORE_NAME.NOTEBOOKS,
    useStoreHook: useStoreNotebook,
    fetchItems: notebooksGet,
    setState: (store, items) => store.setNotebooks(items),
  },
  notes: {
    dataStore: STORE_NAME.NOTES,
    useStoreHook: useStoreNote,
    fetchItems: notesGet,
    setState: (store, items) => store.setNotes(items),
  },
  links: {
    dataStore: STORE_NAME.LINKS,
    useStoreHook: useStoreLink,
    fetchItems: linksGet,
    setState: (store, items) => store.setLinks(items),
  },
  foods: {
    dataStore: STORE_NAME.FOODS,
    useStoreHook: useStoreFood,
    fetchItems: foodsGet,
    setState: (store, items) => store.setFoods(items),
  },
  meals: {
    dataStore: STORE_NAME.MEALS,
    useStoreHook: useStoreMeal,
    fetchItems: mealsGet,
    setState: (store, items) => store.setMeals(items),
  },
  servings: {
    dataStore: STORE_NAME.SERVINGS,
    useStoreHook: useStoreServing,
    fetchItems: servingsGet,
    setState: (store, items) => store.setServings(items),
  },
  eats: {
    dataStore: STORE_NAME.EATS,
    useStoreHook: useStoreEat,
    fetchItems: eatsGet,
    setState: (store, items) => store.setEats(items),
  },
  masses: {
    dataStore: STORE_NAME.MASSES,
    useStoreHook: useStoreMass,
    fetchItems: massesGet,
    setState: (store, items) => store.setMasses(items),
  },
} as const;

type LoadStoreKey = keyof typeof LOAD_STORES;

const useGenericLoader = <K extends LoadStoreKey>(params: {
  storeKey: K;
  clientOnly?: boolean;
  session?: SessionValue | null;
}) => {
  const { storeKey, clientOnly, session } = params;
  const prevItemsRef = useRef<any[]>([]);
  const noSession = !session || !session?.email;

  const config = LOAD_STORES[storeKey];
  const store = config.useStoreHook();

  useEffect(() => {
    const load = async () => {
      if (prevItemsRef.current.length) return;

      const data = clientOnly
        ? { items: [] }
        : noSession
          ? { items: [] }
          : await config.fetchItems();

      await loadInitialData({
        prevItemsRef,
        dataStore: config.dataStore,
        session,
        dataFetchFunction: async () => data,
        stateUpdateFunction: (items: any[]) => config.setState(store, items),
      });
    };

    load();
  }, [store, clientOnly, session, noSession]);
};

export const useLoadStores = (params?: {
  options?: {
    clientOnly?: boolean;
    storesToLoad: Partial<Record<LoadStoreKey, boolean>>;
  };
}) => {
  const { options } = params || {};
  const { clientOnly, storesToLoad = {} } = options || {};
  const { session } = useStoreSession();

  const results = {} as Record<string, void>;

  (Object.keys(storesToLoad) as LoadStoreKey[]).forEach((key) => {
    if (!storesToLoad[key]) return;

    results[key] = useGenericLoader({
      storeKey: key,
      clientOnly,
      session,
    });
  });

  return results;
};
