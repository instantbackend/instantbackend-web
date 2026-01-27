import { useQuery } from "@tanstack/react-query";
import { getUsage } from "@/lib/backendFlowClient";
import { useBackendFlow } from "@/contexts/backend-flow-context";

export function useUsage() {
  const { bf, isAuthenticated, jwtToken } = useBackendFlow();
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

