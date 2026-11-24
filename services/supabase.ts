import { createClient, Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// SUPABASE CONFIGURATION
// Replace these with your actual Supabase project credentials
// Found in: Supabase Dashboard → Settings → API
// ============================================================
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Get the currently authenticated user.
 * Returns null if no user is signed in.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.warn('[Supabase] getCurrentUser error:', error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error('[Supabase] getCurrentUser unexpected error:', err);
    return null;
  }
}

/**
 * Get the current auth session (includes access token, refresh token, etc.).
 * Returns null if no active session.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.warn('[Supabase] getSession error:', error.message);
      return null;
    }

    return session;
  } catch (err) {
    console.error('[Supabase] getSession unexpected error:', err);
    return null;
  }
}

/**
 * Sign the current user out and clear the session.
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('[Supabase] signOut error:', error.message);
      throw error;
    }
  } catch (err) {
    console.error('[Supabase] signOut unexpected error:', err);
    throw err;
  }
}

/**
 * Get the authorization header for API requests.
 * Returns Bearer token string or null if not authenticated.
 */
export async function getAuthHeader(): Promise<string | null> {
  const session = await getSession();
  if (!session?.access_token) return null;
  return `Bearer ${session.access_token}`;
}
