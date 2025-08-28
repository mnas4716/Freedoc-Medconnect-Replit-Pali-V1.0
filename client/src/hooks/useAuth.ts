import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  // Try Replit Auth first (for patients)
  const { data: replitUser, isLoading: isReplitLoading, error: replitError } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Try session-based auth (for doctors/admins)
  const { data: sessionUser, isLoading: isSessionLoading } = useQuery({
    queryKey: ["/api/auth/session-user"],
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const user = replitUser || sessionUser;
  const isLoading = isReplitLoading || isSessionLoading;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isUnauthorized: !user && !isLoading,
  };
}
