import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@/lib/InstantBackendClient";
import { useInstantBackend } from "@/contexts/instant-backend-context";

export function useCollections() {
  const { bf, isAuthenticated } = useInstantBackend();

  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!bf) throw new Error("Missing InstantBackend instance");
      return getCollections(bf);
    },
    enabled: isAuthenticated && Boolean(bf),
  });
}

