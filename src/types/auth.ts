export type UserRole = 'host' | 'mechanic' | 'admin' | null;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  member: boolean;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile | null;
}