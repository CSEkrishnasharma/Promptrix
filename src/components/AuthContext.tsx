import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAILS: readonly string[] = import.meta.env.VITE_ADMIN_EMAILS
  ? (import.meta.env.VITE_ADMIN_EMAILS as string).split(',').map(e => e.trim().toLowerCase())
  : [];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize and check existing session
  useEffect(() => {
    async function checkSession() {
      const storedToken = localStorage.getItem('promptrix-token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(storedToken);
          
          const isUserAdmin = data.user.role === 'admin' || (data.user.email && ADMIN_EMAILS.includes(data.user.email.toLowerCase()));
          setIsAdmin(isUserAdmin);
        } else {
          // Token expired or invalid
          localStorage.removeItem('promptrix-token');
        }
      } catch (error) {
        console.error("Error verifying neural session:", error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to authenticate neural credentials.');
    }

    localStorage.setItem('promptrix-token', data.token);
    setUser(data.user);
    setToken(data.token);

    const isUserAdmin = data.user.role === 'admin' || (data.user.email && ADMIN_EMAILS.includes(data.user.email.toLowerCase()));
    setIsAdmin(isUserAdmin);
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to initialize neural linkage account.');
    }

    localStorage.setItem('promptrix-token', data.token);
    setUser(data.user);
    setToken(data.token);

    const isUserAdmin = data.user.role === 'admin' || (data.user.email && ADMIN_EMAILS.includes(data.user.email.toLowerCase()));
    setIsAdmin(isUserAdmin);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('promptrix-token');
      setUser(null);
      setToken(null);
      setIsAdmin(false);
    }
  };

  const updateUserProfile = async (displayName: string, photoURL: string) => {
    const storedToken = localStorage.getItem('promptrix-token');
    if (!storedToken) throw new Error('Not authenticated.');

    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      },
      body: JSON.stringify({ displayName, photoURL })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update neural profile.');
    }

    setUser(prev => prev ? { ...prev, displayName, photoURL } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, token, login, signup, logout, updateUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
