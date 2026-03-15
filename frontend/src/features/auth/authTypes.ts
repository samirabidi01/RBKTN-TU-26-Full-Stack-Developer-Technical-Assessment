export type UserRole = "user" | "admin";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthStore = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (payload: AuthResponse) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
};