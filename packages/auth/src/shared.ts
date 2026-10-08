import { AUTH_URLS, COOKIE_NAME, SECONDS_HOUR, SECONDS_WEEK } from '@repo/constants';
import {
  dbAccountUpsert,
  dbProfileUpsert,
  dbSessionCreate,
  dbUserUpsert,
  dbWorkspaceUpsert,
} from '@repo/handlers';
import { AccountGet, ProfileGet, SessionCookie, SignIn, UserGet, WorkspaceGet } from '@repo/types';
import {
  generateOtpCode,
  getCookieServer,
  getEmailLocalPart,
  isProduction,
  jwtOps,
  setCookieServer,
} from '@repo/utils';
import { NextRequest, NextResponse } from 'next/server';

type JwtOps = Awaited<ReturnType<typeof jwtOps>>;
type SignFunction = JwtOps['sign'];

export const checkSession = async (
  sessionCookie: string | null,
  sessionFunctions: {
    sessionMissing: (cookie: typeof sessionCookie) => Promise<void>;
    sessionInvalid: (cookie: string) => Promise<void>;
    sessionValid: (payload: SessionCookie, signFunction: SignFunction) => Promise<void>;
  },
) => {
  const now = new Date();

  let sessionPayload: SessionCookie | null = null;

  if (sessionCookie) {
    try {
      const jwt = await jwtOps();
      sessionPayload = await jwt.unsign<SessionCookie>(sessionCookie);
    } catch (error) {
      // Catch ERR_JWT_EXPIRED or signature validation errors; sessionPayload remains null
      sessionPayload = null;
    }
  }

  if (!sessionCookie) {
    // handle missing session cookie
    await sessionFunctions.sessionMissing(sessionCookie);
  } else if (!sessionPayload || now > new Date(sessionPayload.expiresAt)) {
    // handle invalid/expired session
    await sessionFunctions.sessionInvalid(sessionCookie);
  } else {
    const jwt = await jwtOps();

    // handle valid session
    await sessionFunctions.sessionValid(
      sessionPayload,
      jwt.sign.bind(jwt),
      /**
       * Can pass jwt.sign directly,
       * but wrapping in arrow function or
       * using '.bind(jwt)' keeps `jwt.sign` bound to `jwt`
       *  */
    );
  }
};

export const handlePreAuth = async (response: NextResponse, values?: SignIn['values']) => {
  // create build objects from existing and update login cookie

  const loginCookie: SessionCookie | null = await getCookieServer(COOKIE_NAME.AUTH.LOGIN);
  if (!loginCookie) throw new Error('Missing client login cookie.');

  const now = new Date();

  const userRecord: UserGet = {
    ...loginCookie.user,
    updatedAt: now.toISOString() as any,
  };

  const accountRecords: AccountGet[] = [
    {
      ...loginCookie.accounts[0]!, // user was limited to only 1 account before login
      email: values?.email || '',
      updatedAt: now.toISOString() as any,
    },
  ];

  // create otp and sign it
  const otpValue = generateOtpCode(8).toString();
  const jwt = await jwtOps();
  const { signature } = await jwt.sign({ otpValue }); // defaulted to expiry of 5 min

  // build session object
  const sessionRecord: SessionCookie = {
    ...loginCookie,
    otp: signature,
    updatedAt: now.toISOString() as any,
    user: userRecord,
    accounts: accountRecords,
  };

  response.cookies.set(COOKIE_NAME.AUTH.LOGIN, JSON.stringify(sessionRecord), {
    maxAge: SECONDS_HOUR,
    path: '/',
    httpOnly: false, // needed in both client & server env's
    secure: isProduction(),
    sameSite: 'lax',
  });

  return { otpValue, response };
};

export const handlePostAuth = async (
  values: SignIn['values'],
  loginCookie: SessionCookie,
  workspaces?: WorkspaceGet[],
): Promise<{
  sessionObject: SessionCookie;
  authCookieValue: string;
  defaultWorkspaceId: string;
}> => {
  // handle user db record
  const { user } = await dbUserUpsert(loginCookie.user, values.email);

  const userObject: UserGet = {
    ...loginCookie.user,
    ...user,
    createdAt: user.createdAt.toISOString() as any,
    updatedAt: user.updatedAt.toISOString() as any,
  };

  // handle account db records
  const { accounts } = await dbAccountUpsert(loginCookie.accounts, userObject.id);

  const accountObjects: AccountGet[] = accounts.map((ai, i) => {
    if (i == 0)
      return {
        ...loginCookie.accounts[0],
        ...ai,
        userId: userObject.id,
        createdAt: user.createdAt.toISOString() as any,
        updatedAt: user.updatedAt.toISOString() as any,
      };

    return {
      ...ai,
      userId: userObject.id,
      createdAt: user.createdAt.toISOString() as any,
      updatedAt: user.updatedAt.toISOString() as any,
    };
  });

  // handle workspace db records
  if (!workspaces) throw new Error('Workspaces are required.');
  const { defaultWorkspaceId } = await dbWorkspaceUpsert(workspaces, accountObjects[0]!.id);

  // handle session profile record
  const extrapolatedName = getEmailLocalPart(accountObjects[0]!.email);
  const { profile, preExisting } = await dbProfileUpsert(
    {
      ...loginCookie.profile,
      userName: loginCookie.profile.userName || extrapolatedName,
      firstName: loginCookie.profile.firstName || extrapolatedName,
      lastName: loginCookie.profile.lastName || null,
    },
    userObject.id,
    accountObjects[0]!,
  );

  // // send onboard email
  // if (isProduction() && !preExisting) {
  //   const name = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

  //   await emailSendOnboarding({
  //     to: props.email,
  //     userName: name || profile.userName || props.email,
  //     appName: COMPANY_NAME,
  //   });

  //   await emailContactAdd({ email: props.email, name }, false);
  // }

  const profileObject: ProfileGet = {
    ...loginCookie.profile,
    ...profile,
  };

  // handle session db record
  const { session } = await dbSessionCreate(
    {
      id: loginCookie.id,
      otp: loginCookie.otp,
      timezone: loginCookie.timezone,
      expiresAt: loginCookie.expiresAt,
      syncStatus: loginCookie.syncStatus,
      createdAt: loginCookie.createdAt,
      updatedAt: loginCookie.updatedAt,
    },
    accounts,
  );

  const sessionObject: SessionCookie = {
    ...loginCookie,
    ...session,
    profile: profileObject,
    accounts: accountObjects,
  };

  // create the auth cookie
  const jwt = await jwtOps();
  const { signature } = await jwt.sign(sessionObject, SECONDS_WEEK);

  return { sessionObject, authCookieValue: signature, defaultWorkspaceId };
};
