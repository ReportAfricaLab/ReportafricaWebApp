import { create } from 'zustand';
import { setAuthToken } from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  country: string;
  role: string;
  trustLevel: string;
  avatar?: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  country: string;
  isAuthenticated: boolean;
  isDarkMode: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setCountry: (country: string) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  country: 'NG',
  isAuthenticated: false,
  isDarkMode: false,

  setAuth: (user, token) => {
    setAuthToken(token);
    set({ user, token, isAuthenticated: true, country: user.country });
  },

  logout: () => {
    setAuthToken(null);
    set({ user: null, token: null, isAuthenticated: false });
  },

  setCountry: (country) => set({ country }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
