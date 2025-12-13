/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

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
