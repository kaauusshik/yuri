/**
 * VIRTUWEAR AI — Auth Store (Zustand)
 * Manages authentication state, user session, and auth actions.
 */

import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      // TODO: Check Supabase session / secure-store token
      // For now, just mark as initialized with no user
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ isInitialized: true, isLoading: false });
    } catch {
      set({ isInitialized: true, isLoading: false });
    }
  },

  signIn: async (email: string, _password: string) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate API call — replace with Supabase auth
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const user: User = {
        id: '1',
        email,
        fullName: 'Fashion User',
        avatarUrl: undefined,
        createdAt: new Date().toISOString(),
      };

      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch {
      set({ isLoading: false, error: 'Invalid email or password. Please try again.' });
    }
  },

  signUp: async (fullName: string, email: string, _password: string) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate API call — replace with Supabase auth
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const user: User = {
        id: '1',
        email,
        fullName,
        avatarUrl: undefined,
        createdAt: new Date().toISOString(),
      };

      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch {
      set({ isLoading: false, error: 'Could not create account. Please try again.' });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
