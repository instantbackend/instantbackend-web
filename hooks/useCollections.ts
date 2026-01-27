import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@/lib/backendFlowClient";
import { useBackendFlow } from "@/contexts/backend-flow-context";

export function useCollections() {
  const { bf, isAuthenticated } = useBackendFlow();

  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!bf) throw new Error("Missing InstantBackend instance");
      return getCollections(bf);
    },
    enabled: isAuthenticated && Boolean(bf),
  });
}

