import { useQuery } from "@tanstack/react-query";
import { getUsage } from "@/lib/InstantBackendClient";
import { useInstantBackend } from "@/contexts/instant-backend-context";

export function useUsage() {
  const { bf, isAuthenticated, jwtToken } = useInstantBackend();
  const now = new Date();
  const monthKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`;

  return useQuery({
    queryKey: ["usage", monthKey],
    queryFn: async () => {
      if (!bf) throw new Error("Missing InstantBackend instance");
      return getUsage(bf);
    },
    enabled: isAuthenticated && Boolean(bf && jwtToken),
  });
}

