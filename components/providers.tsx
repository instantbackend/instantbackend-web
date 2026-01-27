"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { BackendFlowProvider, useBackendFlow } from "@/contexts/backend-flow-context";

function QueryClientWithAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useBackendFlow();

  const queryClient = useMemo(() => {
    const handleError = (error: any) => {
      const status = error?.status;
      if (status === 401 || status === 403) {
        logout();
        router.replace("/login");
      }
    };

    return new QueryClient({
      queryCache: new QueryCache({
        onError: handleError,
      }),
      mutationCache: new MutationCache({
        onError: handleError,
      }),
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  }, [logout, router]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BackendFlowProvider>
      <QueryClientWithAuth>{children}</QueryClientWithAuth>
    </BackendFlowProvider>
  );
}

