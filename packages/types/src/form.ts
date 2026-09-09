import { UseFormReturnType } from '@mantine/form';

/**
 * Inquiry
 */
export const formValuesInitialInquiry = {
  name: '',
  email: '',
  subject: '',
  phone: '',
  message: '',
  appName: '',
};

export type FormValuesInquiry = typeof formValuesInitialInquiry;

export type FormInquiry = UseFormReturnType<
  FormValuesInquiry,
  (values: FormValuesInquiry) => FormValuesInquiry
>;

/**
 * Blog
 */
export const formValuesInitialComRep = {
  name: '',
  email: '',
  content: '',
};

export type FormValuesComRep = typeof formValuesInitialComRep;

export type FormComRep = UseFormReturnType<
  FormValuesComRep,
  (values: FormValuesComRep) => FormValuesComRep
>;
