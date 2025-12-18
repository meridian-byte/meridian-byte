/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { hasLength } from '@mantine/form';
import { capitalizeWords, segmentFullName } from '@repo/utilities/string';
import { createClient } from '@/libraries/supabase/client';
import { profileUpdate } from '@repo/handlers/requests/database/profiles';
import { useFormBase } from '@/hooks/form';
import { useStoreSession } from '@/libraries/zustand/stores/session';

export const useFormUserProfile = () => {
  const supabase = createClient();

  const { session, setSession } = useStoreSession();

  const { form, submitted, handleSubmit } = useFormBase<{
    firstName: string;
    lastName: string;
    phone: string;
  }>(
    {
      firstName: segmentFullName(session?.user_metadata.name || '').first,
      lastName: segmentFullName(session?.user_metadata.name || '').last,
      phone: session?.user_metadata.phone || '',
    },
    {
      firstName: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
      lastName: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters'),
      phone: (v) =>
        v.trim().length > 0 && (v.trim().length < 7 || v.trim().length > 15),
    },
    {
      onSubmit: async (rawValues) => {
        if (!session) throw new Error('You must be signed in');
        if (!form.isDirty()) throw new Error('Update at least one form field');

        const cleanValues = {
          name: capitalizeWords(
            `${rawValues.firstName.trim()} ${rawValues.lastName.trim()}`
          ),
          firstName: rawValues.firstName.trim(),
          lastName: rawValues.lastName.trim(),
          phone: rawValues.phone.trim(),
        };

        const response = await profileUpdate({
          id: session.id,
          first_name: cleanValues.firstName,
          last_name: cleanValues.lastName,
          phone: cleanValues.phone,
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
            phone: cleanValues.phone,
          },
        });

        const { error } = await supabase.auth.updateUser({
          data: { name: cleanValues.name, full_name: cleanValues.name },
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
