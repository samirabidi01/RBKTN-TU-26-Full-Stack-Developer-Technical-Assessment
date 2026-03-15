import { api } from "./axios";
import type { AuthResponse, LoginInput, RegisterInput, User } from "../features/auth/authTypes";

export async function registerUser(payload: RegisterInput) {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function loginUser(payload: LoginInput) {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}