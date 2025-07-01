export type Email = {
  email: string;
};

export type SignInFormValues = Email & {
  otp?: string;
};

export interface User extends Email {
  is_active: boolean;
  username: string;
  role: string;
}

export interface VerifyOtpResponse {
  access: string;
  user: User;
}

// src/types/auth.ts

export interface AuthUser extends Email {
  isActive: boolean;
  username?: string;
  accessToken: string;
  role: string;
}

export interface AuthState extends AuthUser {
  isAuthenticated: boolean;
}

