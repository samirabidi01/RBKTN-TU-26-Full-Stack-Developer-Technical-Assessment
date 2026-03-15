import { create } from "zustand";
import type { AuthResponse, AuthStore, User } from "./authTypes";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

export const useAuthStore = create<AuthStore>((set) => ({
  token: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  isAuthenticated: !!storedToken,
  setAuth: ({ token, user }: AuthResponse) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set((state) => ({
      ...state,
      user,
      isAuthenticated: !!state.token,
    }));
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));