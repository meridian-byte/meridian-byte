import { AuthAction } from './enums';
import { SessionGet } from './models/session';
import { UserGet } from './models/user';
import { AccountGet } from './models/account';
import { ProfileGet } from './models/profile';
import { WorkspaceGet } from './models/workspace';

export type SignIn = {
  values: { email: string; otp?: string };
  options: { action?: AuthAction };
  appData?: { workspaces?: WorkspaceGet[] };
};

export type SignOut = {
  options: { baseUrl: string };
};

export type SessionCookie = SessionGet & {
  user: UserGet;
  accounts: AccountGet[];
  profile: ProfileGet;
};
