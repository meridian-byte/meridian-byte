/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { hasLength } from '@mantine/form';
import { capitalizeWords, segmentFullName } from '@repo/utils';
import { profileUpdate } from '@repo/handlers';
import { useFormBase } from '../../form';
import { useStoreSession } from '@repo/store';
import { getClientApiUrl } from '@repo/constants';
import { SessionCookie } from '@repo/types';
import { setSession as setSessionServer } from '@repo/auth';

export const useFormUserProfile = () => {
  const session = useStoreSession((s) => s.session);
  const setSession = useStoreSession((s) => s.setSession);

  const fullname = `${session?.profile.firstName || ''} ${session?.profile.lastName || ''}`.trim();

  const { form, submitted, handleSubmit } = useFormBase<{
    name: string;
    user_name: string;
  }>(
    {
      name: fullname || 'Set Name',
      user_name: session?.profile.userName || 'Set username',
    },
    {
      name: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
      user_name: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
    },
    {
      hideSuccessNotification: true,
      onSubmit: async (rawValues) => {
        if (!session) throw new Error('You must be signed in');
        if (!form.isDirty()) throw new Error('Update at least one form field');

        const nameSegments = segmentFullName(rawValues.name || '');

        const cleanValues = {
          name: capitalizeWords(rawValues.name.trim()),
          firstName: nameSegments.first.trim(),
          lastName: nameSegments.last.trim(),
          userName: rawValues.user_name.trim(),
        };

        const response = await profileUpdate(getClientApiUrl(), {
          customized: true,
          id: session.id,
          ...cleanValues,
        });

        if (!response) throw new Error('No response from server');

        if (!response.ok) {
          const result = await response.json().catch(() => null);
          throw new Error(result?.message || 'Failed to update profile');
        }

        const updatedSession: SessionCookie = {
          ...session,
          profile: {
            ...session.profile,
            firstName: cleanValues.firstName,
            lastName: cleanValues.lastName,
            userName: cleanValues.userName,
          },
        };

        setSession({
          ...session,
          profile: {
            ...session.profile,
            firstName: cleanValues.firstName,
            lastName: cleanValues.lastName,
            userName: cleanValues.userName,
          },
        });

        // update server session cookie
        await setSessionServer(updatedSession);

        window.location.reload();

        return { response };
      },
      onError: (error) => {
        console.error('Profile update error:', error);
      },
    },
  );

  return { form, submitted, handleSubmit, session };
};
