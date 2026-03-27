/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_RESEND_KEY_GENERAL);

export default resend;
