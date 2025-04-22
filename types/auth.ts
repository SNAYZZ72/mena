import { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface SignUpFormData {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ResetPasswordFormData {
  email: string;
} 