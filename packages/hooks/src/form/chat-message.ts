import { hasLength } from '@mantine/form';
import { useFormBase } from '../form';
import { ChatMessageGet } from '@repo/types/models/chat-message';
import { useChatMessageActions } from '../actions/chat-message';
import { ChatMessageRole } from '@repo/types/models/enums';
import { useChatActions } from '../actions/chat';
import { usePathname, useRouter } from 'next/navigation';
import { extractUuidFromParam } from '@repo/utilities/url';

export const useFormChatMessage = (params?: {
  defaultValues?: Partial<ChatMessageGet>;
}) => {
  const { chatCreate } = useChatActions();
  const { chatMessageCreate, chatMessageUpdate } = useChatMessageActions();

  const pathname = usePathname();
  const router = useRouter();
  const chatId = extractUuidFromParam(pathname);
  // const messageChat = useStoreChat((s) => s.chats?.find((c) => c.id == chatId));

  const { form, submitted, handleSubmit } = useFormBase<
    Partial<ChatMessageGet>
  >(
    {
      content: params?.defaultValues?.content || '',
      error: params?.defaultValues?.error || '',
      role: params?.defaultValues?.role || ChatMessageRole.USER,
      sources: params?.defaultValues?.sources || [],
      search: params?.defaultValues?.search || false,
    },
    {
      content: hasLength(
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

        let newChatId: string | null = null;

        if (!chatId) {
          const newChat = chatCreate({ title: form.values.content });
          if (newChat) newChatId = newChat.id;
        }

        if (!params?.defaultValues) {
          if (!chatId && !newChatId) return;

          chatMessageCreate({
            ...submitObject,
            chat_id: chatId || newChatId || '',
          });
        } else {
          chatMessageUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ChatMessageGet);
        }

        if (!chatId) {
          if (newChatId) router.push(`/app/chat/${newChatId}`);
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
