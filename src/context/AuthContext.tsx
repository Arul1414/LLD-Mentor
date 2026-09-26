import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  initials: string;
  streakDays: number;
}

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_alex',
    name: 'Alex Chen',
    email: 'alex.chen@dev.io',
    role: 'Senior Backend Engineer',
    avatarColor: 'from-blue-600 to-indigo-600',
    initials: 'AC',
    streakDays: 7,
  },
  {
    id: 'user_sarah',
    name: 'Sarah Lin',
    email: 'sarah.lin@tech.co',
    role: 'System Design Candidate',
    avatarColor: 'from-violet-600 to-purple-600',
    initials: 'SL',
    streakDays: 12,
  },
  {
    id: 'user_david',
    name: 'David Kim',
    email: 'david.kim@arch.net',
    role: 'Staff Architect',
    avatarColor: 'from-emerald-600 to-teal-600',
    initials: 'DK',
    streakDays: 19,
  },
];

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, name?: string) => void;
  loginDemo: (user: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USERS[0],
  login: () => {},
  loginDemo: () => {},
  logout: () => {},
  isAuthenticated: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lld_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[0];
      }
    }
    // Default to active learner Alex Chen
    return DEMO_USERS[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('lld_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lld_user');
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return;
    }
    const cleanName = name || email.split('@')[0] || 'Learner';
    const initials = cleanName
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: cleanName,
      email,
      role: 'LLD Practitioner',
      avatarColor: 'from-indigo-600 to-violet-600',
      initials: initials || 'LL',
      streakDays: 1,
    };
    setUser(newUser);
  };

  const loginDemo = (selectedUser: UserProfile) => {
    setUser(selectedUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginDemo,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
