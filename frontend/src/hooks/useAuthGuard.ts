import { useAuthStore } from "../features/auth/authStore";

export function useAuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return {
    isAuthenticated,
    user,
  };
}