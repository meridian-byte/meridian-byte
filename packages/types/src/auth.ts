import { AuthAction } from './enums';

export type SignIn = {
  formData: { email: string; otp?: string };
  options: { action?: AuthAction; redirectUrl?: string; baseUrl?: string };
};

export type SignOut = {
  options: { baseUrl: string };
};
