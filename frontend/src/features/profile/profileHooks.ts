import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../../api/userApi";
import { queryClient } from "../../app/providers";
import { useAuthStore } from "../auth/authStore";
import type { UpdateProfileInput } from "./profileTypes";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfileInput) => updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}