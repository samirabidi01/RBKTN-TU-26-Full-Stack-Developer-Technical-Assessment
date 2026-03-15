import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, loginUser, registerUser } from "../../api/authApi";
import { queryClient } from "../../app/providers";
import { useAuthStore } from "./authStore";
import type { LoginInput, RegisterInput, User } from "./authTypes";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginInput) => loginUser(payload),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["assignedTasks"] });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterInput) => registerUser(payload),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useMe(enabled = true) {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery<User>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: enabled && !!token,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}