import { hasLength } from '@mantine/form';
import { useFormBase } from '../form';
import { ChatGet } from '@repo/types/models/chat';
import { useChatActions } from '../actions/chat';

export const useFormChat = (params?: { defaultValues?: Partial<ChatGet> }) => {
  const { chatCreate, chatUpdate } = useChatActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ChatGet>>(
    {
      archived: params?.defaultValues?.archived || false,
      temporary: params?.defaultValues?.temporary || false,
      title: params?.defaultValues?.title || '',
    },
    {
      title: hasLength(
        { min: 2, max: 24 },
        'Between 2 and 24 characters required'
      ),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject = {
          ...rawValues,
        };

        if (!params?.defaultValues) {
          chatCreate({
            ...submitObject,
          });
        } else {
          chatUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ChatGet);
        }
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
