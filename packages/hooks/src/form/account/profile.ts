/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { hasLength } from '@mantine/form';
import { capitalizeWords, segmentFullName } from '@repo/utilities/string';
import { createClient } from '@repo/libraries/supabase/client';
import { profileUpdate } from '@repo/handlers/requests/database/profiles';
import { useFormBase } from '../../form';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';

export const useFormUserProfile = () => {
  const supabase = createClient();

  const session = useStoreSession((s) => s.session);
  const setSession = useStoreSession((s) => s.setSession);

  const { form, submitted, handleSubmit } = useFormBase<{
    name: string;
    user_name: string;
  }>(
    {
      name: session?.user_metadata.name || 'Set Name',
      user_name: session?.user_metadata.user_name || 'Set username',
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

        const segment = segmentFullName(rawValues.name || '');

        const cleanValues = {
          name: capitalizeWords(rawValues.name.trim()),
          firstName: segment.first.trim(),
          lastName: segment.last.trim(),
          userName: rawValues.user_name.trim(),
        };

        const response = await profileUpdate({
          customized: true,
          id: session.id,
          first_name: cleanValues.firstName,
          last_name: cleanValues.lastName,
          user_name: cleanValues.userName,
        });

        if (!response) throw new Error('No response from server');

        if (!response.ok) {
          const result = await response.json().catch(() => null);
          throw new Error(result?.message || 'Failed to update profile');
        }

        setSession({
          ...session,
          user_metadata: {
            ...session.user_metadata,
            name: cleanValues.name,
            full_name: cleanValues.name,
            user_name: cleanValues.userName,
          },
        });

        const { error } = await supabase.auth.updateUser({
          data: {
            name: cleanValues.name,
            full_name: cleanValues.name,
            user_name: cleanValues.userName,
          },
        });

        if (error) throw error;

        window.location.reload();

        return { response };
      },
      onError: (error) => {
        console.error('Profile update error:', error);
      },
    }
  );

  return { form, submitted, handleSubmit, session };
};
