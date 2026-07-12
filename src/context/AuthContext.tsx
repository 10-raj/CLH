import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's profile (role, name) from user_profiles.
  // IMPORTANT: never call this inside onAuthStateChange — it deadlocks the Supabase client.
  const fetchUserProfile = useCallback(async (userId: string, userEmail: string): Promise<User> => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, name')
      .eq('id', userId)
      .maybeSingle();

    return {
      id: userId,
      email: userEmail,
      name: profile?.name || userEmail.split('@')[0],
      role: (profile?.role as 'user' | 'admin') || 'user',
    };
  }, []);

  useEffect(() => {
    // 1. Restore session on page load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profileUser = await fetchUserProfile(session.user.id, session.user.email || '');
        setUser(profileUser);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes — but NEVER call Supabase inside here.
    //    Use setTimeout to defer any async work outside the auth lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Defer the profile fetch so it runs outside the onAuthStateChange critical section
      const uid = session.user.id;
      const email = session.user.email || '';
      setTimeout(async () => {
        const profileUser = await fetchUserProfile(uid, email);
        setUser(profileUser);
        setLoading(false);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Fetch the profile immediately after login so the admin role is available
    if (data.user) {
      const profileUser = await fetchUserProfile(data.user.id, data.user.email || '');
      setUser(profileUser);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
