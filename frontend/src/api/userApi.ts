import { api } from "./axios";
import type { UpdateProfileInput, UserProfile } from "../features/profile/profileTypes";

export async function getProfile() {
  const { data } = await api.get<UserProfile>("/users/profile");
  return data;
}

export async function updateProfile(payload: UpdateProfileInput) {
  const { data } = await api.patch<UserProfile>("/users/profile", payload);
  return data;
}