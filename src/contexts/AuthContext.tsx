import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/customer';

interface AuthContextType {
  user: User | null;
  login: (mobileNumber: string, password: string) => boolean;
  register: (mobileNumber: string, password: string) => boolean;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const register = (mobileNumber: string, password: string): boolean => {
    const users = getUsers();
    const exists = users.find(u => u.mobileNumber === mobileNumber);
    if (exists) {
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      mobileNumber,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const login = (mobileNumber: string, password: string): boolean => {
    const users = getUsers();
    const foundUser = users.find(u => u.mobileNumber === mobileNumber && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (!user) return false;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1 || users[userIndex].password !== oldPassword) {
      return false;
    }

    users[userIndex].password = newPassword;
    saveUsers(users);
    
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, changePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
