import { AuthAction } from './enums';

export type SignIn = {
  formData: { email: string };
  options?: { action?: AuthAction; redirectUrl?: string };
};

export type SignUp = { email: string; password: string };
