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
import { useStorePost } from '@/libraries/zustand/stores/post';
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
import { samplePosts } from '@/data/sample/posts';
import { postsGet } from '@repo/handlers/requests/database/posts';

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
    if (!desktop) return;

    const initializeAppShell = () => {
      const appShellCookie = getCookieClient<AppShellValue>(
        COOKIE_NAME.APP_SHELL
      );

      setAppShell(appShellCookie);

      if (appShellCookie)
        setCookieClient(COOKIE_NAME.APP_SHELL, appShellCookie, {
          expiryInSeconds: WEEK,
        });
    };

    initializeAppShell();
  }, [setAppShell, desktop]);
};

export const useStoreData = (params?: {
  options?: { clientOnly?: boolean };
}) => {
  const { options } = params || {};
  const { clientOnly } = options || {};

  const prevItemsRef = useRef<any[]>([]);

  const { session } = useStoreSession();
  const { setPosts } = useStorePost();

  useEffect(() => {
    if (prevItemsRef.current.length) return;

    const loadPosts = async () => {
      await loadInitialData({
        prevItemsRef,
        dataStore: STORE_NAME.POSTS,
        session,
        dataFetchFunction: async () => {
          if (clientOnly) {
            return {
              items: samplePosts, // TODO: remove this after testing
            };
          } else {
            return await postsGet();
          }
        },
        stateUpdateFunction: (stateUpdateItems) => setPosts(stateUpdateItems),
      });
    };

    loadPosts();
  }, [setPosts, session, clientOnly]);
};
