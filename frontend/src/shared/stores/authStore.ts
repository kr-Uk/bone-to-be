import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (userInfo: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (userInfo) => set({ user: userInfo, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
