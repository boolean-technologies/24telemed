import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AuthService, UsersService, type CurrentUser } from '../api';
import { registerUser, type RegisterInput } from './registerApi';
import {
  clearSession,
  loadSession,
  saveSession,
  type Role,
} from './storage';
import { unregisterForPushNotifications } from '@/notifications/register';

export type SignUpInput = {
  role: Role;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  specialty?: string;
};

type AuthState = {
  /** True until the persisted session has been read from storage. */
  isLoading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  user: CurrentUser | null;
  signIn: (role: Role, username: string, password: string) => Promise<void>;
  signUp: (data: SignUpInput) => Promise<{ role: Role; isVerified: boolean }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

function readTokens(res: unknown) {
  const access = (res as { access?: string }).access;
  const refresh = (res as { refresh?: string }).refresh;
  if (!access || !refresh) {
    throw new Error('No token returned by the server.');
  }
  return { access, refresh };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);

  // Restore any persisted session on launch.
  useEffect(() => {
    (async () => {
      try {
        const session = await loadSession();
        if (session) {
          setRole(session.role);
          await refreshUser();
        }
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshUser() {
    try {
      const me = await UsersService.usersCurrentUser();
      setUser(me);
    } catch {
      // Token likely expired/invalid — drop the session.
      await clearSession();
      setUser(null);
      setRole(null);
    }
  }

  async function signIn(nextRole: Role, username: string, password: string) {
    // Patients are "customer" users; they authenticate via the personnel endpoint.
    const tokens =
      nextRole === 'doctor'
        ? await AuthService.authTokenDoctorCreate({ username, password })
        : await AuthService.authTokenPersonnelCreate({ username, password });

    const { access, refresh } = readTokens(tokens);
    await saveSession({ access, refresh, role: nextRole });
    setRole(nextRole);
    await refreshUser();
  }

  async function signUp(data: SignUpInput) {
    const payload: RegisterInput = {
      user_type: data.role === 'doctor' ? 'doctor' : 'customer',
      username: data.username,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      specialty: data.specialty,
    };
    const res = await registerUser(payload);
    await saveSession({
      access: res.access,
      refresh: res.refresh,
      role: data.role,
    });
    setRole(data.role);
    await refreshUser();
    return { role: data.role, isVerified: res.is_verified };
  }

  async function signOut() {
    try {
      await unregisterForPushNotifications();
    } catch {
      // Signing out must still succeed if the device is offline.
    }
    await clearSession();
    setUser(null);
    setRole(null);
  }

  const value = useMemo<AuthState>(
    () => ({
      isLoading,
      isAuthenticated: !!user && !!role,
      role,
      user,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [isLoading, role, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
