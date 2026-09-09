import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_RESEND_KEY_GENERAL);

export default resend;
