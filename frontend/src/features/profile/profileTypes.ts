import type { User } from "../auth/authTypes";

export type UserProfile = User;

export type UpdateProfileInput = {
  name: string;
};